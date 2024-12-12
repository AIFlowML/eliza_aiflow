import { type WalletClient, type Plugin, type ChainForWalletClient } from "@goat-sdk/core";
import { type Action, type IAgentRuntime } from "@ai16z/eliza";
type GetOnChainActionsParams<TWalletClient extends WalletClient> = {
    chain: ChainForWalletClient<TWalletClient>;
    getWalletClient: (runtime: IAgentRuntime) => Promise<TWalletClient>;
    plugins: Plugin<TWalletClient>[];
    supportsSmartWallets?: boolean;
};
/**
 * Get all the on chain actions for the given wallet client and plugins
 *
 * @param params
 * @returns
 */
export declare function getOnChainActions<TWalletClient extends WalletClient>({ getWalletClient, plugins, chain, supportsSmartWallets, }: GetOnChainActionsParams<TWalletClient>): Promise<Action[]>;
export {};
