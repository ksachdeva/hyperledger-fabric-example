import * as fs from 'fs';
import * as path from 'path';
import { Organization, getClient, getOrderer } from './client';

const CHANNEL_NAME = 'ksachdeva-exp-channel-1';
const CHANNEL_1_PATH = './../ksachdeva-exp-channel-1.tx';

async function main() {

  const org1Client = await getClient(Organization.ORG1);
  const orderer = await getOrderer(org1Client);

  // read in the envelope for the channel config raw bytes
  console.log('Reading the envelope from manually created channel transaction ..');
  const envelope = fs.readFileSync(path.join(__dirname, CHANNEL_1_PATH));

  // extract the configuration
  console.log('Extracting the channel configuration ..');
  const channelConfig = org1Client.extractChannelConfig(envelope);

  console.log('Signing the extracted channel configuration ..');
  const signature = org1Client.signChannelConfig(channelConfig);

  // prepare the request
  const channelRequest: ChannelRequest = {
    name: CHANNEL_NAME,
    config: channelConfig,
    signatures: [signature],
    orderer: orderer,
    txId: org1Client.newTransactionID()
  };

  console.log('Sending the request to create the channel ..');
  const response = await org1Client.createChannel(channelRequest);

  console.log(response);
}

main();
