import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { CreateTokenMetadata, PriorityFee, PumpFunSDK } from "pumpdotfun-sdk";
import { Content, IAgentRuntime, type Action } from "@ai16z/eliza";
export interface CreateAndBuyContent extends Content {
    tokenMetadata: {
        name: string;
        symbol: string;
        description: string;
        image_description: string;
    };
    buyAmountSol: string | number;
}
export declare function isCreateAndBuyContent(runtime: IAgentRuntime, content: any): content is CreateAndBuyContent;
export declare const createAndBuyToken: ({ deployer, mint, tokenMetadata, buyAmountSol, priorityFee, allowOffCurve, commitment, sdk, connection, slippage, }: {
    deployer: Keypair;
    mint: Keypair;
    tokenMetadata: CreateTokenMetadata;
    buyAmountSol: bigint;
    priorityFee: PriorityFee;
    allowOffCurve: boolean;
    commitment?: "processed" | "confirmed" | "finalized" | "recent" | "single" | "singleGossip" | "root" | "max";
    sdk: PumpFunSDK;
    connection: Connection;
    slippage: string;
}) => Promise<{
    success: boolean;
    ca: string;
    creator: string;
    error?: undefined;
} | {
    success: boolean;
    ca: string;
    error: {};
    creator?: undefined;
}>;
export declare const buyToken: ({ sdk, buyer, mint, amount, priorityFee, allowOffCurve, slippage, connection, }: {
    sdk: PumpFunSDK;
    buyer: Keypair;
    mint: PublicKey;
    amount: bigint;
    priorityFee: PriorityFee;
    allowOffCurve: boolean;
    slippage: string;
    connection: Connection;
}) => Promise<void>;
export declare const sellToken: ({ sdk, seller, mint, amount, priorityFee, allowOffCurve, slippage, connection, }: {
    sdk: PumpFunSDK;
    seller: Keypair;
    mint: PublicKey;
    amount: bigint;
    priorityFee: PriorityFee;
    allowOffCurve: boolean;
    slippage: string;
    connection: Connection;
}) => Promise<void>;
declare const _default: Action;
export default _default;
