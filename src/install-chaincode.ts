import * as path from 'path';
import Client = require('fabric-client');
import { Organization, getClient, getOrderer, getPeers } from './client';
import config from './config';

async function installChaincodeOnPeers(org: Organization) {

  const client = await getClient(org);
  const orderer = await getOrderer(client);

  console.log('Creating a Channel object ..');
  const channel = client.newChannel(config.CHANNEL_NAME);

  console.log('Specifiying the orderer to connect to ..');
  channel.addOrderer(orderer);

  console.log('Getting the peers ..');
  const peers = await getPeers(client, org);

  // Note-
  // The installChaincode is going to pick the chaincodePath
  // from the local GOPATH
  //
  // Below I am just tricking it by setting the GOPATH environment
  // variable and pointing it to the directory that contains the
  // actual chain code
  process.env.GOPATH = path.join(__dirname, '../chaincode');

  const proposalResponse = await client.installChaincode({
    targets: peers,
    chaincodeId: config.CHAIN_CODE_ID,
    chaincodePath: 'github.com/example_cc',
    chaincodeVersion: 'v0'
  });

}

async function main() {

  await installChaincodeOnPeers(Organization.ORG1);
  await installChaincodeOnPeers(Organization.ORG2);
  await installChaincodeOnPeers(Organization.ORG3);

}

main();
