import { ICacheManager, Provider } from "@ai16z/eliza";
import { Aptos } from "@aptos-labs/ts-sdk";
interface WalletPortfolio {
    totalUsd: string;
    totalApt: string;
}
interface Prices {
    apt: {
        usd: string;
    };
}
export declare class WalletProvider {
    private aptosClient;
    private address;
    private cacheManager;
    private cache;
    private cacheKey;
    constructor(aptosClient: Aptos, address: string, cacheManager: ICacheManager);
    private readFromCache;
    private writeToCache;
    private getCachedData;
    private setCachedData;
    private fetchPricesWithRetry;
    fetchPortfolioValue(): Promise<WalletPortfolio>;
    fetchPrices(): Promise<Prices>;
    formatPortfolio(runtime: any, portfolio: WalletPortfolio): string;
    getFormattedPortfolio(runtime: any): Promise<string>;
}
declare const walletProvider: Provider;
export { walletProvider };
