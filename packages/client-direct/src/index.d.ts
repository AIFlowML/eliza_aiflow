import express from "express";
import { AgentRuntime } from "@ai16z/eliza";
import { Client } from "@ai16z/eliza";
export declare const messageHandlerTemplate: string;
export interface SimliClientConfig {
    apiKey: string;
    faceID: string;
    handleSilence: boolean;
    videoRef: any;
    audioRef: any;
}
export declare class DirectClient {
    app: express.Application;
    private agents;
    private server;
    constructor();
    registerAgent(runtime: AgentRuntime): void;
    unregisterAgent(runtime: AgentRuntime): void;
    start(port: number): void;
    stop(): void;
}
export declare const DirectClientInterface: Client;
export default DirectClientInterface;
