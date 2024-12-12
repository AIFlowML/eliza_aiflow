import { TokenSecurityData } from "../types/token.ts";
import { TokenProvider } from "./token.ts";
import { TrustScoreDatabase, RecommenderMetrics, TokenPerformance, TradePerformance } from "@ai16z/plugin-trustdb";
import { IAgentRuntime, Provider } from "@ai16z/eliza";
interface TradeData {
    buy_amount: number;
    is_simulation: boolean;
}
interface sellDetails {
    sell_amount: number;
    sell_recommender_id: string | null;
}
interface RecommenderData {
    recommenderId: string;
    trustScore: number;
    riskScore: number;
    consistencyScore: number;
    recommenderMetrics: RecommenderMetrics;
}
interface TokenRecommendationSummary {
    tokenAddress: string;
    averageTrustScore: number;
    averageRiskScore: number;
    averageConsistencyScore: number;
    recommenders: RecommenderData[];
}
export declare class TrustScoreManager {
    private tokenProvider;
    private trustScoreDb;
    private simulationSellingService;
    private connection;
    private baseMint;
    private DECAY_RATE;
    private MAX_DECAY_DAYS;
    private backend;
    private backendToken;
    constructor(runtime: IAgentRuntime, tokenProvider: TokenProvider, trustScoreDb: TrustScoreDatabase);
    getRecommenederBalance(recommenderWallet: string): Promise<number>;
    /**
     * Generates and saves trust score based on processed token data and user recommendations.
     * @param tokenAddress The address of the token to analyze.
     * @param recommenderId The UUID of the recommender.
     * @returns An object containing TokenPerformance and RecommenderMetrics.
     */
    generateTrustScore(tokenAddress: string, recommenderId: string, recommenderWallet: string): Promise<{
        tokenPerformance: TokenPerformance;
        recommenderMetrics: RecommenderMetrics;
    }>;
    updateRecommenderMetrics(recommenderId: string, tokenPerformance: TokenPerformance, recommenderWallet: string): Promise<void>;
    calculateTrustScore(tokenPerformance: TokenPerformance, recommenderMetrics: RecommenderMetrics): number;
    calculateOverallRiskScore(tokenPerformance: TokenPerformance, recommenderMetrics: RecommenderMetrics): number;
    calculateRiskScore(tokenPerformance: TokenPerformance): number;
    calculateConsistencyScore(tokenPerformance: TokenPerformance, recommenderMetrics: RecommenderMetrics): number;
    suspiciousVolume(tokenAddress: string): Promise<boolean>;
    sustainedGrowth(tokenAddress: string): Promise<boolean>;
    isRapidDump(tokenAddress: string): Promise<boolean>;
    checkTrustScore(tokenAddress: string): Promise<TokenSecurityData>;
    /**
     * Creates a TradePerformance object based on token data and recommender.
     * @param tokenAddress The address of the token.
     * @param recommenderId The UUID of the recommender.
     * @param data ProcessedTokenData.
     * @returns TradePerformance object.
     */
    createTradePerformance(runtime: IAgentRuntime, tokenAddress: string, recommenderId: string, data: TradeData): Promise<TradePerformance>;
    delay(ms: number): Promise<unknown>;
    createTradeInBe(tokenAddress: string, recommenderId: string, data: TradeData, retries?: number, delayMs?: number): Promise<void>;
    /**
     * Updates a trade with sell details.
     * @param tokenAddress The address of the token.
     * @param recommenderId The UUID of the recommender.
     * @param buyTimeStamp The timestamp when the buy occurred.
     * @param sellDetails An object containing sell-related details.
     * @param isSimulation Whether the trade is a simulation. If true, updates in simulation_trade; otherwise, in trade.
     * @returns boolean indicating success.
     */
    updateSellDetails(runtime: IAgentRuntime, tokenAddress: string, recommenderId: string, sellTimeStamp: string, sellDetails: sellDetails, isSimulation: boolean): Promise<{
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
    }>;
    getRecommendations(startDate: Date, endDate: Date): Promise<Array<TokenRecommendationSummary>>;
}
export declare const trustScoreProvider: Provider;
export {};
