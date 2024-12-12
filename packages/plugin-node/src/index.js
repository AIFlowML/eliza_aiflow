export * from "./services/index.ts";
import { BrowserService, ImageDescriptionService, LlamaService, PdfService, SpeechService, TranscriptionService, VideoService, } from "./services/index.ts";
export function createNodePlugin() {
    return {
        name: "default",
        description: "Default plugin, with basic actions and evaluators",
        services: [
            new BrowserService(),
            new ImageDescriptionService(),
            new LlamaService(),
            new PdfService(),
            new SpeechService(),
            new TranscriptionService(),
            new VideoService(),
        ],
    };
}
//# sourceMappingURL=index.js.map