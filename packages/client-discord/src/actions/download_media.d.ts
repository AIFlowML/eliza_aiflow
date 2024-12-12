import { Action } from "@ai16z/eliza";
export declare const mediaUrlTemplate = "# Messages we are searching for a media URL\n{{recentMessages}}\n\n# Instructions: {{senderName}} is requesting to download a specific media file (video or audio). Your goal is to determine the URL of the media they want to download.\nThe \"mediaUrl\" is the URL of the media file that the user wants downloaded. If not specified, return null.\n\nYour response must be formatted as a JSON block with this structure:\n```json\n{\n  \"mediaUrl\": \"<Media URL>\"\n}\n```\n";
declare const _default: Action;
export default _default;
