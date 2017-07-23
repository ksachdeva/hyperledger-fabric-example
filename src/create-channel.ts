import * as fs from 'fs';
import * as path from 'path';

import Client = require('fabric-client');

const CHANNEL_NAME = 'ksachdeva-exp-channel-1';
const CHANNEL_1_PATH = './../ksachdeva-exp-channel-1.tx';
const KEY_STORE_PATH_ORG1_ADMIN = './keystore/org1-admin';
const ORDERER_URL = 'grpcs://localhost:7050';
const ORDERER_TLS_CAROOT_PATH = './../crypto-config/ordererOrganizations/ksachdeva-exp.com/orderers/orderer.ksachdeva-exp.com/tls/ca.crt';

const client = new Client();

// read in the envelope for the channel config raw bytes
console.log('Reading the envelope from manually created channel transaction ..');
const envelope = fs.readFileSync(path.join(__dirname, CHANNEL_1_PATH));

// extract the configuration
console.log('Extracting the channel configuration ..');
const channelConfig = client.extractChannelConfig(envelope);

// build an orderer that will be used to connect to it
const data = fs.readFileSync(path.join(__dirname, ORDERER_TLS_CAROOT_PATH));
const orderer: Orderer = client.newOrderer(ORDERER_URL, {
  'pem': Buffer.from(data).toString(),
  'ssl-target-name-override': 'orderer.ksachdeva-exp.com'
});

async function main() {

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

  // ###  GET THE NECESSRY KEY MATERIAL FOR THE ADMIN OF THE ORG 1 ##
  const cryptoContentOrg1Admin: IIdentityFiles = {
    privateKey: './crypto-config/peerOrganizations/org1.ksachdeva-exp.com/users/Admin@org1.ksachdeva-exp.com/msp/keystore/c6f4d32192f246b301d1d632e497c7b30082aa4d46217c4d3bf7436827fd457b_sk',
    signedCert: './crypto-config/peerOrganizations/org1.ksachdeva-exp.com/users/Admin@org1.ksachdeva-exp.com/msp/signcerts/Admin@org1.ksachdeva-exp.com-cert.pem'
  };

  await client.createUser({
    username: 'org1-admin',
    mspid: 'Org1MSP',
    cryptoContent: cryptoContentOrg1Admin
  });

  console.log('Signing the extracted channel configuration ..');
  const signature = client.signChannelConfig(channelConfig);

  // prepare the request
  const channelRequest: IChannelRequest = {
    name: CHANNEL_NAME,
    config: channelConfig,
    signatures: [signature],
    orderer: orderer,
    txId: client.newTransactionID()
  };

  console.log('Sending the request to create the channel ..');
  const response = await client.createChannel(channelRequest);

  console.log(response);

}

main();
