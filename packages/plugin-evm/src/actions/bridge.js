import { createConfig, executeRoute, getRoutes, } from "@lifi/sdk";
import { getChainConfigs, WalletProvider } from "../providers/wallet";
import { bridgeTemplate } from "../templates";
export { bridgeTemplate };
export class BridgeAction {
    constructor(walletProvider) {
        this.walletProvider = walletProvider;
        this.config = createConfig({
            integrator: "eliza",
            chains: Object.values(getChainConfigs(this.walletProvider.runtime)).map((config) => ({
                id: config.chainId,
                name: config.name,
                key: config.name.toLowerCase(),
                chainType: "EVM",
                nativeToken: {
                    ...config.nativeCurrency,
                    chainId: config.chainId,
                    address: "0x0000000000000000000000000000000000000000",
                    coinKey: config.nativeCurrency.symbol,
                },
                metamask: {
                    chainId: `0x${config.chainId.toString(16)}`,
                    chainName: config.name,
                    nativeCurrency: config.nativeCurrency,
                    rpcUrls: [config.rpcUrl],
                    blockExplorerUrls: [config.blockExplorerUrl],
                },
                diamondAddress: "0x0000000000000000000000000000000000000000",
                coin: config.nativeCurrency.symbol,
                mainnet: true,
            })),
        });
    }
    async bridge(params) {
        const walletClient = this.walletProvider.getWalletClient();
        const [fromAddress] = await walletClient.getAddresses();
        const routes = await getRoutes({
            fromChainId: getChainConfigs(this.walletProvider.runtime)[params.fromChain].chainId,
            toChainId: getChainConfigs(this.walletProvider.runtime)[params.toChain].chainId,
            fromTokenAddress: params.fromToken,
            toTokenAddress: params.toToken,
            fromAmount: params.amount,
            fromAddress: fromAddress,
            toAddress: params.toAddress || fromAddress,
        });
        if (!routes.routes.length)
            throw new Error("No routes found");
        const execution = await executeRoute(routes.routes[0], this.config);
        const process = execution.steps[0]?.execution?.process[0];
        if (!process?.status || process.status === "FAILED") {
            throw new Error("Transaction failed");
        }
        return {
            hash: process.txHash,
            from: fromAddress,
            to: routes.routes[0].steps[0].estimate
                .approvalAddress,
            value: BigInt(params.amount),
            chainId: getChainConfigs(this.walletProvider.runtime)[params.fromChain].chainId,
        };
    }
}
export const bridgeAction = {
    name: "bridge",
    description: "Bridge tokens between different chains",
    handler: async (runtime, message, state, options) => {
        const walletProvider = new WalletProvider(runtime);
        const action = new BridgeAction(walletProvider);
        return action.bridge(options);
    },
    template: bridgeTemplate,
    validate: async (runtime) => {
        const privateKey = runtime.getSetting("EVM_PRIVATE_KEY");
        return typeof privateKey === "string" && privateKey.startsWith("0x");
    },
    examples: [
        [
            {
                user: "user",
                content: {
                    text: "Bridge 1 ETH from Ethereum to Base",
                    action: "CROSS_CHAIN_TRANSFER",
                },
            },
        ],
    ],
    similes: ["CROSS_CHAIN_TRANSFER", "CHAIN_BRIDGE", "MOVE_CROSS_CHAIN"],
}; // TODO: add more examples / similies
//# sourceMappingURL=bridge.js.map