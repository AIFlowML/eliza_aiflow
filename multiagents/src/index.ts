/**
 * Multi-Agent Orchestration System for Eliza Framework
 *
 * This module implements a multi-agent communication and coordination system,
 * allowing multiple Eliza agents to interact with each other and with users.
 *
 * Key Differences from Original Eliza:
 * 1. Removed client-specific imports (auto, discord, telegram, etc.)
 * 2. Removed plugin-specific imports (coinbase, solana, etc.)
 * 3. Added AgentOrchestrator for multi-agent management
 * 4. Simplified token and secret management
 * 5. Added message routing and broadcasting capabilities
 * 6. Added message buffering for asynchronous communication
 *
 * @module multiagents
 */

import { PostgresDatabaseAdapter } from "@ai16z/adapter-postgres";
import { SqliteDatabaseAdapter } from "@ai16z/adapter-sqlite";
import {
    AgentRuntime,
    CacheManager,
    Character,
    Clients,
    DbCacheAdapter,
    FsCacheAdapter,
    IAgentRuntime,
    ICacheManager,
    IDatabaseAdapter,
    IDatabaseCacheAdapter,
    ModelProviderName,
    defaultCharacter,
    elizaLogger,
    settings,
    stringToUuid,
    validateCharacterConfig,
    Memory,
    UUID,
    IMemoryManager,
} from "@ai16z/eliza";
import { v4 } from 'uuid';
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import yargs from "yargs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize readline interface for CLI interaction
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Add global type declaration
declare global {
    var orchestrator: AgentOrchestrator | undefined;
}

/**
 * AgentOrchestrator Class
 *
 * Manages communication and coordination between multiple agents.
 * Handles message routing, broadcasting, and buffering.
 */
export class AgentOrchestrator {
    /** Map of agent IDs to their runtime instances */
    private agents: Map<UUID, IAgentRuntime> = new Map();
    /** Buffer for storing messages that need to be processed by each agent */
    private messageBuffer: Map<UUID, Memory[]> = new Map();

    /**
     * Registers a new agent with the orchestrator
     * @param agent The agent runtime to register
     */
    registerAgent(agent: IAgentRuntime): void {
        this.agents.set(agent.agentId, agent);
        this.messageBuffer.set(agent.agentId, []);
        elizaLogger.info(`Agent ${agent.agentId} registered with orchestrator`);
    }

    /**
     * Retrieves an agent by its ID
     * @param agentId The UUID of the agent to retrieve
     */
    getAgent(agentId: UUID): IAgentRuntime | undefined {
        return this.agents.get(agentId);
    }

    /**
     * Routes a message from one agent to another
     * @param fromAgentId The sender agent's ID
     * @param toAgentId The recipient agent's ID
     * @param message The message to route
     */
    async routeMessage(fromAgentId: UUID, toAgentId: UUID, message: Memory): Promise<void> {
        const fromAgent = this.agents.get(fromAgentId);
        const toAgent = this.agents.get(toAgentId);

        if (!fromAgent || !toAgent) {
            throw new Error(`Agent not found: ${!fromAgent ? fromAgentId : toAgentId}`);
        }

        // Store outgoing message in sender's memory
        await fromAgent.messageManager.createMemory({
            ...message,
            content: {
                ...message.content,
                sentTo: toAgentId,
                type: 'outgoing'
            }
        });

        // Store incoming message in recipient's memory
        await toAgent.messageManager.createMemory({
            ...message,
            id: stringToUuid(v4()),
            content: {
                ...message.content,
                receivedFrom: fromAgentId,
                type: 'incoming'
            }
        });

        // Buffer the message for processing
        const buffer = this.messageBuffer.get(toAgentId) || [];
        buffer.push(message);
        this.messageBuffer.set(toAgentId, buffer);
    }

    /**
     * Broadcasts a message to all agents except the sender
     * @param fromAgentId The broadcasting agent's ID
     * @param message The message to broadcast
     */
    async broadcast(fromAgentId: UUID, message: Memory): Promise<void> {
        const fromAgent = this.agents.get(fromAgentId);
        if (!fromAgent) {
            throw new Error(`Source agent not found: ${fromAgentId}`);
        }

        // Store broadcast message in sender's memory
        await fromAgent.messageManager.createMemory({
            ...message,
            content: {
                ...message.content,
                type: 'broadcast'
            }
        });

        // Route message to all other agents
        for (const [agentId, _] of this.agents.entries()) {
            if (agentId !== fromAgentId) {
                await this.routeMessage(fromAgentId, agentId, message);
            }
        }
    }

    /**
     * Retrieves and clears buffered messages for an agent
     * @param agentId The agent's ID
     */
    async getBufferedMessages(agentId: UUID): Promise<Memory[]> {
        const buffer = this.messageBuffer.get(agentId) || [];
        this.messageBuffer.set(agentId, []);
        return buffer;
    }

    /**
     * Processes all buffered messages for an agent
     * @param agentId The agent's ID
     */
    async processBufferedMessages(agentId: UUID): Promise<void> {
        const agent = this.agents.get(agentId);
        if (!agent) return;

        const messages = await this.getBufferedMessages(agentId);
        for (const message of messages) {
            await agent.messageManager.createMemory(message);
        }
    }

    /**
     * Returns all registered agents
     */
    getAgents(): Map<UUID, IAgentRuntime> {
        return this.agents;
    }
}

/**
 * Gets the appropriate token for a model provider
 * Simplified from original to only handle basic token retrieval
 */
function getTokenForProvider(provider: ModelProviderName, character: Character): string {
    const token = character.settings?.secrets?.OPENAI_API_KEY || settings.OPENAI_API_KEY;
    if (!token) {
        throw new Error("No API token found for the model provider");
    }
    return token;
}

/**
 * Retrieves a secret from character settings or environment variables
 */
function getSecret(character: Character, secret: string) {
    return character.settings?.secrets?.[secret] || process.env[secret];
}

/**
 * Initializes the appropriate database adapter
 * @param dataDir Directory for database files
 */
function initializeDatabase(dataDir: string): IDatabaseAdapter & IDatabaseCacheAdapter {
    if (process.env.POSTGRES_URL) {
        elizaLogger.info("Initializing PostgreSQL connection...");
        const db = new PostgresDatabaseAdapter({
            connectionString: process.env.POSTGRES_URL,
            parseInputs: true,
        }) as PostgresDatabaseAdapter & IDatabaseAdapter & IDatabaseCacheAdapter;

        // Test the connection
        db.init()
            .then(() => {
                elizaLogger.success("Successfully connected to PostgreSQL database");
            })
            .catch((error) => {
                elizaLogger.error("Failed to connect to PostgreSQL:", error);
            });

        return db;
    } else {
        const filePath = process.env.SQLITE_FILE ?? path.resolve(dataDir, "db.sqlite");
        const sqliteDb = new Database(filePath);
        const db = new SqliteDatabaseAdapter(sqliteDb) as SqliteDatabaseAdapter & IDatabaseAdapter & IDatabaseCacheAdapter;
        return db;
    }
}

/**
 * Initializes client interfaces for an agent
 * Simplified to return empty array as client handling is removed
 */
async function initializeClients(character: Character, runtime: IAgentRuntime): Promise<Clients[]> {
    return [];
}

/**
 * Cleanup all cache entries for an agent
 * @param agent The agent runtime instance
 */
async function cleanupAgentCache(agent: IAgentRuntime): Promise<void> {
    elizaLogger.info(`Starting cache cleanup for agent ${agent.agentId}`);

    try {
        // Delete all cache entries one by one since there's no clear method
        const cacheKeys = ['messages', 'embeddings', 'knowledge', 'documents', 'descriptions'];
        for (const key of cacheKeys) {
            elizaLogger.debug(`Deleting cache key: ${key}`);
            await agent.cacheManager.delete(key);
        }
        elizaLogger.success(`Cache cleanup completed for agent ${agent.agentId}`);
    } catch (error) {
        elizaLogger.error(`Error cleaning up cache for agent ${agent.agentId}:`, error);
    }
}

/**
 * Enhanced graceful shutdown with proper cleanup and logging
 */
async function gracefulExit() {
    elizaLogger.log("\n=== Initiating graceful shutdown ===");

    try {
        // Close readline interface
        elizaLogger.debug("Closing readline interface...");
        rl.close();

        // Clean up database connections and cache
        const orchestrator = global.orchestrator;
        if (orchestrator) {
            elizaLogger.info(`Found ${orchestrator.getAgents().size} agents to cleanup`);

            for (const [agentId, agent] of orchestrator.getAgents()) {
                elizaLogger.info(`\nCleaning up agent: ${agentId}`);

                try {
                    // Clean up cache
                    elizaLogger.debug("Cleaning up cache...");
                    await cleanupAgentCache(agent);

                    // Close database connection if available
                    if ('databaseAdapter' in agent && agent.databaseAdapter && 'close' in agent.databaseAdapter) {
                        elizaLogger.debug("Closing database connection...");
                        await agent.databaseAdapter.close();
                        elizaLogger.success("Database connection closed");
                    }
                } catch (error) {
                    elizaLogger.error(`Error cleaning up agent ${agentId}:`, error);
                }
            }
        } else {
            elizaLogger.warn("No orchestrator found, skipping agent cleanup");
        }

        elizaLogger.success("\n=== Cleanup completed successfully ===");
        process.exit(0);
    } catch (error) {
        elizaLogger.error("\n=== Error during shutdown ===");
        elizaLogger.error(error);
        process.exit(1);
    }
}

/**
 * Enhanced startAgent with better logging
 */
async function startAgent(
    character: Character,
    orchestrator: AgentOrchestrator
): Promise<{ runtime: IAgentRuntime; clients: Clients[] }> {
    elizaLogger.info(`\n=== Starting agent: ${character.name} ===`);

    try {
        elizaLogger.debug("Initializing character ID and username...");
        character.id = character.id ?? stringToUuid(character.name);
        character.username = character.username ?? character.name;

        elizaLogger.debug("Getting model provider token...");
        const token = getTokenForProvider(character.modelProvider, character);

        elizaLogger.debug("Setting up data directory...");
        const dataDir = path.join(__dirname, "../data");
        if (!fs.existsSync(dataDir)) {
            elizaLogger.debug(`Creating data directory: ${dataDir}`);
            fs.mkdirSync(dataDir, { recursive: true });
        }

        elizaLogger.debug("Initializing database...");
        const db = await initializeDatabase(dataDir);

        elizaLogger.debug("Setting up cache manager...");
        const cacheAdapter = new DbCacheAdapter(db, character.id);
        const cache = new CacheManager(cacheAdapter);

        elizaLogger.debug("Creating agent runtime...");
        const runtime = new AgentRuntime({
            databaseAdapter: db,
            token,
            modelProvider: character.modelProvider,
            character,
            plugins: [],
            cacheManager: cache,
        });

        elizaLogger.debug("Initializing runtime...");
        await runtime.initialize();

        elizaLogger.debug("Registering with orchestrator...");
        orchestrator.registerAgent(runtime);

        elizaLogger.debug("Initializing clients...");
        const clients = await initializeClients(character, runtime);

        elizaLogger.success(`=== Agent ${character.name} started successfully ===\n`);
        return { runtime, clients };
    } catch (error) {
        elizaLogger.error(`\n=== Error starting agent ${character.name} ===`);
        elizaLogger.error(error);
        throw error;
    }
}

/**
 * Handles user input and routes messages to appropriate agents
 * @param input User input string
 * @param primaryAgentId ID of the primary agent
 * @param orchestrator The orchestrator instance
 */
async function handleUserInput(input: string, primaryAgentId: UUID, orchestrator: AgentOrchestrator) {
    if (input.toLowerCase() === "exit") {
        await gracefulExit();
        return;
    }

    try {
        // Parse input for direct messaging (@agent message)
        const agentMatch = input.match(/^@(\w+)\s+(.+)$/);
        const targetAgentId = agentMatch ? stringToUuid(agentMatch[1]) : primaryAgentId;
        const messageText = agentMatch ? agentMatch[2] : input;

        // Handle broadcast messages (@all message)
        if (targetAgentId.toLowerCase() === "all") {
            const message: Memory = {
                id: stringToUuid(v4()),
                content: { text: messageText },
                userId: stringToUuid("user"),
                roomId: stringToUuid("global"),
                agentId: primaryAgentId,
                createdAt: Date.now()
            };
            await orchestrator.broadcast(primaryAgentId, message);
            elizaLogger.info("Message broadcast to all agents");
            return;
        }

        // Handle direct messages
        const targetAgent = orchestrator.getAgent(targetAgentId);
        if (!targetAgent) {
            elizaLogger.error(`Agent ${targetAgentId} not found`);
            return;
        }

        const message: Memory = {
            id: stringToUuid(v4()),
            content: { text: messageText },
            userId: stringToUuid("user"),
            roomId: stringToUuid("direct"),
            agentId: targetAgentId,
            createdAt: Date.now()
        };

        await targetAgent.messageManager.createMemory(message);

        // Process buffered messages for all agents
        for (const [agentId, _] of orchestrator.getAgents().entries()) {
            await orchestrator.processBufferedMessages(agentId);
        }
    } catch (error) {
        elizaLogger.error("Error processing message:", error);
    }
}

/**
 * CLI chat interface
 * @param primaryAgentId The ID of the primary agent
 * @param orchestrator The orchestrator instance
 */
function chat(primaryAgentId: UUID, orchestrator: AgentOrchestrator) {
    rl.question("You: ", async (input) => {
        await handleUserInput(input, primaryAgentId, orchestrator);
        if (input.toLowerCase() !== "exit") {
            chat(primaryAgentId, orchestrator);
        }
    });
}

/**
 * Parse command line arguments
 */
function parseArguments(): {
    character?: string;
    characters?: string;
} {
    try {
        return yargs(process.argv.slice(3))
            .option("character", {
                type: "string",
                description: "Path to the character JSON file",
            })
            .option("characters", {
                type: "string",
                description: "Comma separated list of paths to character JSON files",
            })
            .parseSync();
    } catch (error) {
        elizaLogger.error("Error parsing arguments:", error);
        return {};
    }
}

function tryLoadFile(filePath: string): string | null {
    try {
        return fs.readFileSync(filePath, "utf8");
    } catch (e) {
        return null;
    }
}

/**
 * Load character configurations from files
 * Enhanced with robust path resolution and validation
 */
async function loadCharacters(charactersArg: string): Promise<Character[]> {
    let characterPaths = charactersArg.split(",").map((filePath) => filePath.trim());
    const loadedCharacters = [];

    for (const characterPath of characterPaths) {
        let content = null;
        let resolvedPath = "";

        // Try different path resolutions in order
        const pathsToTry = [
            characterPath,
            path.resolve(process.cwd(), characterPath),
            path.resolve(process.cwd(), "agent", characterPath),
            path.resolve(__dirname, characterPath),
            path.resolve(__dirname, "characters", path.basename(characterPath)),
            path.resolve(__dirname, "../characters", path.basename(characterPath)),
            path.resolve(__dirname, "../../characters", path.basename(characterPath)),
        ];

        elizaLogger.info(
            "Trying paths:",
            pathsToTry.map((p) => ({
                path: p,
                exists: fs.existsSync(p),
            }))
        );

        for (const tryPath of pathsToTry) {
            content = tryLoadFile(tryPath);
            if (content !== null) {
                resolvedPath = tryPath;
                break;
            }
        }

        if (content === null) {
            elizaLogger.error(
                `Error loading character from ${characterPath}: File not found in any of the expected locations`
            );
            elizaLogger.error("Tried the following paths:");
            pathsToTry.forEach((p) => elizaLogger.error(` - ${p}`));
            process.exit(1);
        }

        try {
            const character = JSON.parse(content);
            validateCharacterConfig(character);
            loadedCharacters.push(character);
            elizaLogger.info(`Successfully loaded character from: ${resolvedPath}`);
        } catch (error) {
            elizaLogger.error(`Error parsing character from ${resolvedPath}:`, error);
            process.exit(1);
        }
    }

    if (loadedCharacters.length === 0) {
        elizaLogger.info("No characters found, using default character");
        loadedCharacters.push(defaultCharacter);
    }

    return loadedCharacters;
}

/**
 * Main function to start the multi-agent system
 * Enhanced with proper error handling and cleanup
 */
async function main() {
    let orchestrator: AgentOrchestrator | undefined;

    try {
        const args = parseArguments();
        let charactersArg = args.characters || args.character;

        orchestrator = new AgentOrchestrator();
        // Store orchestrator globally for cleanup
        global.orchestrator = orchestrator;

        let characters = [defaultCharacter];
        if (charactersArg) {
            characters = await loadCharacters(charactersArg);
        }

        const agentInstances = await Promise.all(
            characters.map(character => startAgent(character, orchestrator!))
        );

        if (characters.length > 1) {
            elizaLogger.info("Multi-agent mode enabled");
            elizaLogger.info(`${characters.length} agents initialized`);
            elizaLogger.info("Agents:");
            characters.forEach(char => {
                elizaLogger.info(`- ${char.name} (${char.id})`);
            });
        }

        elizaLogger.log("\nMulti-agent chat started. Commands:");
        elizaLogger.log("- @agent_name message: Send to specific agent");
        elizaLogger.log("- @all message: Broadcast to all agents");
        elizaLogger.log("- exit: Quit the application\n");

        if (characters[0].id) {
            chat(characters[0].id, orchestrator);
        } else {
            throw new Error("Primary agent has no ID");
        }
    } catch (error) {
        elizaLogger.error("Error in main:", error);

        // Attempt cleanup if orchestrator exists
        if (orchestrator) {
            await gracefulExit();
        } else {
            process.exit(1);
        }
    }
}

// Handle process termination
rl.on("SIGINT", gracefulExit);
rl.on("SIGTERM", gracefulExit);

// Start the application
main().catch((error) => {
    elizaLogger.error("Unhandled error:", error);
    process.exit(1);
});
