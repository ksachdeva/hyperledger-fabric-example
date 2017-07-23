import * as fs from 'fs';
import * as path from 'path';
import { getClient, getOrderer } from './client';

const CHANNEL_NAME = 'ksachdeva-exp-channel-1';
const CHANNEL_1_PATH = './../ksachdeva-exp-channel-1.tx';

async function main() {

  const client = await getClient();
  const orderer = await getOrderer(client);

  // read in the envelope for the channel config raw bytes
  console.log('Reading the envelope from manually created channel transaction ..');
  const envelope = fs.readFileSync(path.join(__dirname, CHANNEL_1_PATH));

  // extract the configuration
  console.log('Extracting the channel configuration ..');
  const channelConfig = client.extractChannelConfig(envelope);

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
