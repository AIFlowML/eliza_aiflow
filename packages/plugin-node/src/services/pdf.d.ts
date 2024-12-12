import { IAgentRuntime, IPdfService, Service, ServiceType } from "@ai16z/eliza";
export declare class PdfService extends Service implements IPdfService {
    static serviceType: ServiceType;
    constructor();
    getInstance(): IPdfService;
    initialize(_runtime: IAgentRuntime): Promise<void>;
    convertPdfToText(pdfBuffer: Buffer): Promise<string>;
}
