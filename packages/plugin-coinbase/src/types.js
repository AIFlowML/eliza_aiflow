import { Coinbase } from "@coinbase/coinbase-sdk";
import { z } from "zod";
export const ChargeSchema = z.object({
    id: z.string().nullable(),
    price: z.number(),
    type: z.string(),
    currency: z.string().min(3).max(3),
    name: z.string().min(1),
    description: z.string().min(1),
});
export const isChargeContent = (object) => {
    if (ChargeSchema.safeParse(object).success) {
        return true;
    }
    console.error("Invalid content: ", object);
    return false;
};
export const TransferSchema = z.object({
    network: z.string().toLowerCase(),
    receivingAddresses: z.array(z.string()),
    transferAmount: z.number(),
    assetId: z.string().toLowerCase(),
});
export const isTransferContent = (object) => {
    return TransferSchema.safeParse(object).success;
};
const assetValues = Object.values(Coinbase.assets);
export const TradeSchema = z.object({
    network: z.string().toLowerCase(),
    amount: z.number(),
    sourceAsset: z.enum(assetValues),
    targetAsset: z.enum(assetValues),
    leverage: z.number().optional(), // Optional leverage for leveraged trades
});
export const isTradeContent = (object) => {
    return TradeSchema.safeParse(object).success;
};
export const TokenContractSchema = z.object({
    contractType: z.enum(["ERC20", "ERC721", "ERC1155"]).describe("The type of token contract to deploy"),
    name: z.string().describe("The name of the token"),
    symbol: z.string().describe("The symbol of the token"),
    network: z.string().describe("The blockchain network to deploy on"),
    baseURI: z.string().optional().describe("The base URI for token metadata (required for ERC721 and ERC1155)"),
    totalSupply: z.number().optional().describe("The total supply of tokens (only for ERC20)"),
}).refine(data => {
    if (data.contractType === "ERC20") {
        return typeof data.totalSupply === "number" || data.totalSupply === undefined;
    }
    if (["ERC721", "ERC1155"].includes(data.contractType)) {
        return typeof data.baseURI === "string" || data.baseURI === undefined;
    }
    return true;
}, {
    message: "Invalid token contract content",
    path: ["contractType"],
});
export const isTokenContractContent = (obj) => {
    return TokenContractSchema.safeParse(obj).success;
};
export const ContractInvocationSchema = z.object({
    contractAddress: z.string().describe("The address of the contract to invoke"),
    method: z.string().describe("The method to invoke on the contract"),
    abi: z.array(z.any()).describe("The ABI of the contract"),
    args: z.record(z.string(), z.any()).optional().describe("The arguments to pass to the contract method"),
    amount: z.number().optional().describe("The amount of the asset to send to a payable contract method"),
    assetId: z.string().optional().describe("The ID of the asset to send to a payable contract method"),
    network: z.string().describe("The blockchain network to use"),
});
export const isContractInvocationContent = (obj) => {
    return ContractInvocationSchema.safeParse(obj).success;
};
//# sourceMappingURL=types.js.map