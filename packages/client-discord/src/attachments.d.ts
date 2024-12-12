import { IAgentRuntime, Media } from "@ai16z/eliza";
import { Attachment, Collection } from "discord.js";
export declare class AttachmentManager {
    private attachmentCache;
    private runtime;
    constructor(runtime: IAgentRuntime);
    processAttachments(attachments: Collection<string, Attachment> | Attachment[]): Promise<Media[]>;
    processAttachment(attachment: Attachment): Promise<Media | null>;
    private processAudioVideoAttachment;
    private extractAudioFromMP4;
    private processPdfAttachment;
    private processPlaintextAttachment;
    private processImageAttachment;
    private createFallbackImageMedia;
    private processVideoAttachment;
    private processGenericAttachment;
}
