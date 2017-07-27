interface ConnectionOptions {

}

interface ConfigSignature {
  signature_header: Buffer;
  signature: Buffer;
}

interface ICryptoKey {
  getSKI(): string;
  isSymmetric(): boolean;
  isPrivate(): boolean;
  getPublicKey(): ICryptoKey;
  toBytes(): string;
}

interface ICryptoKeyStore {

}

interface IKeyValueStore {

}

interface IdentityFiles {
  privateKey: string;
  signedCert: string;
}

interface IdentityPEMs {
  privateKeyPEM: string;
  signedCertPEM: string;
}

interface UserOptions {
  username: string;
  mspid: string;
  cryptoContent: IdentityFiles | IdentityPEMs;
}

interface UserConfig {
  enrollmentID: string;
  name: string
  roles?: string[];
  affiliation?: string;
}

interface ICryptoSuite {
  sign(key: ICryptoKey, digest: Buffer): Buffer;
  setCryptoKeyStore(cryptoKeyStore: ICryptoKeyStore): void;
}

interface ChannelRequest {
  name: string;
  orderer: Orderer;
  envelope?: Buffer;
  config?: Buffer;
  txId?: TransactionId;
  signatures: ConfigSignature[];
}

interface TransactionRequest {
  proposalResponses: ProposalResponse[];
  proposal: any;
}

interface BroadcastResponse {
  status: string;
}

interface IIdentity {

}

interface ISigningIdentity {

}

interface ChaincodeInstallRequest {
  targets: Peer[];
  chaincodePath: string;
  chaincodeId: string;
  chaincodeVersion: string;
  chaincodePackage?: Buffer;
  chaincodeType?: string;
}

interface ChaincodeInstantiateUpgradeRequest {
  targets?: Peer[];
  chaincodeType?: string;
  chaincodeId: string;
  chaincodeVersion: string;
  txId: TransactionId;
  fcn?: string;
  args?: string[];
}

interface OrdererRequest {
  txId: TransactionId;
}

interface JoinChannelRequest {
  txId: TransactionId;
  targets: Peer[];
  block: Buffer;
}

interface ResponseObject {
  status: number;
  message: string;
  payload: Buffer;
}

interface ProposalResponse {
  version: number;
  timestamp: Date;
  response: ResponseObject;
  payload: Buffer;
  endorsement: any;
}

type ProposalResponseObject = [Array<ProposalResponse>, any, any];

declare class User {
  getName(): string;
  getRoles(): string[];
  setRoles(roles: string[]): void;
  getAffiliation(): string;
  setAffiliation(affiliation: string): void;
  getIdentity(): IIdentity;
  getSigningIdentity(): ISigningIdentity;
  setCryptoSuite(suite: ICryptoSuite): void;
  setEnrollment(privateKey: ICryptoKey, certificate: string, mspId: string): Promise<void>;
}

declare class Orderer {
}

declare class Peer {

}

declare class Channel {
  initialize(): Promise<void>;
  addOrderer(orderer: Orderer): void;
  addPeer(peer: Peer): void;
  getGenesisBlock(request: OrdererRequest): Promise<any>;
  getChannelConfig(): Promise<any>;
  joinChannel(request: JoinChannelRequest): Promise<ProposalResponse>;
  sendInstantiateProposal(request: ChaincodeInstantiateUpgradeRequest): Promise<ProposalResponseObject>;
  sendTransaction(request: TransactionRequest): Promise<BroadcastResponse>;
}

declare abstract class BaseClient {
  static newCryptoSuite(): ICryptoSuite;
  static newCryptoKeyStore(obj?: { path: string }): ICryptoKeyStore;
  static newDefaultKeyValueStore(obj?: { path: string }): Promise<IKeyValueStore>;
  setCryptoSuite(suite: ICryptoSuite): void;
  getCryptoSuite(): ICryptoSuite;
}

declare class TransactionId {
  getTransactionId(): string;
}

declare class Client extends BaseClient {
  isDevMode(): boolean;
  setDevMode(mode: boolean): void;
  newOrderer(url: string, opts: ConnectionOptions): Orderer;
  newChannel(name: string): Channel;
  newPeer(url: string, opts: ConnectionOptions): Peer;
  newTransactionID(): TransactionId;
  extractChannelConfig(envelope: Buffer): Buffer;
  createChannel(request: ChannelRequest): Promise<BroadcastResponse>;
  createUser(opts: UserOptions): Promise<User>;
  signChannelConfig(config: Buffer): ConfigSignature;
  setStateStore(store: IKeyValueStore): void;
  installChaincode(request: ChaincodeInstallRequest): Promise<ProposalResponse>;
}

declare module 'fabric-client' {
  export = Client;
}
