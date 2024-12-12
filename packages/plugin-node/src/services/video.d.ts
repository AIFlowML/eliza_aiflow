import { Service } from "@ai16z/eliza";
import { IAgentRuntime, Media, ServiceType, IVideoService } from "@ai16z/eliza";
export declare class VideoService extends Service implements IVideoService {
    static serviceType: ServiceType;
    private cacheKey;
    private dataDir;
    private queue;
    private processing;
    constructor();
    getInstance(): IVideoService;
    initialize(_runtime: IAgentRuntime): Promise<void>;
    private ensureDataDirectoryExists;
    isVideoUrl(url: string): boolean;
    downloadMedia(url: string): Promise<string>;
    downloadVideo(videoInfo: any): Promise<string>;
    processVideo(url: string, runtime: IAgentRuntime): Promise<Media>;
    private processQueue;
    private processVideoFromUrl;
    private getVideoId;
    fetchVideoInfo(url: string): Promise<any>;
    private getTranscript;
    private downloadCaption;
    private parseCaption;
    private parseSRT;
    private downloadSRT;
    transcribeAudio(url: string, runtime: IAgentRuntime): Promise<string>;
    private convertMp4ToMp3;
    private downloadAudio;
}
