import { Keypair } from "@solana/web3.js";
import crypto from "crypto";
import { TappdClient } from "@phala/dstack-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { keccak256 } from "viem";
class DeriveKeyProvider {
    constructor(endpoint) {
        this.client = endpoint ? new TappdClient(endpoint) : new TappdClient();
    }
    async rawDeriveKey(path, subject) {
        try {
            if (!path || !subject) {
                console.error("Path and Subject are required for key derivation");
            }
            console.log("Deriving Raw Key in TEE...");
            const derivedKey = await this.client.deriveKey(path, subject);
            console.log("Raw Key Derived Successfully!");
            return derivedKey;
        }
        catch (error) {
            console.error("Error deriving raw key:", error);
            throw error;
        }
    }
    async deriveEd25519Keypair(path, subject) {
        try {
            if (!path || !subject) {
                console.error("Path and Subject are required for key derivation");
            }
            console.log("Deriving Key in TEE...");
            const derivedKey = await this.client.deriveKey(path, subject);
            const uint8ArrayDerivedKey = derivedKey.asUint8Array();
            const hash = crypto.createHash("sha256");
            hash.update(uint8ArrayDerivedKey);
            const seed = hash.digest();
            const seedArray = new Uint8Array(seed);
            const keypair = Keypair.fromSeed(seedArray.slice(0, 32));
            console.log("Key Derived Successfully!");
            return keypair;
        }
        catch (error) {
            console.error("Error deriving key:", error);
            throw error;
        }
    }
    async deriveEcdsaKeypair(path, subject) {
        try {
            if (!path || !subject) {
                console.error("Path and Subject are required for key derivation");
            }
            console.log("Deriving ECDSA Key in TEE...");
            const deriveKeyResponse = await this.client.deriveKey(path, subject);
            const hex = keccak256(deriveKeyResponse.asUint8Array());
            const keypair = privateKeyToAccount(hex);
            console.log("ECDSA Key Derived Successfully!");
            return keypair;
        }
        catch (error) {
            console.error("Error deriving ecdsa key:", error);
            throw error;
        }
    }
}
const deriveKeyProvider = {
    get: async (runtime, _message, _state) => {
        const endpoint = runtime.getSetting("DSTACK_SIMULATOR_ENDPOINT");
        const provider = new DeriveKeyProvider(endpoint);
        try {
            // Validate wallet configuration
            if (!runtime.getSetting("WALLET_SECRET_SALT")) {
                console.error("Wallet secret salt is not configured in settings");
                return "";
            }
            let keypair;
            try {
                const secretSalt = runtime.getSetting("WALLET_SECRET_SALT") || "secret_salt";
                const solanaKeypair = await provider.deriveEd25519Keypair("/", secretSalt);
                const evmKeypair = await provider.deriveEcdsaKeypair("/", secretSalt);
                return JSON.stringify({
                    solana: solanaKeypair.publicKey,
                    evm: evmKeypair.address,
                });
            }
            catch (error) {
                console.error("Error creating PublicKey:", error);
                return "";
            }
            return keypair;
        }
        catch (error) {
            console.error("Error in derive key provider:", error.message);
            return `Failed to fetch derive key information: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
    },
};
export { deriveKeyProvider, DeriveKeyProvider };
//# sourceMappingURL=deriveKeyProvider.js.map