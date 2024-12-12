import type { IAgentRuntime, Memory, State } from "@ai16z/eliza";
import { WalletProvider } from "../providers/wallet";
import { bridgeTemplate } from "../templates";
import type { BridgeParams, Transaction } from "../types";
export { bridgeTemplate };
export declare class BridgeAction {
    private walletProvider;
    private config;
    constructor(walletProvider: WalletProvider);
    bridge(params: BridgeParams): Promise<Transaction>;
}
export declare const bridgeAction: {
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
