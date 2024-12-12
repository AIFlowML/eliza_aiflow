export * from "./services/index.ts";
import { BrowserService, ImageDescriptionService, LlamaService, PdfService, SpeechService, TranscriptionService, VideoService } from "./services/index.ts";
export type NodePlugin = ReturnType<typeof createNodePlugin>;
export declare function createNodePlugin(): {
    readonly name: "default";
    readonly description: "Default plugin, with basic actions and evaluators";
    readonly services: [BrowserService, ImageDescriptionService, LlamaService, PdfService, SpeechService, TranscriptionService, VideoService];
};
