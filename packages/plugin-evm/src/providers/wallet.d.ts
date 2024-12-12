import type { IAgentRuntime, Provider } from "@ai16z/eliza";
import { type PublicClient, type WalletClient, type Chain, type HttpTransport, type Address, Account } from "viem";
import type { SupportedChain, ChainConfig, ChainMetadata } from "../types";
export declare const DEFAULT_CHAIN_CONFIGS: Record<SupportedChain, ChainMetadata>;
export declare const getChainConfigs: (runtime: IAgentRuntime) => ChainConfig[];
export declare class WalletProvider {
    private chainConfigs;
    private currentChain;
    private address;
    runtime: IAgentRuntime;
    constructor(runtime: IAgentRuntime);
    getAddress(): Address;
    getWalletBalance(): Promise<string | null>;
    connect(): Promise<`0x${string}`>;
    switchChain(runtime: IAgentRuntime, chain: SupportedChain): Promise<void>;
    getPublicClient(chain: SupportedChain): PublicClient<HttpTransport, Chain, Account | undefined>;
    getWalletClient(): WalletClient;
    getCurrentChain(): SupportedChain;
    getChainConfig(chain: SupportedChain): any;
}
export declare const evmWalletProvider: Provider;
