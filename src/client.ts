import * as fs from 'fs';
import * as path from 'path';

import Client = require('fabric-client');

const CHANNEL_NAME = 'ksachdeva-exp-channel-1';
const CHANNEL_1_PATH = './../ksachdeva-exp-channel-1.tx';
const KEY_STORE_PATH_ORG1_ADMIN = './keystore/org1-admin';
const ORDERER_URL = 'grpcs://localhost:7050';
const ORDERER_TLS_CAROOT_PATH = './../crypto-config/ordererOrganizations/ksachdeva-exp.com/orderers/orderer.ksachdeva-exp.com/tls/ca.crt';
const ORG1_ADMIN_MSP = './crypto-config/peerOrganizations/org1.ksachdeva-exp.com/users/Admin@org1.ksachdeva-exp.com/msp';

export async function getOrderer(client: Client): Promise<Orderer> {
  // build an orderer that will be used to connect to it
  const data = fs.readFileSync(path.join(__dirname, ORDERER_TLS_CAROOT_PATH));
  const orderer: Orderer = client.newOrderer(ORDERER_URL, {
    'pem': Buffer.from(data).toString(),
    'ssl-target-name-override': 'orderer.ksachdeva-exp.com'
  });

  return orderer;
}

export async function getClient(): Promise<Client> {

  const client = new Client();

  console.log('Setting up the cryptoSuite ..');

  // ## Setup the cryptosuite (we are using the built in default s/w based implementation)
  const cryptoSuite = Client.newCryptoSuite();
  cryptoSuite.setCryptoKeyStore(Client.newCryptoKeyStore({
    path: KEY_STORE_PATH_ORG1_ADMIN
  }));

  client.setCryptoSuite(cryptoSuite);

  console.log('Setting up the keyvalue store ..');

  // ## Setup the default keyvalue store where the state will be stored
  const store = await Client.newDefaultKeyValueStore({
    path: KEY_STORE_PATH_ORG1_ADMIN
  });

  client.setStateStore(store);

  console.log('Creating the admin user context ..');

  const privateKeyFile = fs.readdirSync(__dirname + '/../' + ORG1_ADMIN_MSP + '/keystore')[0];

  // ###  GET THE NECESSRY KEY MATERIAL FOR THE ADMIN OF THE ORG 1 ##
  const cryptoContentOrg1Admin: IIdentityFiles = {
    privateKey: ORG1_ADMIN_MSP + '/keystore/' + privateKeyFile,
    signedCert: ORG1_ADMIN_MSP + '/signcerts/Admin@org1.ksachdeva-exp.com-cert.pem'
  };

  await client.createUser({
    username: 'org1-admin',
    mspid: 'Org1MSP',
    cryptoContent: cryptoContentOrg1Admin
  });

  return client;
}
