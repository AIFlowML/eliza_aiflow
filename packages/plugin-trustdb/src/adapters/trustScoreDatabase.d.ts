import { Database } from "better-sqlite3";
export interface Recommender {
    id: string;
    address: string;
    solanaPubkey?: string;
    telegramId?: string;
    discordId?: string;
    twitterId?: string;
    ip?: string;
}
export interface RecommenderMetrics {
    recommenderId: string;
    trustScore: number;
    totalRecommendations: number;
    successfulRecs: number;
    avgTokenPerformance: number;
    riskScore: number;
    consistencyScore: number;
    virtualConfidence: number;
    lastActiveDate: Date;
    trustDecay: number;
    lastUpdated: Date;
}
export interface TokenPerformance {
    tokenAddress: string;
    symbol: string;
    priceChange24h: number;
    volumeChange24h: number;
    trade_24h_change: number;
    liquidity: number;
    liquidityChange24h: number;
    holderChange24h: number;
    rugPull: boolean;
    isScam: boolean;
    marketCapChange24h: number;
    sustainedGrowth: boolean;
    rapidDump: boolean;
    suspiciousVolume: boolean;
    validationTrust: number;
    balance: number;
    initialMarketCap: number;
    lastUpdated: Date;
}
export interface TokenRecommendation {
    id: string;
    recommenderId: string;
    tokenAddress: string;
    timestamp: Date;
    initialMarketCap?: number;
    initialLiquidity?: number;
    initialPrice?: number;
}
export interface RecommenderMetricsHistory {
    historyId: string;
    recommenderId: string;
    trustScore: number;
    totalRecommendations: number;
    successfulRecs: number;
    avgTokenPerformance: number;
    riskScore: number;
    consistencyScore: number;
    virtualConfidence: number;
    trustDecay: number;
    recordedAt: Date;
}
export interface TradePerformance {
    token_address: string;
    recommender_id: string;
    buy_price: number;
    sell_price: number;
    buy_timeStamp: string;
    sell_timeStamp: string;
    buy_amount: number;
    sell_amount: number;
    buy_sol: number;
    received_sol: number;
    buy_value_usd: number;
    sell_value_usd: number;
    profit_usd: number;
    profit_percent: number;
    buy_market_cap: number;
    sell_market_cap: number;
    market_cap_change: number;
    buy_liquidity: number;
    sell_liquidity: number;
    liquidity_change: number;
    last_updated: string;
    rapidDump: boolean;
}
interface Transaction {
    tokenAddress: string;
    transactionHash: string;
    type: "buy" | "sell";
    amount: number;
    price: number;
    isSimulation: boolean;
    timestamp: string;
}
export declare class TrustScoreDatabase {
    private db;
    constructor(db: Database);
    private initializeSchema;
    /**
     * Adds a new recommender to the database.
     * @param recommender Recommender object
     * @returns boolean indicating success
     */
    addRecommender(recommender: Recommender): string | null;
    /**
     * Retrieves a recommender by any identifier.
     * @param identifier Any of the recommender's identifiers
     * @returns Recommender object or null
     */
    getRecommender(identifier: string): Recommender | null;
    /**
     * Retrieves an existing recommender or creates a new one if not found.
     * Also initializes metrics for the recommender if they haven't been initialized yet.
     * @param recommender Recommender object containing at least one identifier
     * @returns Recommender object with all details, or null if failed
     */
    getOrCreateRecommender(recommender: Recommender): Recommender | null;
    /**
     * Retrieves an existing recommender or creates a new one if not found.
     * Also initializes metrics for the recommender if they haven't been initialized yet.
     * @param discordId Discord ID of the recommender
     * @returns Recommender object with all details, or null if failed
     */
    getOrCreateRecommenderWithDiscordId(discordId: string): Promise<Recommender | null>;
    /**
     * Retrieves an existing recommender or creates a new one if not found.
     * Also initializes metrics for the recommender if they haven't been initialized yet.
     * @param telegramId Telegram ID of the recommender
     * @returns Recommender object with all details, or null if failed
     */
    getOrCreateRecommenderWithTelegramId(telegramId: string): Promise<Recommender | null>;
    /**
     * Initializes metrics for a recommender if not present.
     * @param recommenderId Recommender's UUID
     */
    initializeRecommenderMetrics(recommenderId: string): boolean;
    /**
     * Retrieves metrics for a recommender.
     * @param recommenderId Recommender's UUID
     * @returns RecommenderMetrics object or null
     */
    getRecommenderMetrics(recommenderId: string): RecommenderMetrics | null;
    /**
     * Logs the current metrics of a recommender into the history table.
     * @param recommenderId Recommender's UUID
     */
    logRecommenderMetricsHistory(recommenderId: string): void;
    /**
     * Updates metrics for a recommender.
     * @param metrics RecommenderMetrics object
     */
    updateRecommenderMetrics(metrics: RecommenderMetrics): void;
    /**
     * Adds or updates token performance metrics.
     * @param performance TokenPerformance object
     */
    upsertTokenPerformance(performance: TokenPerformance): boolean;
    updateTokenBalance(tokenAddress: string, balance: number): boolean;
    /**
     * Retrieves token performance metrics.
     * @param tokenAddress Token's address
     * @returns TokenPerformance object or null
     */
    getTokenPerformance(tokenAddress: string): TokenPerformance | null;
    getTokenBalance(tokenAddress: string): number;
    getAllTokenPerformancesWithBalance(): TokenPerformance[];
    /**
     * Calculates the average trust score of all recommenders who have recommended a specific token.
     * @param tokenAddress The address of the token.
     * @returns The average trust score (validationTrust).
     */
    calculateValidationTrust(tokenAddress: string): number;
    /**
     * Adds a new token recommendation.
     * @param recommendation TokenRecommendation object
     * @returns boolean indicating success
     */
    addTokenRecommendation(recommendation: TokenRecommendation): boolean;
    /**
     * Retrieves all recommendations made by a recommender.
     * @param recommenderId Recommender's UUID
     * @returns Array of TokenRecommendation objects
     */
    getRecommendationsByRecommender(recommenderId: string): TokenRecommendation[];
    /**
     * Retrieves all recommendations for a specific token.
     * @param tokenAddress Token's address
     * @returns Array of TokenRecommendation objects
     */
    getRecommendationsByToken(tokenAddress: string): TokenRecommendation[];
    /**
     * Retrieves all recommendations within a specific timeframe.
     * @param startDate Start date
     * @param endDate End date
     * @returns Array of TokenRecommendation objects
     */
    getRecommendationsByDateRange(startDate: Date, endDate: Date): TokenRecommendation[];
    /**
     * Retrieves historical metrics for a recommender.
     * @param recommenderId Recommender's UUID
     * @returns Array of RecommenderMetricsHistory objects
     */
    getRecommenderMetricsHistory(recommenderId: string): RecommenderMetricsHistory[];
    /**
     * Inserts a new trade performance into the specified table.
     * @param trade The TradePerformance object containing trade details.
     * @param isSimulation Whether the trade is a simulation. If true, inserts into simulation_trade; otherwise, into trade.
     * @returns boolean indicating success.
     */
    addTradePerformance(trade: TradePerformance, isSimulation: boolean): boolean;
    /**
     * Updates an existing trade with sell details.
     * @param tokenAddress The address of the token.
     * @param recommenderId The UUID of the recommender.
     * @param buyTimeStamp The timestamp when the buy occurred.
     * @param sellDetails An object containing sell-related details.
     * @param isSimulation Whether the trade is a simulation. If true, updates in simulation_trade; otherwise, in trade.
     * @returns boolean indicating success.
     */
    updateTradePerformanceOnSell(tokenAddress: string, recommenderId: string, buyTimeStamp: string, sellDetails: {
        sell_price: number;
        sell_timeStamp: string;
        sell_amount: number;
        received_sol: number;
        sell_value_usd: number;
        profit_usd: number;
        profit_percent: number;
        sell_market_cap: number;
        market_cap_change: number;
        sell_liquidity: number;
        liquidity_change: number;
        rapidDump: boolean;
        sell_recommender_id: string | null;
    }, isSimulation: boolean): boolean;
    /**
     * Retrieves trade performance metrics.
     * @param tokenAddress Token's address
     * @param recommenderId Recommender's UUID
     * @param buyTimeStamp Timestamp when the buy occurred
     * @param isSimulation Whether the trade is a simulation. If true, retrieves from simulation_trade; otherwise, from trade.
     * @returns TradePerformance object or null
     */
    getTradePerformance(tokenAddress: string, recommenderId: string, buyTimeStamp: string, isSimulation: boolean): TradePerformance | null;
    /**
     * Retrieves the latest trade performance metrics without requiring buyTimeStamp.
     * @param tokenAddress Token's address
     * @param recommenderId Recommender's UUID
     * @param isSimulation Whether the trade is a simulation. If true, retrieves from simulation_trade; otherwise, from trade.
     * @returns TradePerformance object or null
     */
    getLatestTradePerformance(tokenAddress: string, recommenderId: string, isSimulation: boolean): TradePerformance | null;
    /**
     * Adds a new transaction to the database.
     * @param transaction Transaction object
     * @returns boolean indicating success
     */
    addTransaction(transaction: Transaction): boolean;
    /**
     * Retrieves all transactions for a specific token.
     * @param tokenAddress Token's address
     * @returns Array of Transaction objects
     */
    getTransactionsByToken(tokenAddress: string): Transaction[];
    /**
     * Close the database connection gracefully.
     */
    closeConnection(): void;
}
export {};
