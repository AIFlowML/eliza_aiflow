import { Provider } from "@ai16z/eliza";
import { Keypair } from "@solana/web3.js";
import { DeriveKeyResponse } from "@phala/dstack-sdk";
import { PrivateKeyAccount } from "viem";
declare class DeriveKeyProvider {
    private client;
    constructor(endpoint?: string);
    rawDeriveKey(path: string, subject: string): Promise<DeriveKeyResponse>;
    deriveEd25519Keypair(path: string, subject: string): Promise<Keypair>;
    deriveEcdsaKeypair(path: string, subject: string): Promise<PrivateKeyAccount>;
}
declare const deriveKeyProvider: Provider;
export { deriveKeyProvider, DeriveKeyProvider };
