import { Action } from "@ai16z/eliza";
export declare const transcriptionTemplate = "# Transcription of media file\n{{mediaTranscript}}\n\n# Instructions: Return only the full transcript of the media file without any additional context or commentary.";
export declare const mediaAttachmentIdTemplate = "# Messages we are transcribing\n{{recentMessages}}\n\n# Instructions: {{senderName}} is requesting a transcription of a specific media file (audio or video). Your goal is to determine the ID of the attachment they want transcribed.\nThe \"attachmentId\" is the ID of the media file attachment that the user wants transcribed. If not specified, return null.\n\nYour response must be formatted as a JSON block with this structure:\n```json\n{\n  \"attachmentId\": \"<Attachment ID>\"\n}\n```\n";
declare const transcribeMediaAction: Action;
export default transcribeMediaAction;
