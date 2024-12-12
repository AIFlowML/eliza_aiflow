import { Plugin } from "@ai16z/eliza";
export declare function saveBase64Image(base64Data: string, filename: string): string;
export declare function saveHeuristImage(imageUrl: string, filename: string): Promise<string>;
export declare const imageGenerationPlugin: Plugin;
