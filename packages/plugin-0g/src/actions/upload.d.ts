import { Action, Content } from "@ai16z/eliza";
export interface UploadContent extends Content {
    filePath: string;
}
export declare const zgUpload: Action;
