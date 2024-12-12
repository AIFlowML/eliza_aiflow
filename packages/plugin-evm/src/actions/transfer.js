import { parseEther } from "viem";
import { WalletProvider } from "../providers/wallet";
import { transferTemplate } from "../templates";
export { transferTemplate };
export class TransferAction {
    constructor(walletProvider) {
        this.walletProvider = walletProvider;
    }
    async transfer(runtime, params) {
        const walletClient = this.walletProvider.getWalletClient();
        const [fromAddress] = await walletClient.getAddresses();
        await this.walletProvider.switchChain(runtime, params.fromChain);
        try {
            const hash = await walletClient.sendTransaction({
                account: fromAddress,
                to: params.toAddress,
                value: parseEther(params.amount),
                data: params.data,
                kzg: {
                    blobToKzgCommitment: function (blob) {
                        throw new Error("Function not implemented.");
                    },
                    computeBlobKzgProof: function (blob, commitment) {
                        throw new Error("Function not implemented.");
                    },
                },
                chain: undefined,
            });
            return {
                hash,
                from: fromAddress,
                to: params.toAddress,
                value: parseEther(params.amount),
                data: params.data,
            };
        }
        catch (error) {
            throw new Error(`Transfer failed: ${error.message}`);
        }
    }
}
export const transferAction = {
    name: "transfer",
    description: "Transfer tokens between addresses on the same chain",
    handler: async (runtime, message, state, options) => {
        const walletProvider = new WalletProvider(runtime);
        const action = new TransferAction(walletProvider);
        return action.transfer(runtime, options);
    },
    template: transferTemplate,
    validate: async (runtime) => {
        const privateKey = runtime.getSetting("EVM_PRIVATE_KEY");
        return typeof privateKey === "string" && privateKey.startsWith("0x");
    },
    examples: [
        [
            {
                user: "assistant",
                content: {
                    text: "I'll help you transfer 1 ETH to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                    action: "SEND_TOKENS",
                },
            },
            {
                user: "user",
                content: {
                    text: "Transfer 1 ETH to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                    action: "SEND_TOKENS",
                },
            },
        ],
    ],
    similes: ["SEND_TOKENS", "TOKEN_TRANSFER", "MOVE_TOKENS"],
};
//# sourceMappingURL=transfer.js.map