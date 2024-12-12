import { IAgentRuntime, ITranscriptionService } from "@ai16z/eliza";
import { Service, ServiceType } from "@ai16z/eliza";
export declare class TranscriptionService extends Service implements ITranscriptionService {
    static serviceType: ServiceType;
    private CONTENT_CACHE_DIR;
    private DEBUG_AUDIO_DIR;
    private TARGET_SAMPLE_RATE;
    private isCudaAvailable;
    private openai;
    private queue;
    private processing;
    initialize(_runtime: IAgentRuntime): Promise<void>;
    constructor();
    private ensureCacheDirectoryExists;
    private ensureDebugDirectoryExists;
    private detectCuda;
    private convertAudio;
    private saveDebugAudio;
    transcribeAttachment(audioBuffer: ArrayBuffer): Promise<string | null>;
    transcribe(audioBuffer: ArrayBuffer): Promise<string | null>;
    transcribeAttachmentLocally(audioBuffer: ArrayBuffer): Promise<string | null>;
    private processQueue;
    private transcribeWithOpenAI;
    transcribeLocally(audioBuffer: ArrayBuffer): Promise<string | null>;
}
