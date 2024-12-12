import { Trade, Wallet } from "@coinbase/coinbase-sdk";
import { IAgentRuntime } from "@ai16z/eliza";
import { EthereumTransaction } from "@coinbase/coinbase-sdk/dist/client";
import { Transaction } from "./types";
export declare function initializeWallet(runtime: IAgentRuntime, networkId?: string): Promise<Wallet>;
/**
 * Executes a trade and a charity transfer.
 * @param {IAgentRuntime} runtime - The runtime for wallet initialization.
 * @param {string} network - The network to use.
 * @param {number} amount - The amount to trade and transfer.
 * @param {string} sourceAsset - The source asset to trade.
 * @param {string} targetAsset - The target asset to trade.
 */
export declare function executeTradeAndCharityTransfer(runtime: IAgentRuntime, network: string, amount: number, sourceAsset: string, targetAsset: string): Promise<{
    trade: Trade;
    transfer: any;
}>;
export declare function appendTradeToCsv(trade: Trade): Promise<void>;
export declare function appendTransactionsToCsv(transactions: Transaction[]): Promise<void>;
/**
 * Updates a key-value pair in character.settings.secrets.
 * @param {string} characterfilePath - The file path to the character.
 * @param {string} key - The secret key to update or add.
 * @param {string} value - The new value for the secret key.
 */
export declare function updateCharacterSecrets(characterfilePath: string, key: string, value: string): Promise<boolean>;
export declare const getAssetType: (transaction: EthereumTransaction) => any;
/**
 * Fetches and formats wallet balances and recent transactions.
 *
 * @param {IAgentRuntime} runtime - The runtime for wallet initialization.
 * @param {string} networkId - The network ID (optional, defaults to ETH mainnet).
 * @returns {Promise<{balances: Array<{asset: string, amount: string}>, transactions: Array<any>}>} - An object with formatted balances and transactions.
 */
export declare function getWalletDetails(runtime: IAgentRuntime, networkId?: string): Promise<{
    balances: Array<{
        asset: string;
        amount: string;
    }>;
    transactions: Array<{
        timestamp: string;
        amount: string;
        asset: string;
        status: string;
        transactionUrl: string;
    }>;
}>;
/**
 * Executes a transfer.
 * @param {Wallet} wallet - The wallet to use.
 * @param {number} amount - The amount to transfer.
 * @param {string} sourceAsset - The source asset to transfer.
 * @param {string} targetAddress - The target address to transfer to.
 */
export declare function executeTransferAndCharityTransfer(wallet: Wallet, amount: number, sourceAsset: string, targetAddress: string, network: string): Promise<{
    transfer: any;
    charityTransfer: any;
}>;
/**
 * Executes a transfer.
 * @param {Wallet} wallet - The wallet to use.
 * @param {number} amount - The amount to transfer.
 * @param {string} sourceAsset - The source asset to transfer.
 * @param {string} targetAddress - The target address to transfer to.
 */
export declare function executeTransfer(wallet: Wallet, amount: number, sourceAsset: string, targetAddress: string): Promise<any>;
/**
 * Gets the charity address based on the network.
 * For now we are giving to the following charity, but will make this configurable in the future
 * https://www.givedirectly.org/crypto/?_gl=1*va5e6k*_gcl_au*MTM1NDUzNTk5Mi4xNzMzMDczNjA3*_ga*OTIwMDMwNTMwLjE3MzMwNzM2MDg.*_ga_GV8XF9FJ16*MTczMzA3MzYwNy4xLjEuMTczMzA3MzYyMi40NS4wLjA.
 * @param {string} network - The network to use.
 */
export declare function getCharityAddress(network: string): string;
