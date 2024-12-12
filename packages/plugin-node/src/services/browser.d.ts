import { IBrowserService } from "@ai16z/eliza";
import { Service } from "@ai16z/eliza";
import { IAgentRuntime, ServiceType } from "@ai16z/eliza";
type PageContent = {
    title: string;
    description: string;
    bodyContent: string;
};
export declare class BrowserService extends Service implements IBrowserService {
    private browser;
    private context;
    private blocker;
    private captchaSolver;
    private cacheKey;
    static serviceType: ServiceType;
    static register(runtime: IAgentRuntime): IAgentRuntime;
    getInstance(): IBrowserService;
    constructor();
    initialize(): Promise<void>;
    initializeBrowser(): Promise<void>;
    closeBrowser(): Promise<void>;
    getPageContent(url: string, runtime: IAgentRuntime): Promise<PageContent>;
    private getCacheKey;
    private fetchPageContent;
    private detectCaptcha;
    private solveCaptcha;
    private getHCaptchaWebsiteKey;
    private getReCaptchaWebsiteKey;
    private tryAlternativeSources;
}
export {};
