## Pre-requisites

Make sure following tools/runtimes are installed
* [NodeJS 6.X](https://nodejs.org/en/)
* [Docker (latest)](https://www.docker.com/)

## Install

```bash
# Fetch the Hyperledger Farbic tools and docker images
curl -sSL https://goo.gl/iX9dek | bash
```

```bash
# Install typescript & ts-node (globally)
npm install -g ts-node typescript
```

```bash
# Install the dependencies of this project
npm install
```

## Help

To see what are the commands that are available issue:

```bash
npm run info
```

Should see response similar to:
```bash
> hyperledger-fabric-example@0.1.0 info /Users/ksachdeva/Desktop/Dev/projects/myoss/hyperledger-fabric-example
> npm-scripts-info

info:
  List available script
start-orderer:
  Start the orderer container
stop-orderer:
  Stop the orderer container
start-containers:
  Starts all containers
stop-containers:
  Stops the containers
create-channel:
  Create the Channel
join-channel:
  Join Peers to the channel
install-chaincode:
  Install the chaincode on the peers
instantiate-chaincode:
  Instantiate the chaincode for the channel
invoke-transaction:
  Invoke a transaction
query-chaincode:
  Query the chaincode
```

#### Generating the crypto material for all the organizations


See [Bootstrapping the Hyperledger Fabric Network (Part 1)](https://ksachdeva.github.io/2017/07/21/bootstrapping-hyperledger-fabric-nw-1/)

```bash
cryptogen generate --config=./crypto-config.yaml
```

#### Generating the Orderer genesis block

See [Bootstrapping the Hyperledger Fabric Network (Part 2)](https://ksachdeva.github.io/2017/07/21/bootstrapping-hyperledger-fabric-nw-2/)

```bash
configtxgen -profile ThreeOrgsOrdererGenesis -outputBlock ./genesis.block
```

You can directly use the docker-compose command as specified in the blog post or using the command that I have hooked up in the package.json. The npm command also deletes 'production' folder so that every time your start the orderer node it starts with clean content.

```bash
npm run start-orderer
```

Similarly to stop the orderer containers simply issue

```bash
npm run stop-orderer
```

#### Generating the channel configuration transaction

See [Bootstrapping the Hyperledger Fabric Network (Part 3)](https://ksachdeva.github.io/2017/07/22/bootstrapping-hyperledger-fabric-nw-3/)

```bash
configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx ./ksachdeva-exp-channel-1.tx -channelID ksachdeva-exp-channel-1
```

#### Creating the new channel

See [Bootstrapping the Hyperledger Fabric Network (Part 4)](https://ksachdeva.github.io/2017/07/23/bootstrapping-hyperledger-fabric-nw-4/)

```bash
npm run create-channel
```

#### Make Peers join the new channel

See [Bootstrapping the Hyperledger Fabric Network (Part 5)](https://ksachdeva.github.io/2017/07/24/bootstrapping-hyperledger-fabric-nw-5/)

```bash
# Stop already running orderer containers
npm run stop-containers
# This will start both orderer & peer containers
npm run start-containers
# Create the channel again as when we start-containers we remove the previous data from the containers
npm run create-channel
# Join the channel
npm run join-channel
```

#### Install and instantiate the chaincode

See [Bootstrapping the Hyperledger Fabric Network (Part 6)](https://ksachdeva.github.io/2017/07/27/bootstrapping-hyperledger-fabric-nw-6/)

```bash
npm run install-chaincode
npm run instantiate-chaincode
```

#### Invoke the transaction & Query the chaincode

See [Invoking a transaction on Hyperledger Fabric Network](https://ksachdeva.github.io/2017/07/27/invoking-a-transaction-on-fabric/)

```bash
npm run query-chaincode
npm run invoke-transaction
npm run query-chaincode
```
