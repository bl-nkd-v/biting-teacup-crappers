declare module "bitcoin-core" {
  export default class Client {
    constructor(options: {
      network: string;
      host: string;
      port?: number;
      username?: string;
      password?: string;
      timeout?: number;
      ssl?: {
        enabled: boolean;
        strict: boolean;
      };
    });

    getBlockchainInfo(): Promise<{ blocks: number; bestblockhash: string }>;
    getBlockHash(height: number): Promise<string>;
    getBlock(
      hash: string,
      verbosity: number
    ): Promise<{
      tx: Array<{
        vout: Array<{ value: number }>;
      }>;
    }>;
  }
}
