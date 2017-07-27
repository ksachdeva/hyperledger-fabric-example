import * as path from 'path';
import Client = require('fabric-client');
import { Organization, getClient, getOrderer, getPeers } from './client';

const CHANNEL_NAME = 'ksachdeva-exp-channel-1';

async function instantiateChaincodeOnPeers(org: Organization) {

  const client = await getClient(org);
  const orderer = await getOrderer(client);

  console.log('Creating a Channel object ..');
  const channel = client.newChannel(CHANNEL_NAME);

  console.log('Specifiying the orderer to connect to ..');
  channel.addOrderer(orderer);

  console.log('Getting the peers ..');
  const peers = await getPeers(client, org);

  peers.map(p => channel.addPeer(p));

  console.log('Initializing the channel ..');
  await channel.initialize();

  console.log('Sending the Instantiate Proposal ..');
  const proposalResponse = await channel.sendInstantiateProposal({
    chaincodeId: 'ksachdeva-exp-cc',
    chaincodeVersion: 'v0',
    fcn: 'init',
    args: ["a", "100", "b", "200"],
    txId: client.newTransactionID()
  });

  const transactionResponse = await channel.sendTransaction({
    proposalResponses: proposalResponse[0],
    proposal: proposalResponse[1]
  });

}

async function main() {

  await instantiateChaincodeOnPeers(Organization.ORG1);
  //await instantiateChaincodeOnPeers(Organization.ORG2);
  //await instantiateChaincodeOnPeers(Organization.ORG3);

}

main();
