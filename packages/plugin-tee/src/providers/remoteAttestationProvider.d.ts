import { Provider } from "@ai16z/eliza";
declare class RemoteAttestationProvider {
    private client;
    constructor(endpoint?: string);
    generateAttestation(reportData: string): Promise<string>;
}
declare const remoteAttestationProvider: Provider;
export { remoteAttestationProvider, RemoteAttestationProvider };
