import * as path from 'path';
import Client = require('fabric-client');

import config from './config';
import { Organization, getClient, getOrderer, getPeers } from './client';

async function invokeTransactionOnPeers(org: Organization) {

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

  console.log('Sending the Invoke Proposal ..');
  const proposalResponse = await channel.sendTransactionProposal({
    chaincodeId: config.CHAIN_CODE_ID,
    fcn: 'move',
    args: ["a", "b", "10"],
    txId: client.newTransactionID()
  });

  console.log('Sending the Transaction ..');
  const transactionResponse = await channel.sendTransaction({
    proposalResponses: proposalResponse[0],
    proposal: proposalResponse[1]
  });

}

async function main() {

  await invokeTransactionOnPeers(Organization.ORG1);
  // await invokeTransactionOnPeers(Organization.ORG2);
  // await invokeTransactionOnPeers(Organization.ORG3);
}

main();
