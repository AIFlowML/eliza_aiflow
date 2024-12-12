import { Content, type Action } from "@ai16z/eliza";
export interface TransferContent extends Content {
    tokenAddress: string;
    recipient: string;
    amount: string | number;
}
declare const _default: Action;
export default _default;
