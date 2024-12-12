import { TrustScoreDatabase } from "@ai16z/plugin-trustdb";
import { TokenProvider } from "./token.ts";
import { IAgentRuntime } from "@ai16z/eliza";
interface SellDetails {
    sell_amount: number;
    sell_recommender_id: string | null;
}
export declare class SimulationSellingService {
    private trustScoreDb;
    private walletProvider;
    private connection;
    private baseMint;
    private DECAY_RATE;
    private MAX_DECAY_DAYS;
    private backend;
    private backendToken;
    private amqpConnection;
    private amqpChannel;
    private sonarBe;
    private sonarBeToken;
    private runtime;
    private runningProcesses;
    constructor(runtime: IAgentRuntime, trustScoreDb: TrustScoreDatabase);
    /**
     * Initializes the RabbitMQ connection and starts consuming messages.
     * @param amqpUrl The RabbitMQ server URL.
     */
    private initializeRabbitMQ;
    /**
     * Sets up the consumer for the specified RabbitMQ queue.
     */
    private consumeMessages;
    /**
     * Processes incoming messages from RabbitMQ.
     * @param message The message content as a string.
     */
    private processMessage;
    /**
     * Executes a single sell decision.
     * @param decision The sell decision containing token performance and amount to sell.
     */
    private executeSellDecision;
    startService(): Promise<void>;
    startListeners(): Promise<void>;
    private processTokenPerformances;
    processTokenPerformance(tokenAddress: string, recommenderId: string): void;
    private startProcessInTheSonarBackend;
    private stopProcessInTheSonarBackend;
    updateSellDetails(tokenAddress: string, recommenderId: string, sellTimeStamp: string, sellDetails: SellDetails, isSimulation: boolean, tokenProvider: TokenProvider): Promise<{
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
    isRapidDump(tokenAddress: string, tokenProvider: TokenProvider): Promise<boolean>;
    delay(ms: number): Promise<unknown>;
    updateTradeInBe(tokenAddress: string, recommenderId: string, username: string, data: SellDetails, balanceLeft: number, retries?: number, delayMs?: number): Promise<void>;
}
export {};
