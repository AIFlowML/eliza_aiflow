import { WalletProvider } from "../providers/wallet";
import type { Transaction, TransferParams } from "../types";
import { transferTemplate } from "../templates";
import type { IAgentRuntime, Memory, State } from "@ai16z/eliza";
export { transferTemplate };
export declare class TransferAction {
    private walletProvider;
    constructor(walletProvider: WalletProvider);
    transfer(runtime: IAgentRuntime, params: TransferParams): Promise<Transaction>;
}
export declare const transferAction: {
    name: string;
    description: string;
    handler: (runtime: IAgentRuntime, message: Memory, state: State, options: any) => Promise<Transaction>;
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
