import * as path from 'path';
import Client = require('fabric-client');

import config from './config';
import { Organization, getClient, getOrderer, getPeers } from './client';

async function instantiateChaincodeOnPeers(org: Organization) {

  const client = await getClient(org);
  const orderer = await getOrderer(client);

  console.log('Creating a Channel object ..');
  const channel = client.newChannel(config.CHANNEL_NAME);

  console.log('Specifiying the orderer to connect to ..');
  channel.addOrderer(orderer);

  console.log('Getting the peers ..');
  const peers = await getPeers(client, org);

  peers.map(p => channel.addPeer(p));

  console.log('Initializing the channel ..');
  await channel.initialize();

  console.log('Sending the Instantiate Proposal ..');
  const proposalResponse = await channel.sendInstantiateProposal({
    chaincodeId: config.CHAIN_CODE_ID,
    chaincodeVersion: 'v0',
    fcn: 'init',
    args: ["a", "100", "b", "200"],
    txId: client.newTransactionID()
  });

  console.log('Sending the Transaction ..');
  const transactionResponse = await channel.sendTransaction({
    proposalResponses: proposalResponse[0],
    proposal: proposalResponse[1]
  });

}

async function main() {

  await instantiateChaincodeOnPeers(Organization.ORG1);
  await instantiateChaincodeOnPeers(Organization.ORG2);
  await instantiateChaincodeOnPeers(Organization.ORG3);

}

main();
