import { createPublicClient, createWalletClient, http, formatUnits, } from "viem";
import { mainnet, base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
export const DEFAULT_CHAIN_CONFIGS = {
    ethereum: {
        chainId: 1,
        name: "Ethereum",
        chain: mainnet,
        rpcUrl: "https://eth.llamarpc.com",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        blockExplorerUrl: "https://etherscan.io",
    },
    base: {
        chainId: 8453,
        name: "Base",
        chain: base,
        rpcUrl: "https://base.llamarpc.com",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        blockExplorerUrl: "https://basescan.org",
    },
};
export const getChainConfigs = (runtime) => {
    return (runtime.character.settings.chains?.evm ||
        DEFAULT_CHAIN_CONFIGS);
};
export class WalletProvider {
    constructor(runtime) {
        this.currentChain = "ethereum";
        const privateKey = runtime.getSetting("EVM_PRIVATE_KEY");
        if (!privateKey)
            throw new Error("EVM_PRIVATE_KEY not configured");
        this.runtime = runtime;
        const account = privateKeyToAccount(privateKey);
        this.address = account.address;
        const createClients = (chain) => {
            const transport = http(getChainConfigs(runtime)[chain].rpcUrl);
            return {
                chain: getChainConfigs(runtime)[chain].chain,
                publicClient: createPublicClient({
                    chain: getChainConfigs(runtime)[chain].chain,
                    transport,
                }),
                walletClient: createWalletClient({
                    chain: getChainConfigs(runtime)[chain].chain,
                    transport,
                    account,
                }),
            };
        };
        this.chainConfigs = {
            ethereum: createClients("ethereum"),
            base: createClients("base"),
        };
    }
    getAddress() {
        return this.address;
    }
    async getWalletBalance() {
        try {
            const client = this.getPublicClient(this.currentChain);
            const walletClient = this.getWalletClient();
            const balance = await client.getBalance({
                address: walletClient.account.address,
            });
            return formatUnits(balance, 18);
        }
        catch (error) {
            console.error("Error getting wallet balance:", error);
            return null;
        }
    }
    async connect() {
        return this.runtime.getSetting("EVM_PRIVATE_KEY");
    }
    async switchChain(runtime, chain) {
        const walletClient = this.chainConfigs[this.currentChain].walletClient;
        if (!walletClient)
            throw new Error("Wallet not connected");
        try {
            await walletClient.switchChain({
                id: getChainConfigs(runtime)[chain].chainId,
            });
        }
        catch (error) {
            if (error.code === 4902) {
                console.log("[WalletProvider] Chain not added to wallet (error 4902) - attempting to add chain first");
                await walletClient.addChain({
                    chain: {
                        ...getChainConfigs(runtime)[chain].chain,
                        rpcUrls: {
                            default: {
                                http: [getChainConfigs(runtime)[chain].rpcUrl],
                            },
                            public: {
                                http: [getChainConfigs(runtime)[chain].rpcUrl],
                            },
                        },
                    },
                });
                await walletClient.switchChain({
                    id: getChainConfigs(runtime)[chain].chainId,
                });
            }
            else {
                throw error;
            }
        }
        this.currentChain = chain;
    }
    getPublicClient(chain) {
        return this.chainConfigs[chain].publicClient;
    }
    getWalletClient() {
        const walletClient = this.chainConfigs[this.currentChain].walletClient;
        if (!walletClient)
            throw new Error("Wallet not connected");
        return walletClient;
    }
    getCurrentChain() {
        return this.currentChain;
    }
    getChainConfig(chain) {
        return getChainConfigs(this.runtime)[chain];
    }
}
export const evmWalletProvider = {
    async get(runtime, message, state) {
        // Check if the user has an EVM wallet
        if (!runtime.getSetting("EVM_PRIVATE_KEY")) {
            return null;
        }
        try {
            const walletProvider = new WalletProvider(runtime);
            const address = walletProvider.getAddress();
            const balance = await walletProvider.getWalletBalance();
            return `EVM Wallet Address: ${address}\nBalance: ${balance} ETH`;
        }
        catch (error) {
            console.error("Error in EVM wallet provider:", error);
            return null;
        }
    },
};
//# sourceMappingURL=wallet.js.map