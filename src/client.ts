import * as fs from 'fs';
import * as path from 'path';

import Client = require('fabric-client');

const CHANNEL_NAME = 'ksachdeva-exp-channel-1';
const CHANNEL_1_PATH = './../ksachdeva-exp-channel-1.tx';
const KEY_STORE_PATH_ADMIN = './keystore/admin';
const ORDERER_URL = 'grpcs://localhost:7050';
const ORDERER_TLS_CAROOT_PATH = './../crypto-config/ordererOrganizations/ksachdeva-exp.com/orderers/orderer.ksachdeva-exp.com/tls/ca.crt';

const ORG1_ADMIN_MSP = './crypto-config/peerOrganizations/org1.ksachdeva-exp.com/users/Admin@org1.ksachdeva-exp.com/msp';
const ORG2_ADMIN_MSP = './crypto-config/peerOrganizations/org2.ksachdeva-exp.com/users/Admin@org2.ksachdeva-exp.com/msp';
const ORG3_ADMIN_MSP = './crypto-config/peerOrganizations/org3.ksachdeva-exp.com/users/Admin@org3.ksachdeva-exp.com/msp';

export enum Organization {
  ORG1 = 'org1',
  ORG2 = 'org2',
  ORG3 = 'org3'
}

const MSP_DIR = {
  org1: ORG1_ADMIN_MSP,
  org2: ORG2_ADMIN_MSP,
  org3: ORG3_ADMIN_MSP
};

const MSP_ID = {
  org1: 'Org1MSP',
  org2: 'Org2MSP',
  org3: 'Org3MSP'
};

const PEERS = {
  org1: {
    peers: [
      {
        url: 'grpcs://localhost:7051' // peer0
      },
      {
        url: 'grpcs://localhost:8051' // peer1
      }
    ]
  },
  org2: {
    peers: [
      {
        url: 'grpcs://localhost:9051' // peer0
      },
      {
        url: 'grpcs://localhost:10051' // peer1
      }
    ]
  },
  org3: {
    peers: [
      {
        url: 'grpcs://localhost:11051' // peer0
      },
      {
        url: 'grpcs://localhost:12051' // peer1
      }
    ]
  }
};

export async function getPeers(client: Client, org: Organization): Promise<Peer[]> {
  const peers: Peer[] = [];

  for (let i = 0; i < 2; i++) {

    const tls_cacert = `./../crypto-config/peerOrganizations/${org}.ksachdeva-exp.com/peers/peer${i}.${org}.ksachdeva-exp.com/tls/ca.crt`;

    const data = fs.readFileSync(path.join(__dirname, tls_cacert));
    const p = client.newPeer(PEERS[org].peers[i].url, {
      'pem': Buffer.from(data).toString(),
      'ssl-target-name-override': `peer${i}.${org}.ksachdeva-exp.com`
    });

    peers[i] = p;
  }

  return peers;
}

export async function getOrderer(client: Client): Promise<Orderer> {
  // build an orderer that will be used to connect to it
  const data = fs.readFileSync(path.join(__dirname, ORDERER_TLS_CAROOT_PATH));
  const orderer: Orderer = client.newOrderer(ORDERER_URL, {
    'pem': Buffer.from(data).toString(),
    'ssl-target-name-override': 'orderer.ksachdeva-exp.com'
  });

  return orderer;
}

export async function getClient(org: Organization): Promise<Client> {

  const client = new Client();

  console.log('Setting up the cryptoSuite ..');

  // ## Setup the cryptosuite (we are using the built in default s/w based implementation)
  const cryptoSuite = Client.newCryptoSuite();
  cryptoSuite.setCryptoKeyStore(Client.newCryptoKeyStore({
    path: `${KEY_STORE_PATH_ADMIN}-${org}`
  }));

  client.setCryptoSuite(cryptoSuite);

  console.log('Setting up the keyvalue store ..');

  // ## Setup the default keyvalue store where the state will be stored
  const store = await Client.newDefaultKeyValueStore({
    path: `${KEY_STORE_PATH_ADMIN}-${org}`
  });

  client.setStateStore(store);

  console.log('Creating the admin user context ..');

  const ORG_ADMIN_MSP = MSP_DIR[org];

  const privateKeyFile = fs.readdirSync(__dirname + '/../' + ORG_ADMIN_MSP + '/keystore')[0];

  // ###  GET THE NECESSRY KEY MATERIAL FOR THE ADMIN OF THE SPECIFIED ORG  ##
  const cryptoContentOrgAdmin: IIdentityFiles = {
    privateKey: ORG_ADMIN_MSP + '/keystore/' + privateKeyFile,
    signedCert: ORG_ADMIN_MSP + '/signcerts/Admin@' + org + '.ksachdeva-exp.com-cert.pem'
  };

  await client.createUser({
    username: `${org}-admin`,
    mspid: MSP_ID[org],
    cryptoContent: cryptoContentOrgAdmin
  });

  return client;
}
