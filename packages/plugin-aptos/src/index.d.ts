import { Plugin } from "@ai16z/eliza";
import transferToken from "./actions/transfer.ts";
import { WalletProvider } from "./providers/wallet.ts";
export { WalletProvider, transferToken as TransferAptosToken };
export declare const aptosPlugin: Plugin;
export default aptosPlugin;
