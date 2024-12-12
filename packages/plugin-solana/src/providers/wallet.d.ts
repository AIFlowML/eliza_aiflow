import { Provider } from "@ai16z/eliza";
import { Connection, PublicKey } from "@solana/web3.js";
export interface Item {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    balance: string;
    uiAmount: string;
    priceUsd: string;
    valueUsd: string;
    valueSol?: string;
}
interface WalletPortfolio {
    totalUsd: string;
    totalSol?: string;
    items: Array<Item>;
}
interface Prices {
    solana: {
        usd: string;
    };
    bitcoin: {
        usd: string;
    };
    ethereum: {
        usd: string;
    };
}
export declare class WalletProvider {
    private connection;
    private walletPublicKey;
    private cache;
    constructor(connection: Connection, walletPublicKey: PublicKey);
    private fetchWithRetry;
    fetchPortfolioValue(runtime: any): Promise<WalletPortfolio>;
    fetchPortfolioValueCodex(runtime: any): Promise<WalletPortfolio>;
    fetchPrices(runtime: any): Promise<Prices>;
    formatPortfolio(runtime: any, portfolio: WalletPortfolio, prices: Prices): string;
    getFormattedPortfolio(runtime: any): Promise<string>;
}
declare const walletProvider: Provider;
export { walletProvider };
