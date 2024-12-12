import type { IAgentRuntime, Memory, State } from "@ai16z/eliza";
import { WalletProvider } from "../providers/wallet";
import { swapTemplate } from "../templates";
import type { SwapParams, Transaction } from "../types";
export { swapTemplate };
export declare class SwapAction {
    private walletProvider;
    private config;
    constructor(walletProvider: WalletProvider);
    swap(params: SwapParams): Promise<Transaction>;
}
export declare const swapAction: {
    name: string;
    description: string;
    handler: (runtime: IAgentRuntime, message: Memory, state: State, options: any, callback?: any) => Promise<false | Transaction>;
    template: string;
    validate: (runtime: IAgentRuntime) => Promise<boolean>;
    examples: {
        user: string;
        content: {
            text: string;
            action: string;
        };
    }[][];
    similes: string[];
};
