import { z } from "zod";
export declare const ChargeSchema: z.ZodObject<{
    id: z.ZodNullable<z.ZodString>;
    price: z.ZodNumber;
    type: z.ZodString;
    currency: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    id: string | null;
    description: string;
    name: string;
    currency: string;
    price: number;
}, {
    type: string;
    id: string | null;
    description: string;
    name: string;
    currency: string;
    price: number;
}>;
export interface ChargeContent {
    id: string | null;
    price: number;
    type: string;
    currency: string;
    name: string;
    description: string;
}
export declare const isChargeContent: (object: any) => object is ChargeContent;
export declare const TransferSchema: z.ZodObject<{
    network: z.ZodString;
    receivingAddresses: z.ZodArray<z.ZodString, "many">;
    transferAmount: z.ZodNumber;
    assetId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    assetId: string;
    network: string;
    receivingAddresses: string[];
    transferAmount: number;
}, {
    assetId: string;
    network: string;
    receivingAddresses: string[];
    transferAmount: number;
}>;
export interface TransferContent {
    network: string;
    receivingAddresses: string[];
    transferAmount: number;
    assetId: string;
}
export declare const isTransferContent: (object: any) => object is TransferContent;
export type Transaction = {
    address: string;
    amount: number;
    status: string;
    errorCode: string | null;
    transactionUrl: string | null;
};
export declare const TradeSchema: z.ZodObject<{
    network: z.ZodString;
    amount: z.ZodNumber;
    sourceAsset: z.ZodEnum<[string, ...string[]]>;
    targetAsset: z.ZodEnum<[string, ...string[]]>;
    leverage: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    network: string;
    sourceAsset: string;
    targetAsset: string;
    leverage?: number | undefined;
}, {
    amount: number;
    network: string;
    sourceAsset: string;
    targetAsset: string;
    leverage?: number | undefined;
}>;
export interface TradeContent {
    network: string;
    amount: number;
    sourceAsset: string;
    targetAsset: string;
}
export declare const isTradeContent: (object: any) => object is TradeContent;
export type TradeTransaction = {
    network: string;
    amount: number;
    sourceAsset: string;
    targetAsset: string;
    status: string;
    errorCode: string | null;
    transactionUrl: string | null;
};
export interface TokenContractContent {
    contractType: "ERC20" | "ERC721" | "ERC1155";
    name: string;
    symbol: string;
    network: string;
    baseURI?: string;
    totalSupply?: number;
}
export declare const TokenContractSchema: z.ZodEffects<z.ZodObject<{
    contractType: z.ZodEnum<["ERC20", "ERC721", "ERC1155"]>;
    name: z.ZodString;
    symbol: z.ZodString;
    network: z.ZodString;
    baseURI: z.ZodOptional<z.ZodString>;
    totalSupply: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    network: string;
    contractType: "ERC20" | "ERC721" | "ERC1155";
    baseURI?: string | undefined;
    totalSupply?: number | undefined;
}, {
    symbol: string;
    name: string;
    network: string;
    contractType: "ERC20" | "ERC721" | "ERC1155";
    baseURI?: string | undefined;
    totalSupply?: number | undefined;
}>, {
    symbol: string;
    name: string;
    network: string;
    contractType: "ERC20" | "ERC721" | "ERC1155";
    baseURI?: string | undefined;
    totalSupply?: number | undefined;
}, {
    symbol: string;
    name: string;
    network: string;
    contractType: "ERC20" | "ERC721" | "ERC1155";
    baseURI?: string | undefined;
    totalSupply?: number | undefined;
}>;
export declare const isTokenContractContent: (obj: any) => obj is TokenContractContent;
export interface ContractInvocationContent {
    contractAddress: string;
    method: string;
    abi: any[];
    args?: Record<string, any>;
    amount?: number;
    assetId?: string;
    network: string;
}
export declare const ContractInvocationSchema: z.ZodObject<{
    contractAddress: z.ZodString;
    method: z.ZodString;
    abi: z.ZodArray<z.ZodAny, "many">;
    args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    amount: z.ZodOptional<z.ZodNumber>;
    assetId: z.ZodOptional<z.ZodString>;
    network: z.ZodString;
}, "strip", z.ZodTypeAny, {
    method: string;
    contractAddress: string;
    abi: any[];
    network: string;
    assetId?: string | undefined;
    amount?: number | undefined;
    args?: Record<string, any> | undefined;
}, {
    method: string;
    contractAddress: string;
    abi: any[];
    network: string;
    assetId?: string | undefined;
    amount?: number | undefined;
    args?: Record<string, any> | undefined;
}>;
export declare const isContractInvocationContent: (obj: any) => obj is ContractInvocationContent;
