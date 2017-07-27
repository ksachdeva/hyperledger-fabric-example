import Client = require('fabric-client');
import { Organization, getClient, getOrderer, getPeers } from './client';
import config from './config';

async function joinOrgPeersToChannel(org: Organization) {

  const client = await getClient(org);
  const orderer = await getOrderer(client);

  console.log('Creating a Channel object ..');
  const channel = client.newChannel(config.CHANNEL_NAME);

  console.log('Specifiying the orderer to connect to ..');
  channel.addOrderer(orderer);

  console.log('Getting the genesis block for the ${CHANNEL_NAME} ..');
  const genesis_block = await channel.getGenesisBlock({
    txId: client.newTransactionID()
  });

  console.log('Getting the peers ..');
  const peers = await getPeers(client, org);

  console.log(peers);

  const proposalResponse = await channel.joinChannel({
    txId: client.newTransactionID(),
    block: genesis_block,
    targets: peers
  });

  console.log(proposalResponse);
}

async function main() {

  await joinOrgPeersToChannel(Organization.ORG1);
  await joinOrgPeersToChannel(Organization.ORG2);
  await joinOrgPeersToChannel(Organization.ORG3);

}

main();
