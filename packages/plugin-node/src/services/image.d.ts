import { Service } from "@ai16z/eliza";
import { IAgentRuntime, ServiceType, IImageDescriptionService } from "@ai16z/eliza";
export declare class ImageDescriptionService extends Service implements IImageDescriptionService {
    static serviceType: ServiceType;
    private modelId;
    private device;
    private model;
    private processor;
    private tokenizer;
    private initialized;
    private runtime;
    private queue;
    private processing;
    getInstance(): IImageDescriptionService;
    initialize(runtime: IAgentRuntime): Promise<void>;
    private initializeLocalModel;
    describeImage(imageUrl: string): Promise<{
        title: string;
        description: string;
    }>;
    private recognizeWithOpenAI;
    private requestOpenAI;
    private processQueue;
    private processImage;
    private extractFirstFrameFromGif;
}
export default ImageDescriptionService;
