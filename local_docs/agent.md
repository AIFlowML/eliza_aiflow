# Eliza Framework Agent System Documentation

## Overview
The Eliza Framework provides a sophisticated multi-agent system that allows running multiple AI agents concurrently through character configuration files. This document explains the core concepts and orchestration of the agent system.

## Core Architecture

### Runtime Components
1. **AgentRuntime**
   - Main execution environment for agents
   - Handles agent lifecycle and state management
   - Manages communication between agents
   - Coordinates plugin execution

2. **Service Layer**
   - `IBrowserService`: Web interaction capabilities
   - `IImageDescriptionService`: Image analysis and generation
   - `IPdfService`: PDF processing and extraction
   - `ISpeechService`: Voice and audio processing
   - `ITextGenerationService`: Text generation and completion
   - `ITranscriptionService`: Audio transcription
   - `IVideoService`: Video processing

3. **Memory Management**
   - `MemoryManager`: Handles agent memory and state
   - `DatabaseAdapter`: Persistent storage interface
   - Caching system for optimized performance

### Character System

#### Configuration Structure
```json
{
  "name": "agent_name",
  "clients": ["platform1", "platform2"],
  "modelProvider": "provider_name",
  "settings": {
    "secrets": {},
    "voice": {
      "model": "voice_model_name"
    }
  },
  "plugins": [],
  "system": "Core behavior description",
  "bio": ["Background elements"],
  "lore": ["Historical experiences"],
  "knowledge": ["Areas of expertise"],
  "messageExamples": [
    [
      {"user": "user1", "content": {"text": "Question"}},
      {"user": "agent", "content": {"text": "Response"}}
    ]
  ]
}
```

#### Core Interfaces
1. **Actor Interface**
   - Defines agent identity and capabilities
   - Manages relationships with other agents
   - Handles state and memory

2. **Content Interface**
   - Structures message content
   - Supports multiple media types
   - Handles formatting and validation

3. **Goal Interface**
   - Defines agent objectives
   - Tracks progress and status
   - Manages completion criteria

### Plugin Architecture
The framework uses a modular plugin system supporting:

1. **Core Plugins**
   - Blockchain integration (EVM, Solana, Aptos)
   - Image generation and processing
   - Trading and financial operations
   - Custom node operations

2. **Service Plugins**
   - Browser automation
   - PDF processing
   - Speech synthesis
   - Video processing

3. **Custom Plugins**
   - User-defined functionality
   - Extended capabilities
   - Integration with external services

## Multi-Agent Orchestration

### Runtime Flow
1. **Initialization**
   - Load environment configuration
   - Initialize database connections
   - Set up caching system
   - Load character configurations

2. **Agent Loading**
   - Parse character files
   - Validate configurations
   - Initialize plugins
   - Set up communication channels

3. **Execution**
   - Handle inter-agent communication
   - Manage shared resources
   - Process events and messages
   - Update agent states

### State Management
1. **Memory System**
   - Short-term conversation memory
   - Long-term knowledge base
   - Relationship tracking
   - Goal state persistence

2. **Database Integration**
   - PostgreSQL for production
   - SQLite for development
   - Caching layer for performance
   - State persistence across sessions

## Best Practices

### Development Guidelines
1. **Character Creation**
   - Define clear personality traits
   - Provide comprehensive examples
   - Maintain consistent voice
   - Include platform-specific configs

2. **Plugin Development**
   - Follow modular design
   - Implement proper error handling
   - Include comprehensive testing
   - Document API interfaces

3. **Runtime Configuration**
   - Use environment-specific settings
   - Implement proper secret management
   - Configure appropriate logging
   - Set up monitoring

### Deployment
1. **Environment Setup**
   - Configure database connections
   - Set up API keys and secrets
   - Initialize caching system
   - Configure logging

2. **Runtime Configuration**
   - Set appropriate memory limits
   - Configure concurrency settings
   - Set up monitoring
   - Enable error tracking

## Usage Examples

### Basic Setup
```bash
# Single agent
pnpm run start --character="../characters/alpha.character.json"

# Multiple agents
pnpm run start --characters="../characters/agent1.json,../characters/agent2.json"
```

### Advanced Configuration
```typescript
// Custom plugin initialization
const runtime = new AgentRuntime({
  plugins: [customPlugin],
  database: new PostgresDatabaseAdapter(),
  cache: new RedisCacheAdapter()
});

// Start agents
await runtime.start();
```

# Multi-Agent Orchestration in Eliza Framework

## Overview
The Eliza Framework implements a sophisticated multi-agent system where multiple AI agents can run concurrently and interact through various communication channels. This document explains the orchestration and interaction mechanisms.

## Agent Lifecycle

### 1. Initialization Process
```typescript
const startAgents = async () => {
    // Initialize direct client interface for inter-agent communication
    const directClient = await DirectClientInterface.start();

    // Load character configurations
    const characters = await loadCharacters(charactersArg);

    // Start each agent
    for (const character of characters) {
        await startAgent(character, directClient);
    }
}
```

### 2. Agent Creation Flow
1. **Character Loading**
   - Parse character JSON files
   - Validate configurations
   - Initialize character-specific settings

2. **Runtime Setup**
   - Create database connection (PostgreSQL/SQLite)
   - Initialize cache manager
   - Set up model provider tokens
   - Load and configure plugins

3. **Client Interface Setup**
   - Initialize communication channels (Discord, Telegram, etc.)
   - Set up direct client for inter-agent communication
   - Configure plugin-specific clients

## Communication Architecture

### 1. Direct Communication
- Agents communicate through the DirectClientInterface
- Messages are routed through a local server (default port 3000)
- Each agent has a unique identifier for message routing

### 2. Client Interfaces
```typescript
const clients = [
    "auto",      // Automatic client detection
    "discord",   // Discord integration
    "telegram",  // Telegram bot interface
    "twitter",   // Twitter API integration
    "farcaster"  // Farcaster protocol
];
```

### 3. Message Flow
1. **Message Reception**
   - Client receives message from platform
   - Message is validated and formatted
   - Routed to appropriate agent

2. **Processing**
   - Agent processes message using its model
   - Accesses shared memory if needed
   - Executes relevant plugins

3. **Response Distribution**
   - Response generated and formatted
   - Sent through appropriate client interface
   - Logged for monitoring

## State Management

### 1. Shared Resources
- **Database Layer**
  ```typescript
  function initializeDatabase(dataDir: string) {
      if (process.env.POSTGRES_URL) {
          return new PostgresDatabaseAdapter({
              connectionString: process.env.POSTGRES_URL,
              parseInputs: true
          });
      } else {
          return new SqliteDatabaseAdapter(
              new Database(path.resolve(dataDir, "db.sqlite"))
          );
      }
  }
  ```

- **Cache System**
  ```typescript
  function initializeCache(character: Character, db: IDatabaseCacheAdapter) {
      return new CacheManager(
          new DbCacheAdapter(db, character.id)
      );
  }
  ```

### 2. Memory Management
- Short-term conversation memory per agent
- Shared long-term knowledge base
- Relationship tracking between agents
- Goal state persistence

## Plugin Integration

### 1. Core Plugins
```typescript
const corePlugins = [
    bootstrapPlugin,
    nodePlugin,
    solanaPlugin,
    evmPlugin,
    imageGenerationPlugin,
    // ... other core plugins
];
```

### 2. Communication Plugins
- Handle specific platform interactions
- Manage message formatting
- Handle platform-specific features

### 3. Custom Plugins
- User-defined functionality
- Extended capabilities
- Integration with external services

## Best Practices for Multi-Agent Setup

### 1. Configuration
- Use unique names for each agent
- Configure appropriate client interfaces
- Set up proper plugin initialization
- Test interactions between agents

### 2. Resource Management
- Monitor database connections
- Manage cache effectively
- Handle shared resource access
- Implement proper error handling

### 3. Communication Patterns
- Define clear interaction protocols
- Handle message routing properly
- Implement fallback mechanisms
- Monitor communication channels

## Example: Multi-Agent Setup

```typescript
// Initialize multiple agents
const runtime = new AgentRuntime({
    databaseAdapter: db,
    token: process.env.API_TOKEN,
    modelProvider: "anthropic",
    plugins: [
        bootstrapPlugin,
        nodePlugin,
        // ... other plugins
    ],
    cacheManager: cache,
});

// Configure inter-agent communication
const directClient = await DirectClientInterface.start();
directClient.registerAgent(runtime);

// Start agents with different roles
await startAgent(tradingAgent, directClient);
await startAgent(analysisAgent, directClient);
await startAgent(userInterfaceAgent, directClient);
```

## Monitoring and Management

### 1. Logging System
```typescript
elizaLogger.info("Agent status", {
    agentId: character.id,
    status: "active",
    connections: activeConnections
});
```

### 2. Error Handling
- Graceful error recovery
- State persistence
- Connection retry mechanisms
- Resource cleanup

### 3. Performance Monitoring
- Track message latency
- Monitor resource usage
- Log interaction patterns
- Analyze system health

# Communication Architecture in Eliza Framework

## Overview
The Eliza Framework implements a sophisticated communication system that enables agents to interact through multiple channels while maintaining context and state. This section explains the communication mechanisms and provides examples of creating specialized agent crews.

## Communication Layers

### 1. Direct Inter-Agent Communication
```typescript
// DirectClientInterface setup for agent communication
const directClient = await DirectClientInterface.start();

// Register multiple agents with the direct client
directClient.registerAgent(tradingAgent);
directClient.registerAgent(researchAgent);
directClient.registerAgent(userInterfaceAgent);

// Example of direct message passing
await directClient.sendMessage({
    from: "tradingAgent",
    to: "researchAgent",
    content: {
        text: "Analyze market sentiment for BTC",
        metadata: {
            priority: "high",
            timeframe: "4h"
        }
    }
});
```

### 2. Platform-Specific Communication
```typescript
// Initialize multiple client interfaces for an agent
const clients = await initializeClients(character, runtime);

// Example client configuration in character.json
{
    "name": "market_analyst",
    "clients": [
        "telegram",  // For user interactions
        "discord",   // For team communications
        "twitter"    // For market sentiment analysis
    ],
    "clientConfig": {
        "telegram": {
            "botToken": "YOUR_BOT_TOKEN",
            "allowedUsers": ["user1", "user2"]
        },
        "discord": {
            "channelId": "YOUR_CHANNEL_ID",
            "rolePermissions": ["analyst", "trader"]
        }
    }
}
```

### 3. Message Routing System
```typescript
// Message routing configuration
const messageRouter = {
    routes: {
        marketAnalysis: {
            primary: "analysisAgent",
            fallback: "tradingAgent",
            filters: ["sentiment", "technical"]
        },
        trading: {
            primary: "tradingAgent",
            requires: ["analysis", "risk_assessment"]
        },
        userInterface: {
            primary: "uiAgent",
            broadcast: ["status", "alerts"]
        }
    }
};
```

## Creating Specialized Agent Crews

### 1. Trading Crew Example
```typescript
// Trading crew configuration
const tradingCrew = {
    agents: [
        {
            name: "market_analyst",
            character: "./characters/analyst.json",
            plugins: [
                imageGenerationPlugin,  // For chart analysis
                webResearchPlugin      // For market research
            ],
            clients: ["telegram", "discord"]
        },
        {
            name: "trader",
            character: "./characters/trader.json",
            plugins: [
                evmPlugin,             // For blockchain interaction
                tradePlugin,           // For executing trades
                riskManagementPlugin   // For position management
            ],
            clients: ["telegram"]
        },
        {
            name: "risk_manager",
            character: "./characters/risk.json",
            plugins: [
                riskManagementPlugin,
                dataAnalysisPlugin
            ],
            clients: ["discord"]
        }
    ],
    workflow: {
        analysisFlow: [
            "market_analyst",
            "risk_manager",
            "trader"
        ],
        tradingFlow: [
            "trader",
            "risk_manager"
        ]
    }
};

// Initialize trading crew
async function initializeTradingCrew(config) {
    const directClient = await DirectClientInterface.start();

    for (const agent of config.agents) {
        const character = await loadCharacter(agent.character);
        character.plugins = agent.plugins;
        character.clients = agent.clients;

        const runtime = await createAgent(character, db, cache, token);
        await runtime.initialize();

        directClient.registerAgent(runtime);
    }

    return directClient;
}
```

### 2. Research Crew Example
```typescript
// Research crew configuration
const researchCrew = {
    agents: [
        {
            name: "web_researcher",
            character: "./characters/researcher.json",
            plugins: [
                webResearchPlugin,
                pdfProcessingPlugin
            ],
            clients: ["discord"]
        },
        {
            name: "data_analyst",
            character: "./characters/analyst.json",
            plugins: [
                dataAnalysisPlugin,
                visualizationPlugin
            ],
            clients: ["discord", "telegram"]
        },
        {
            name: "report_generator",
            character: "./characters/writer.json",
            plugins: [
                documentGenerationPlugin,
                imageGenerationPlugin
            ],
            clients: ["discord"]
        }
    ],
    workflow: {
        researchFlow: [
            "web_researcher",
            "data_analyst",
            "report_generator"
        ]
    }
};
```

### 3. Customer Service Crew Example
```typescript
// Customer service crew configuration
const supportCrew = {
    agents: [
        {
            name: "front_desk",
            character: "./characters/support_front.json",
            plugins: [
                ticketManagementPlugin,
                customerDbPlugin
            ],
            clients: ["discord", "telegram", "twitter"]
        },
        {
            name: "technical_support",
            character: "./characters/support_tech.json",
            plugins: [
                troubleshootingPlugin,
                documentationPlugin
            ],
            clients: ["discord"]
        },
        {
            name: "customer_satisfaction",
            character: "./characters/support_satisfaction.json",
            plugins: [
                surveyPlugin,
                analyticsPlugin
            ],
            clients: ["telegram"]
        }
    ],
    workflow: {
        ticketFlow: [
            "front_desk",
            "technical_support",
            "customer_satisfaction"
        ]
    }
};
```

## Message Flow Patterns

### 1. Sequential Processing
```typescript
// Example of sequential message processing
async function processTradeAnalysis(message) {
    // 1. Market Analyst processes first
    const analysis = await sendToAgent("market_analyst", message);

    // 2. Risk Manager validates
    const riskAssessment = await sendToAgent("risk_manager", analysis);

    // 3. Trader executes if approved
    if (riskAssessment.approved) {
        return await sendToAgent("trader", riskAssessment);
    }
}
```

### 2. Broadcast Communication
```typescript
// Example of broadcasting messages to multiple agents
async function broadcastMarketAlert(alert) {
    const agents = ["trader", "risk_manager", "market_analyst"];

    await Promise.all(agents.map(agent =>
        directClient.sendMessage({
            to: agent,
            content: {
                type: "market_alert",
                data: alert
            }
        })
    ));
}
```

### 3. State-Based Routing
```typescript
// Example of state-based message routing
async function routeMessage(message, state) {
    switch (state) {
        case "analysis_required":
            return sendToAgent("market_analyst", message);
        case "risk_assessment":
            return sendToAgent("risk_manager", message);
        case "execution":
            return sendToAgent("trader", message);
        default:
            return sendToAgent("front_desk", message);
    }
}
```

## Best Practices for Agent Communication

### 1. Message Structure
```typescript
interface AgentMessage {
    id: string;
    from: string;
    to: string;
    content: {
        text: string;
        type: MessageType;
        metadata: Record<string, any>;
        timestamp: number;
    };
    priority: "low" | "medium" | "high";
    requires_response: boolean;
}
```

### 2. Error Handling
```typescript
async function sendMessageWithRetry(message, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await directClient.sendMessage(message);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await wait(1000 * Math.pow(2, i)); // Exponential backoff
        }
    }
}
```

### 3. Monitoring
```typescript
// Example of communication monitoring
const monitor = {
    trackMessage: (message) => {
        elizaLogger.info("Message tracked", {
            from: message.from,
            to: message.to,
            type: message.content.type,
            timestamp: Date.now()
        });
    },

    getStats: () => {
        return {
            messageCount,
            averageResponseTime,
            errorRate,
            activeConnections
        };
    }
};
```

## Starting a Multi-Agent Crew

```typescript
async function startCrew(crewConfig) {
    // 1. Initialize shared resources
    const db = initializeDatabase(dataDir);
    const cache = initializeCache(db);

    // 2. Start direct client interface
    const directClient = await DirectClientInterface.start();

    // 3. Initialize each agent
    for (const agent of crewConfig.agents) {
        const character = await loadCharacter(agent.character);

        // Add plugins and clients
        character.plugins = agent.plugins;
        character.clients = agent.clients;

        // Create and initialize agent runtime
        const runtime = await createAgent(character, db, cache, token);
        await runtime.initialize();

        // Register with direct client
        directClient.registerAgent(runtime);
    }

    // 4. Set up message routing
    initializeMessageRouting(crewConfig.workflow);

    // 5. Start monitoring
    initializeMonitoring();

    return {
        directClient,
        workflow: crewConfig.workflow,
        stats: monitor.getStats
    };
}

// Usage example
const crew = await startCrew(tradingCrew);
```

This expanded documentation provides detailed examples of how to create and manage different types of agent crews, including trading, research, and customer service teams. Each example includes configuration, initialization, and communication patterns specific to their use cases.

---
*Note: This documentation is continuously updated as we explore and understand more about the Eliza Framework.*

# Agent Communication in Eliza Framework

## Overview
The Eliza Framework uses a local HTTP server-based communication system where agents interact through the DirectClientInterface. Each agent runs as a separate instance and communicates through HTTP endpoints.

## Communication Architecture

### 1. Server-Based Communication
```typescript
// Each agent runs on a local server (default port 3000)
const serverPort = parseInt(settings.SERVER_PORT || "3000");

// Messages are sent via HTTP POST requests
const response = await fetch(
    `http://localhost:${serverPort}/${agentId}/message`,
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            text: input,
            userId: "user",
            userName: "User"
        })
    }
);
```

### 2. Character Configuration
```json
{
    "name": "agent_name",
    "clients": [
        "telegram",
        "discord",
        "twitter"
    ],
    "modelProvider": "anthropic",
    "settings": {
        "secrets": {},
        "server": {
            "port": 3000
        }
    }
}
```

### 3. Agent Registration
```typescript
// Initialize the direct client interface
const directClient = await DirectClientInterface.start();

// Register agents with the direct client
async function startAgent(character: Character, directClient) {
    const runtime = createAgent(character, db, cache, token);
    await runtime.initialize();
    directClient.registerAgent(runtime);
}
```

## Multi-Agent Setup

### 1. Starting Multiple Agents
```typescript
const startAgents = async () => {
    // Initialize the direct client
    const directClient = await DirectClientInterface.start();

    // Load character configurations
    const characters = await loadCharacters(charactersArg);

    // Start each agent
    for (const character of characters) {
        await startAgent(character, directClient);
    }
};
```

### 2. Command Line Usage
```bash
# Start multiple agents
pnpm run start --characters="agent1.json,agent2.json,agent3.json"

# Each agent will run on its own HTTP endpoint:
# - http://localhost:3000/agent1/message
# - http://localhost:3000/agent2/message
# - http://localhost:3000/agent3/message
```

## Client Interfaces

### 1. Available Clients
```typescript
const supportedClients = [
    "auto",      // Automatic client detection
    "discord",   // Discord integration
    "telegram",  // Telegram bot interface
    "twitter",   // Twitter API integration
    "farcaster"  // Farcaster protocol
];
```

### 2. Client Initialization
```typescript
async function initializeClients(character: Character, runtime: IAgentRuntime) {
    const clients = [];
    const clientTypes = character.clients?.map(str => str.toLowerCase()) || [];

    // Initialize each client based on configuration
    if (clientTypes.includes("discord")) {
        clients.push(await DiscordClientInterface.start(runtime));
    }
    if (clientTypes.includes("telegram")) {
        const telegramClient = await TelegramClientInterface.start(runtime);
        if (telegramClient) clients.push(telegramClient);
    }
    // ... other client initializations
}
```

## Creating Agent Crews

When creating agent crews, each agent needs to be configured separately and will communicate through the HTTP server:

### 1. Trading Crew Example
```json
// trader.json
{
    "name": "trader",
    "clients": ["telegram"],
    "modelProvider": "anthropic",
    "plugins": ["tradePlugin", "riskManagementPlugin"],
    "settings": {
        "secrets": {
            "TRADING_API_KEY": "your-key"
        }
    }
}

// analyst.json
{
    "name": "analyst",
    "clients": ["discord"],
    "modelProvider": "anthropic",
    "plugins": ["dataAnalysisPlugin"],
    "settings": {
        "secrets": {
            "DATA_API_KEY": "your-key"
        }
    }
}
```

### 2. Starting the Crew
```bash
pnpm run start --characters="trader.json,analyst.json"
```

## Message Flow

### 1. Direct Messages
```typescript
// Send message to specific agent
await fetch(`http://localhost:3000/analyst/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        text: "Analyze BTC trend",
        userId: "trader",
        userName: "TradingAgent"
    })
});
```

### 2. Response Handling
```typescript
// Handle agent responses
const response = await fetch(`http://localhost:3000/${agentId}/message`);
const data = await response.json();
data.forEach(message => {
    console.log(`${message.from}: ${message.text}`);
});
```

## Best Practices

### 1. Agent Configuration
- Give each agent a unique name
- Configure appropriate client interfaces
- Set up necessary plugins
- Define proper API keys and secrets

### 2. Communication
- Use HTTP endpoints for agent interaction
- Handle message routing through the DirectClientInterface
- Implement proper error handling
- Monitor message flow

### 3. Resource Management
- Monitor server connections
- Handle database connections properly
- Manage shared resources
- Implement proper cleanup

## Example: Complete Multi-Agent Setup

```typescript
// Initialize the system
const startAgentCrew = async () => {
    // 1. Start the direct client interface
    const directClient = await DirectClientInterface.start();

    // 2. Load character configurations
    const characters = await loadCharacters("trader.json,analyst.json");

    // 3. Initialize shared resources
    const db = initializeDatabase(dataDir);
    const cache = initializeCache(db);

    // 4. Start each agent
    for (const character of characters) {
        // Create and initialize agent runtime
        const runtime = await createAgent(character, db, cache, token);
        await runtime.initialize();

        // Initialize clients
        const clients = await initializeClients(character, runtime);

        // Register with direct client
        directClient.registerAgent(runtime);
    }

    return directClient;
};
```

---
*Note: This documentation reflects the actual implementation of agent communication in the Eliza Framework, which uses a local HTTP server for inter-agent messaging.*