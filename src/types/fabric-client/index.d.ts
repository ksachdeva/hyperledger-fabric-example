declare enum Status {
  UNKNOWN = 0,
  SUCCESS = 200,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  REQUEST_ENTITY_TOO_LARGE = 413,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

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
  proposal: Proposal;
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

interface ChaincodeInvokeRequest {
  targets?: Peer[];
  chaincodeId: string;
  txId: TransactionId;
  fcn?: string;
  args: string[];
}

interface ChaincodeQueryRequest {
  targets?: Peer[];
  chaincodeId: string;
  txId: TransactionId;
  fcn?: string;
  args: string[];
}

interface ChaincodeInfo {
  name: string;
  version: string;
  path: string;
  input: string;
  escc: string;
  vscc: string;
}

interface ChaincodeQueryResponse {
  chaincodes: ChaincodeInfo[];
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
  status: Status;
  message: string;
  payload: Buffer;
}

interface Proposal {
  header: ByteBuffer;
  payload: ByteBuffer;
  extension: ByteBuffer;
}

interface Header {
  channel_header: ByteBuffer;
  signature_header: ByteBuffer;
}

interface ProposalResponse {
  version: number;
  timestamp: Date;
  response: ResponseObject;
  payload: Buffer;
  endorsement: any;
}

type ProposalResponseObject = [Array<ProposalResponse>, Proposal, Header];

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
  sendTransactionProposal(request: ChaincodeInvokeRequest): Promise<ProposalResponseObject>;
  sendTransaction(request: TransactionRequest): Promise<BroadcastResponse>;
  queryByChaincode(request: ChaincodeQueryRequest): Promise<Buffer[]>;
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
