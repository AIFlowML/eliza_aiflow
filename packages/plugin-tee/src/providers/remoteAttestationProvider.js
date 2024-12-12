import { TappdClient } from "@phala/dstack-sdk";
class RemoteAttestationProvider {
    constructor(endpoint) {
        this.client = endpoint ? new TappdClient(endpoint) : new TappdClient();
    }
    async generateAttestation(reportData) {
        try {
            console.log("Generating remote attestation...");
            const tdxQuote = await this.client.tdxQuote(reportData);
            console.log("Remote attestation generated successfully!");
            return JSON.stringify(tdxQuote);
        }
        catch (error) {
            console.error("Error generating remote attestation:", error);
            return `Failed to generate TDX Quote: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
    }
}
// Keep the original provider for backwards compatibility
const remoteAttestationProvider = {
    get: async (runtime, _message, _state) => {
        const endpoint = runtime.getSetting("DSTACK_SIMULATOR_ENDPOINT");
        const provider = new RemoteAttestationProvider(endpoint);
        const agentId = runtime.agentId;
        try {
            const attestation = await provider.generateAttestation(agentId);
            return `Your Agent's remote attestation is: ${attestation}`;
        }
        catch (error) {
            console.error("Error in remote attestation provider:", error);
            return "";
        }
    },
};
export { remoteAttestationProvider, RemoteAttestationProvider };
//# sourceMappingURL=remoteAttestationProvider.js.map