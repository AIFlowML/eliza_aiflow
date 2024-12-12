import { Readable } from "stream";
import { IAgentRuntime, ISpeechService, ServiceType } from "@ai16z/eliza";
import { Service } from "@ai16z/eliza";
export declare class SpeechService extends Service implements ISpeechService {
    static serviceType: ServiceType;
    initialize(_runtime: IAgentRuntime): Promise<void>;
    getInstance(): ISpeechService;
    generate(runtime: IAgentRuntime, text: string): Promise<Readable>;
}
