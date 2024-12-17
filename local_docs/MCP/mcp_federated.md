Directory Structure:

└── ./
    └── federated-mcp-main
        ├── docs
        │   ├── api.md
        │   ├── architecture.md
        │   ├── development.md
        │   ├── edge_functions.md
        │   ├── implementation.md
        │   ├── intro.md
        │   ├── README.md
        │   └── usage.md
        ├── src
        │   ├── apps
        │   │   └── deno
        │   │       ├── lib
        │   │       │   ├── edge-functions.ts
        │   │       │   ├── edge-providers.ts
        │   │       │   ├── server-status.ts
        │   │       │   └── types.ts
        │   │       └── server.ts
        │   ├── packages
        │   │   ├── core
        │   │   │   ├── auth.ts
        │   │   │   ├── schema.ts
        │   │   │   ├── server.ts
        │   │   │   └── types.ts
        │   │   ├── edge
        │   │   │   ├── tests
        │   │   │   │   ├── intent-detection.test.ts
        │   │   │   │   ├── mcp.test.ts
        │   │   │   │   ├── meeting-info.test.ts
        │   │   │   │   └── webhook-handler.test.ts
        │   │   │   ├── deploy-mcp.ts
        │   │   │   ├── deploy.ts
        │   │   │   ├── intent-detection.ts
        │   │   │   ├── mcp.ts
        │   │   │   ├── meeting-info.ts
        │   │   │   ├── README-SUPABASE.md
        │   │   │   ├── README.md
        │   │   │   ├── server.ts
        │   │   │   ├── supabase-deploy.ts
        │   │   │   ├── types.ts
        │   │   │   └── webhook-handler.ts
        │   │   └── proxy
        │   │       └── federation.ts
        │   ├── schema
        │   │   └── schema.ts
        │   ├── tests
        │   │   ├── federation.test.ts
        │   │   └── workflow.test.ts
        │   ├── worker
        │   │   ├── cloudflare.d.ts
        │   │   ├── cloudflare.ts
        │   │   └── index.ts
        │   ├── Dockerfile
        │   └── jest.config.js
        ├── supa_src
        │   ├── docs
        │   │   ├── api_documentation.md
        │   │   ├── intent_detection_spec.md
        │   │   ├── tutorial.md
        │   │   └── user_guide.md
        │   ├── supabase
        │   │   └── functions
        │   │       ├── intent-detection
        │   │       │   ├── index.ts
        │   │       │   └── test.ts
        │   │       ├── meeting-info
        │   │       │   ├── index.ts
        │   │       │   └── test.ts
        │   │       └── webhook-handler
        │   │           ├── index.ts
        │   │           └── test.ts
        │   ├── ARCHITECTURE.md
        │   ├── commands.md
        │   ├── init-prompt.md
        │   ├── README.md
        │   ├── SPECIFICATION.md
        │   └── start.md
        ├── Dockerfile
        └── README.md



---
File: /federated-mcp-main/docs/api.md
---

# Federated MCP API Reference

## Table of Contents
1. [FederationProxy API](#federationproxy-api)
2. [AuthManager API](#authmanager-api)
3. [Type Definitions](#type-definitions)
4. [Error Handling](#error-handling)

## FederationProxy API

### Class: FederationProxy

The main class for managing federated server connections.

#### Constructor

```typescript
constructor(secret: string)
```

Parameters:
- `secret: string` - The secret key used for JWT token generation and validation

Example:
```typescript
const proxy = new FederationProxy("your-secret-key");
```

#### Method: registerServer

Registers a new server in the federation network.

```typescript
async registerServer(config: FederationConfig): Promise<void>
```

Parameters:
- `config: FederationConfig` - Server configuration object

Example:
```typescript
await proxy.registerServer({
  serverId: "server-1",
  endpoints: {
    control: "ws://localhost:3000",
    data: "http://localhost:3001"
  },
  auth: {
    type: "jwt",
    config: { secret: "your-secret-key" }
  }
});
```

#### Method: removeServer

Removes a server from the federation network.

```typescript
async removeServer(serverId: string): Promise<void>
```

Parameters:
- `serverId: string` - Unique identifier of the server to remove

Example:
```typescript
await proxy.removeServer("server-1");
```

#### Method: getConnectedServers

Returns an array of connected server IDs.

```typescript
getConnectedServers(): string[]
```

Returns:
- `string[]` - Array of server IDs

Example:
```typescript
const servers = proxy.getConnectedServers();
console.log("Connected servers:", servers);
```

## AuthManager API

### Class: AuthManager

Handles authentication and token management.

#### Constructor

```typescript
constructor(secret: string)
```

Parameters:
- `secret: string` - Secret key for token generation and validation

Example:
```typescript
const authManager = new AuthManager("your-secret-key");
```

#### Method: createToken

Creates a JWT token for server authentication.

```typescript
async createToken(payload: Record<string, unknown>): Promise<string>
```

Parameters:
- `payload: Record<string, unknown>` - Token payload data

Returns:
- `Promise<string>` - Generated JWT token

Example:
```typescript
const token = await authManager.createToken({
  serverId: "server-1",
  type: "federation"
});
```

#### Method: verifyToken

Verifies a JWT token.

```typescript
async verifyToken(token: string): Promise<Record<string, unknown>>
```

Parameters:
- `token: string` - JWT token to verify

Returns:
- `Promise<Record<string, unknown>>` - Decoded token payload

Example:
```typescript
const payload = await authManager.verifyToken(token);
```

## Type Definitions

### Interface: FederationConfig

Configuration for a federated server.

```typescript
interface FederationConfig {
  serverId: string;
  endpoints: {
    control: string;
    data: string;
  };
  auth: {
    type: 'jwt' | 'oauth2';
    config: Record<string, unknown>;
  };
}
```

Fields:
- `serverId: string` - Unique identifier for the server
- `endpoints` - Server endpoints
  - `control: string` - WebSocket control endpoint
  - `data: string` - HTTP data endpoint
- `auth` - Authentication configuration
  - `type: 'jwt' | 'oauth2'` - Authentication type
  - `config: Record<string, unknown>` - Authentication-specific configuration

### Interface: MCPCapabilities

Defines server capabilities.

```typescript
interface MCPCapabilities {
  resources: boolean;
  prompts: boolean;
  tools: boolean;
  sampling: boolean;
}
```

### Interface: ServerInfo

Server information structure.

```typescript
interface ServerInfo {
  name: string;
  version: string;
  capabilities: MCPCapabilities;
}
```

## Error Handling

### Connection Errors

The system throws specific errors for various connection scenarios:

```typescript
// Connection timeout error
new Error('Connection timeout')

// Authentication error
new Error('Invalid token')

// Server error
new Error('Server connection failed')
```

### Error Types

1. **ConnectionError**
   - Thrown when WebSocket connection fails
   - Includes connection details and server ID

2. **AuthenticationError**
   - Thrown for authentication failures
   - Includes token validation details

3. **TimeoutError**
   - Thrown when connection or operation timeouts occur
   - Includes timeout duration and operation type

### Error Handling Example

```typescript
try {
  await proxy.registerServer(config);
} catch (error) {
  if (error.message.includes('timeout')) {
    // Handle timeout error
  } else if (error.message.includes('token')) {
    // Handle authentication error
  } else {
    // Handle general error
  }
}
```

## WebSocket Events

### Connection Events

```typescript
ws.onopen = () => {
  // Connection established
}

ws.onclose = () => {
  // Connection closed
}

ws.onerror = (error) => {
  // Connection error
}
```

### Message Events

```typescript
ws.onmessage = (event) => {
  // Handle incoming message
}
```

## Best Practices

1. **Error Handling**
   ```typescript
   try {
     await proxy.registerServer(config);
   } catch (error) {
     console.error('Registration failed:', error);
     // Implement retry logic or fallback
   }
   ```

2. **Connection Management**
   ```typescript
   const servers = proxy.getConnectedServers();
   if (servers.includes(serverId)) {
     await proxy.removeServer(serverId);
   }
   ```

3. **Token Management**
   ```typescript
   const token = await authManager.createToken({
     serverId,
     exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
   });
   ```

## Rate Limiting

The system implements rate limiting for various operations:

```typescript
// Example rate limit configuration
const rateLimits = {
  connections: 100,    // Max concurrent connections
  messages: 1000,      // Messages per minute
  tokens: 100         // Token generations per minute
};
```

## Security Considerations

1. **Token Security**
   - Use strong secrets
   - Implement token expiration
   - Validate token signatures

2. **Connection Security**
   - Use WSS (WebSocket Secure)
   - Implement connection timeouts
   - Validate server certificates

3. **Data Security**
   - Validate message payloads
   - Implement message encryption
   - Use secure protocols



---
File: /federated-mcp-main/docs/architecture.md
---

# Federated MCP Architecture

## System Overview

The Federated MCP (Message Control Protocol) is a distributed system that enables secure communication and coordination between multiple servers in a federated network. It uses WebSocket connections for real-time communication and JWT for authentication.

## Core Components

### 1. Federation Proxy

The Federation Proxy is the central component that manages connections between federated servers. It:
- Maintains WebSocket connections to multiple servers
- Handles authentication and authorization
- Manages server registration and removal
- Monitors connection health

```mermaid
graph TD
    A[Federation Proxy] -->|WebSocket| B[Server 1]
    A -->|WebSocket| C[Server 2]
    A -->|WebSocket| D[Server N]
    A -->|Auth| E[Auth Manager]
```

### 2. Authentication Manager

The Authentication Manager handles security aspects:
- JWT token generation and validation
- Server authentication
- Session management
- Security policy enforcement

### 3. Server Registry

Maintains information about connected servers:
- Server configurations
- Connection states
- Endpoint information
- Authentication details

## Communication Flow

1. **Server Registration**
   ```mermaid
   sequenceDiagram
       Server->>Proxy: Registration Request
       Proxy->>AuthManager: Generate Token
       AuthManager->>Proxy: JWT Token
       Proxy->>Server: Establish WebSocket
       Server->>Proxy: Connection Confirmation
   ```

2. **Message Exchange**
   ```mermaid
   sequenceDiagram
       Server1->>Proxy: Send Message
       Proxy->>AuthManager: Validate Token
       Proxy->>Server2: Forward Message
       Server2->>Proxy: Acknowledgment
       Proxy->>Server1: Confirm Delivery
   ```

## Security Model

### Authentication

- JWT-based authentication
- Token structure:
  ```json
  {
    "serverId": "unique-server-id",
    "type": "federation",
    "iat": 1234567890,
    "exp": 1234567890
  }
  ```

### Connection Security

1. **Transport Layer**
   - Secure WebSocket (WSS) connections
   - TLS/SSL encryption
   - Certificate validation

2. **Application Layer**
   - Token-based authentication
   - Message signing
   - Rate limiting
   - Connection timeouts

## Data Flow

### 1. Control Channel (WebSocket)
- Server registration
- Connection management
- Health checks
- System messages

### 2. Data Channel (HTTP)
- Resource exchange
- Bulk data transfer
- File sharing
- API interactions

## System States

1. **Initialization**
   - Load configuration
   - Initialize components
   - Setup security

2. **Operation**
   - Active connections
   - Message routing
   - Health monitoring

3. **Error Handling**
   - Connection failures
   - Authentication errors
   - System recovery

## Scalability Considerations

### 1. Connection Management
- Connection pooling
- Load balancing
- Resource limits

### 2. Performance
- Message queuing
- Batch processing
- Caching strategies

### 3. Reliability
- Automatic reconnection
- Error recovery
- State persistence

## Implementation Guidelines

1. **Component Isolation**
   - Separate concerns
   - Clear interfaces
   - Modular design

2. **Error Handling**
   - Graceful degradation
   - Detailed logging
   - Recovery procedures

3. **Testing**
   - Unit tests
   - Integration tests
   - Load testing

## Future Considerations

1. **Scalability**
   - Horizontal scaling
   - Clustering support
   - Load distribution

2. **Features**
   - Enhanced security
   - Advanced monitoring
   - Additional protocols

3. **Integration**
   - Third-party systems
   - Additional authentication methods
   - Extended API support

## System Requirements

### Software
- Deno runtime
- WebSocket support
- JWT library

### Hardware
- Network connectivity
- Sufficient memory
- Processing power

### Network
- WebSocket support
- Stable connections
- Proper firewall configuration

## Monitoring and Maintenance

1. **Health Checks**
   - Connection status
   - System metrics
   - Performance monitoring

2. **Logging**
   - Operation logs
   - Error tracking
   - Audit trails

3. **Maintenance**
   - Regular updates
   - Security patches
   - Performance optimization



---
File: /federated-mcp-main/docs/development.md
---

# Federated MCP Development Guide

## Development Environment Setup

### Prerequisites

1. **Install Deno**
   ```bash
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

2. **Configure Environment**
   ```bash
   # Add Deno to PATH
   export DENO_INSTALL="/home/user/.deno"
   export PATH="$DENO_INSTALL/bin:$PATH"
   ```

3. **IDE Setup**
   - Install VS Code
   - Install Deno extension
   - Configure workspace settings:
   ```json
   {
     "deno.enable": true,
     "deno.lint": true,
     "deno.unstable": false
   }
   ```

### Project Structure

```
federated-mcp/
├── apps/
│   └── deno/
│       └── server.ts
├── config/
│   └── default.json
├── docs/
│   ├── README.md
│   ├── architecture.md
│   ├── implementation.md
│   ├── api.md
│   ├── usage.md
│   └── development.md
├── packages/
│   ├── core/
│   │   ├── auth.ts
│   │   ├── server.ts
│   │   └── types.ts
│   └── proxy/
│       └── federation.ts
└── tests/
    └── federation.test.ts
```

## Development Workflow

### 1. Setting Up Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/federated-mcp.git
cd federated-mcp

# Install dependencies (if any)
deno cache deps.ts
```

### 2. Running Tests

```bash
# Run all tests
deno test --allow-net

# Run specific test file
deno test --allow-net tests/federation.test.ts

# Run tests with coverage
deno test --coverage --allow-net
```

### 3. Development Server

```bash
# Run development server
deno run --allow-net apps/deno/server.ts

# Run with watch mode
deno run --watch --allow-net apps/deno/server.ts
```

## Code Style Guide

### 1. TypeScript Guidelines

```typescript
// Use explicit types
function processServer(config: FederationConfig): Promise<void> {
  // Implementation
}

// Use interfaces for complex types
interface ServerOptions {
  timeout: number;
  retries: number;
}

// Use enums for fixed values
enum ConnectionState {
  Connected,
  Disconnected,
  Error
}
```

### 2. Naming Conventions

- Use PascalCase for class names and interfaces
- Use camelCase for variables and functions
- Use UPPER_CASE for constants
- Use descriptive names that indicate purpose

```typescript
// Good examples
class FederationProxy {}
interface ServerConfig {}
const MAX_RETRIES = 3;
function handleConnection() {}

// Bad examples
class proxy {}
interface cfg {}
const max = 3;
function handle() {}
```

### 3. Code Organization

```typescript
// Imports at the top
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

// Constants next
const DEFAULT_TIMEOUT = 5000;

// Interfaces/Types next
interface Options {
  // ...
}

// Class/Function implementations last
class Implementation {
  // ...
}
```

## Testing Guidelines

### 1. Test Structure

```typescript
Deno.test({
  name: "Descriptive test name",
  async fn() {
    // Arrange
    const setup = {};

    // Act
    const result = await someOperation();

    // Assert
    assertEquals(result, expectedValue);
  }
});
```

### 2. Mock Objects

```typescript
// Create mock server for testing
async function createMockServer() {
  return {
    start: () => Promise.resolve(),
    stop: () => Promise.resolve(),
    isRunning: () => true
  };
}
```

### 3. Test Coverage

```bash
# Generate coverage report
deno test --coverage=./coverage --allow-net

# View coverage report
deno coverage ./coverage
```

## Debugging

### 1. Using Debug Logs

```typescript
// Add debug logs
function debugLog(message: string, data?: unknown) {
  if (Deno.env.get("DEBUG")) {
    console.log(`[DEBUG] ${message}`, data);
  }
}
```

### 2. Using VS Code Debugger

1. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Deno",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "deno",
      "runtimeArgs": ["run", "--inspect-brk", "-A", "${file}"],
      "port": 9229
    }
  ]
}
```

## Contributing Guidelines

### 1. Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run tests
5. Submit pull request

### 2. Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

### 3. Code Review Process

1. Automated checks must pass
2. Code review by maintainer
3. Address feedback
4. Final approval
5. Merge

## Release Process

### 1. Version Control

```bash
# Create release branch
git checkout -b release/v1.0.0

# Update version
deno run --allow-write scripts/update-version.ts 1.0.0

# Commit changes
git commit -am "chore: bump version to 1.0.0"
```

### 2. Testing Release

```bash
# Run all tests
deno test --allow-net

# Run integration tests
deno test --allow-net tests/integration/
```

### 3. Documentation

- Update CHANGELOG.md
- Update API documentation
- Review README.md
- Update version numbers

### 4. Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version numbers updated
- [ ] Git tags created
- [ ] Release notes prepared

## Maintenance

### 1. Dependency Updates

```bash
# Update dependencies
deno cache --reload deps.ts
```

### 2. Performance Monitoring

```typescript
// Add performance markers
const start = performance.now();
// ... operation ...
const duration = performance.now() - start;
console.log(`Operation took ${duration}ms`);
```

### 3. Error Monitoring

```typescript
// Implement error tracking
function trackError(error: Error, context?: Record<string, unknown>) {
  console.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    context
  });
  // Implement error reporting service integration
}
```

## Security Guidelines

### 1. Code Security

- Use secure WebSocket connections (WSS)
- Implement proper token validation
- Sanitize inputs
- Use secure configurations

### 2. Development Security

- Keep Deno updated
- Use secure dependencies
- Implement security testing
- Regular security audits

## Performance Optimization

### 1. Code Optimization

```typescript
// Use efficient data structures
const serverMap = new Map<string, ServerConfig>();

// Implement caching
const cache = new Map<string, CacheEntry>();
```

### 2. Resource Management

```typescript
// Implement resource cleanup
function cleanup() {
  // Close connections
  // Clear caches
  // Free resources
}
```

Remember to:
- Profile code regularly
- Monitor memory usage
- Optimize critical paths
- Implement proper error handling



---
File: /federated-mcp-main/docs/edge_functions.md
---

# Edge Functions Guide

## Overview
The system supports deploying serverless edge functions across multiple providers:
- Supabase Edge Functions
- Cloudflare Workers
- Fly.io

## Available Functions

### 1. Intent Detection
Endpoint: `/intent-detection`
- Detects intents in meeting transcripts using AI
- Uses OpenAI GPT-4 for analysis
- Returns structured intent data

### 2. Meeting Info
Endpoint: `/meeting-info`
- Retrieves meeting information and summaries
- Integrates with Fireflies API
- Provides comprehensive meeting data

### 3. Webhook Handler
Endpoint: `/webhook`
- Processes meeting-related webhooks
- Handles event notifications
- Manages asynchronous updates

## Deployment

### Provider Configuration
1. Select provider from menu
2. Configure authentication credentials
3. Deploy functions
4. Monitor status

### Environment Variables
Required variables per provider:
- Supabase:
  - SUPABASE_PROJECT_ID
  - SUPABASE_ACCESS_TOKEN
- Cloudflare:
  - CLOUDFLARE_API_TOKEN
  - CLOUDFLARE_ACCOUNT_ID
- Fly.io:
  - FLY_API_TOKEN
  - FLY_APP_NAME

## Monitoring

### Status Checking
```typescript
// View function status
viewEdgeFunctionStatus();

// View function logs
viewEdgeFunctionLogs();

// List deployed functions
listDeployedFunctions();
```

### Logs
- Real-time log streaming
- Error tracking
- Performance monitoring



---
File: /federated-mcp-main/docs/implementation.md
---

# Federated MCP Implementation Guide

## Core Components Implementation

### 1. Federation Proxy

The Federation Proxy is implemented in `packages/proxy/federation.ts`:

```typescript
export class FederationProxy {
  private servers: Map<string, FederationConfig>;
  private authManager: AuthManager;
  private connections: Map<string, WebSocket>;

  constructor(secret: string) {
    this.servers = new Map();
    this.connections = new Map();
    this.authManager = new AuthManager(secret);
  }

  // ... methods
}
```

Key implementation details:
- Uses Maps to store server configurations and WebSocket connections
- Maintains connection state for each server
- Handles connection lifecycle events
- Implements error handling and recovery

### 2. Authentication Manager

The Authentication Manager is implemented in `packages/core/auth.ts`:

```typescript
export class AuthManager {
  constructor(private readonly secret: string) {}

  async createToken(payload: Record<string, unknown>): Promise<string> {
    return await create({ alg: "HS512", typ: "JWT" }, payload, this.secret);
  }

  async verifyToken(token: string): Promise<Record<string, unknown>> {
    return await verify(token, this.secret, "HS512");
  }
}
```

Features:
- JWT token generation and validation
- HS512 algorithm for enhanced security
- Async token operations
- Error handling for token operations

## Federation Protocol

### 1. Server Registration Process

```typescript
async registerServer(config: FederationConfig): Promise<void> {
  this.servers.set(config.serverId, config);
  await this.establishConnection(config);
}
```

Steps:
1. Store server configuration
2. Generate authentication token
3. Establish WebSocket connection
4. Handle connection events
5. Confirm registration

### 2. Connection Management

```typescript
private async establishConnection(config: FederationConfig): Promise<void> {
  try {
    const token = await this.authManager.createToken({
      serverId: config.serverId,
      type: 'federation'
    });

    const wsUrl = new URL(config.endpoints.control);
    wsUrl.searchParams.set('token', token);

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl.toString());
      // ... connection handling
    });
  } catch (error) {
    // ... error handling
  }
}
```

Features:
- Token-based authentication
- Secure WebSocket connections
- Connection timeout handling
- Error recovery

## Type Definitions

Located in `packages/core/types.ts`:

```typescript
export interface FederationConfig {
  serverId: string;
  endpoints: {
    control: string;
    data: string;
  };
  auth: {
    type: 'jwt' | 'oauth2';
    config: Record<string, unknown>;
  };
}

export interface MCPCapabilities {
  resources: boolean;
  prompts: boolean;
  tools: boolean;
  sampling: boolean;
}

export interface ServerInfo {
  name: string;
  version: string;
  capabilities: MCPCapabilities;
}
```

## Error Handling Implementation

### 1. Connection Errors

```typescript
ws.onerror = (error) => {
  console.error(`Error with server ${config.serverId}:`, error);
  reject(error);
};
```

Error types handled:
- Connection failures
- Authentication errors
- Timeout errors
- Protocol errors

### 2. Recovery Mechanisms

```typescript
ws.onclose = () => {
  console.log(`Disconnected from server ${config.serverId}`);
  this.connections.delete(config.serverId);
};
```

Recovery features:
- Connection cleanup
- Resource release
- State management
- Reconnection logic

## Testing Implementation

Located in `tests/federation.test.ts`:

```typescript
Deno.test({
  name: "Federation Proxy - Server Registration",
  async fn() {
    const mockServer = await setupMockServer();
    try {
      // ... test implementation
    } finally {
      mockServer.close();
    }
  }
});
```

Test coverage:
- Server registration
- Connection management
- Error handling
- Token validation
- Server removal

### Mock Server Implementation

```typescript
async function setupMockServer() {
  const ac = new AbortController();
  const { signal } = ac;

  const handler = async (req: Request): Promise<Response> => {
    if (req.headers.get("upgrade") === "websocket") {
      const { socket, response } = Deno.upgradeWebSocket(req);
      // ... WebSocket handling
      return response;
    }
    return new Response("Not a websocket request", { status: 400 });
  };

  serve(handler, { port: WS_PORT, signal });

  return {
    close: () => {
      ac.abort();
    }
  };
}
```

## Performance Considerations

### 1. Connection Pooling

```typescript
private connections: Map<string, WebSocket>;
```

Benefits:
- Resource reuse
- Connection management
- Performance optimization

### 2. Memory Management

- Proper cleanup of resources
- Efficient data structures
- Garbage collection friendly

### 3. Error Recovery

```typescript
private async establishConnection(config: FederationConfig): Promise<void> {
  try {
    // ... connection logic
  } catch (error) {
    console.error(`Failed to establish connection with ${config.serverId}:`, error);
    throw error;
  }
}
```

Features:
- Graceful error handling
- Resource cleanup
- State recovery
- Logging for debugging

## Security Implementation

### 1. Token Generation

```typescript
async createToken(payload: Record<string, unknown>): Promise<string> {
  return await create({ alg: "HS512", typ: "JWT" }, payload, this.secret);
}
```

Security features:
- Strong hashing algorithm
- Token expiration
- Payload validation
- Secure key handling

### 2. Connection Security

- TLS/SSL for WebSocket connections
- Token validation on connection
- Secure configuration handling
- Error masking for security

## Logging and Monitoring

```typescript
console.log(`Connected to server ${config.serverId}`);
console.error(`Error with server ${config.serverId}:`, error);
```

Features:
- Connection state logging
- Error tracking
- Performance monitoring
- Debug information

## Configuration Management

```typescript
interface FederationConfig {
  serverId: string;
  endpoints: {
    control: string;
    data: string;
  };
  auth: {
    type: 'jwt' | 'oauth2';
    config: Record<string, unknown>;
  };
}
```

Aspects:
- Server configuration
- Authentication settings
- Endpoint management
- Security parameters

## Future Improvements

1. Enhanced Error Handling
   - Retry mechanisms
   - Circuit breakers
   - Rate limiting

2. Advanced Monitoring
   - Metrics collection
   - Performance tracking
   - Health checks

3. Security Enhancements
   - Additional auth methods
   - Rate limiting
   - IP filtering



---
File: /federated-mcp-main/docs/intro.md
---

# AI Federation Network: A Comprehensive Introduction

## Overview

The AI Federation Network is a groundbreaking distributed runtime system that implements the Model Context Protocol (MCP) to create a seamless, interconnected ecosystem of AI services. By leveraging edge computing capabilities and standardized communication protocols, it enables secure and efficient federation of AI resources across organizational boundaries while maintaining context and security.

## Understanding MCP and Federation

### Model Context Protocol (MCP)
The Model Context Protocol serves as the foundation of our system, providing a standardized way for AI systems to maintain context while communicating across different tools and platforms. MCP defines how:
- Context is preserved across system boundaries
- AI models interact with various data sources
- Security and authentication are maintained
- Resources are discovered and utilized

### Federation Architecture
Federation in our system refers to the ability to create a network of interconnected AI services that can:
- Share resources while maintaining isolation
- Preserve context across organizational boundaries
- Scale horizontally across different providers
- Maintain security and access controls
- Enable seamless integration of new services

## Key Benefits

1. **Enhanced Interoperability**
   - Standardized communication between AI systems
   - Seamless integration with existing tools
   - Cross-platform compatibility
   - Unified access to diverse AI capabilities

2. **Improved Security**
   - Token-based authentication
   - Granular access controls
   - Encrypted communications
   - Audit trails and monitoring

3. **Scalability**
   - Distributed architecture
   - Edge computing support
   - Load balancing
   - Resource optimization

4. **Maintainability**
   - Modular design
   - Standardized interfaces
   - Clear separation of concerns
   - Easy updates and modifications

## Core Features

### Edge Computing Integration
The system leverages edge computing through multiple providers:
- Supabase Edge Functions
- Cloudflare Workers
- Fly.io Distributed Computing
- Custom edge deployments

### Protocol Support
Multiple network protocols are supported:
- JSON-RPC for structured communication
- WebSocket for real-time updates
- HTTP/REST for standard web integration
- Custom protocol extensions

### AI Model Integration
Support for various AI models:
- Ai integration
- Custom model support
- Model-agnostic interfaces
- Extensible model architecture

## Usage Guide

### Basic Setup
```bash
# Install dependencies
./install.sh

# Start the server
./start.sh
```

### Advanced Configuration
The system can be customized through:
- Environment variables
- Configuration files
- Runtime parameters
- Plugin architecture

### Docker Integration
```bash
# Build the container
docker build -t ai-federation .

# Run with Docker
USE_DOCKER=true ./start.sh
```

## Advanced Usage

### Custom Edge Functions
The system allows deployment of custom edge functions:
1. Create function implementation
2. Configure provider settings
3. Deploy using built-in tools
4. Monitor and manage through dashboard

### Federation Management
Advanced federation features include:
- Cross-organization resource sharing
- Distributed computation
- Context preservation
- Security policy management

### Performance Optimization
The system provides tools for:
- Load balancing
- Resource allocation
- Cache management
- Network optimization

## Customization

### Plugin Development
The system supports custom plugins for:
- New AI models
- Additional protocols
- Custom security measures
- Specialized features

### Provider Integration
Add support for new edge computing providers:
- Implement provider interface
- Configure authentication
- Set up deployment
- Enable monitoring

## Future of AI Federation

### Emerging Trends
The AI Federation Network is positioned to address:
- Increased demand for distributed AI
- Growing need for standardization
- Enhanced security requirements
- Cross-organizational collaboration

### Roadmap
Future development plans include:
1. Enhanced model support
2. Additional provider integration
3. Improved security features
4. Advanced monitoring tools

### Community and Ecosystem
The project aims to foster:
- Open source collaboration
- Standard development
- Best practices
- Knowledge sharing

## Conclusion

The AI Federation Network represents a significant step forward in creating a standardized, secure, and efficient way to connect AI services across organizational boundaries. By implementing the Model Context Protocol and leveraging edge computing capabilities, it provides a robust foundation for the future of distributed AI systems.

Through its modular design, extensive customization options, and focus on security and scalability, the system offers a comprehensive solution for organizations looking to implement federated AI services. As the AI landscape continues to evolve, the AI Federation Network will adapt and grow to meet new challenges and requirements, maintaining its position as a crucial tool for modern AI infrastructure.

The combination of standardized protocols, edge computing capabilities, and robust security features makes this system an ideal choice for organizations looking to implement sophisticated AI solutions while maintaining control over their data and resources. As we move forward, the system will continue to evolve, incorporating new technologies and addressing emerging needs in the AI landscape.



---
File: /federated-mcp-main/docs/README.md
---

# Federated MCP Documentation

Welcome to the Federated MCP documentation. This documentation provides comprehensive information about the Federated MCP system, its architecture, implementation details, API references, usage guidelines, and development instructions.

## Table of Contents

1. [Architecture](./architecture.md)
   - System Overview
   - Components
   - Communication Flow
   - Security Model

2. [Implementation](./implementation.md)
   - Core Components
   - Federation Protocol
   - Authentication
   - WebSocket Communication
   - Error Handling

3. [API Reference](./api.md)
   - Federation Proxy API
   - Authentication API
   - Server Configuration
   - Type Definitions

4. [Usage Guide](./usage.md)
   - Getting Started
   - Configuration
   - Server Registration
   - Connection Management
   - Best Practices

5. [Development Guide](./development.md)
   - Setup Development Environment
   - Running Tests
   - Contributing Guidelines
   - Code Style
   - Release Process

6. [Edge Functions](./edge_functions.md)
   - Available Functions
   - Provider Configuration
   - Deployment Guide
   - Monitoring & Logs

## Quick Start

```typescript
import { FederationProxy } from "../packages/proxy/federation.ts";

// Initialize the federation proxy with a secret key
const proxy = new FederationProxy("your-secret-key");

// Configure a server
const config = {
  serverId: "server-1",
  endpoints: {
    control: "ws://localhost:3000",
    data: "http://localhost:3001"
  },
  auth: {
    type: "jwt",
    config: { secret: "your-secret-key" }
  }
};

// Register the server
await proxy.registerServer(config);

// Get connected servers
const servers = proxy.getConnectedServers();
console.log("Connected servers:", servers);
```

## System Requirements

- Deno 1.x or higher
- Secure WebSocket support
- JWT authentication capabilities

## Support

For issues, feature requests, or contributions, please:
1. Check the existing documentation
2. Review the [Development Guide](./development.md)
3. Submit issues through the project's issue tracker

## License

This project is licensed under the terms specified in the project's LICENSE file.



---
File: /federated-mcp-main/docs/usage.md
---

# Federated MCP Usage Guide

## Getting Started

### Installation

1. Ensure Deno is installed:
```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

2. Import the required modules:
```typescript
import { FederationProxy } from "../packages/proxy/federation.ts";
import { FederationConfig } from "../packages/core/types.ts";
```

### Basic Setup

1. Create a Federation Proxy instance:
```typescript
const SECRET_KEY = "your-secure-secret-key";
const proxy = new FederationProxy(SECRET_KEY);
```

2. Configure a server:
```typescript
const serverConfig: FederationConfig = {
  serverId: "server-1",
  endpoints: {
    control: "ws://localhost:3000",
    data: "http://localhost:3001"
  },
  auth: {
    type: "jwt",
    config: { secret: SECRET_KEY }
  }
};
```

3. Register the server:
```typescript
try {
  await proxy.registerServer(serverConfig);
  console.log("Server registered successfully");
} catch (error) {
  console.error("Registration failed:", error);
}
```

## Common Use Cases

### 1. Managing Multiple Servers

```typescript
// Register multiple servers
const servers = [
  {
    serverId: "server-1",
    endpoints: {
      control: "ws://localhost:3000",
      data: "http://localhost:3001"
    }
  },
  {
    serverId: "server-2",
    endpoints: {
      control: "ws://localhost:3002",
      data: "http://localhost:3003"
    }
  }
];

for (const server of servers) {
  const config: FederationConfig = {
    ...server,
    auth: {
      type: "jwt",
      config: { secret: SECRET_KEY }
    }
  };

  try {
    await proxy.registerServer(config);
    console.log(`${server.serverId} registered successfully`);
  } catch (error) {
    console.error(`Failed to register ${server.serverId}:`, error);
  }
}
```

### 2. Server Health Monitoring

```typescript
// Check connected servers periodically
setInterval(() => {
  const connectedServers = proxy.getConnectedServers();
  console.log("Connected servers:", connectedServers);

  // Implement health checks
  for (const serverId of connectedServers) {
    checkServerHealth(serverId);
  }
}, 60000); // Check every minute
```

### 3. Error Recovery

```typescript
async function registerWithRetry(config: FederationConfig, maxRetries = 3) {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      await proxy.registerServer(config);
      console.log(`${config.serverId} registered successfully`);
      return;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed:`, error);

      if (attempts === maxRetries) {
        throw new Error(`Failed to register after ${maxRetries} attempts`);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }
}
```

## Best Practices

### 1. Security

#### Secure Secret Management
```typescript
// Load secret from environment variable
const SECRET_KEY = Deno.env.get("MCP_SECRET_KEY");
if (!SECRET_KEY) {
  throw new Error("MCP_SECRET_KEY environment variable not set");
}
```

#### Token Validation
```typescript
import { AuthManager } from "../packages/core/auth.ts";

const authManager = new AuthManager(SECRET_KEY);

// Validate incoming tokens
async function validateToken(token: string) {
  try {
    const payload = await authManager.verifyToken(token);
    return payload;
  } catch (error) {
    console.error("Token validation failed:", error);
    return null;
  }
}
```

### 2. Connection Management

#### Graceful Shutdown
```typescript
// Handle process termination
async function shutdown() {
  const servers = proxy.getConnectedServers();

  for (const serverId of servers) {
    try {
      await proxy.removeServer(serverId);
      console.log(`${serverId} disconnected successfully`);
    } catch (error) {
      console.error(`Failed to disconnect ${serverId}:`, error);
    }
  }
}

// Handle termination signals
Deno.addSignalListener("SIGINT", shutdown);
Deno.addSignalListener("SIGTERM", shutdown);
```

#### Connection Monitoring
```typescript
function monitorConnections() {
  const servers = proxy.getConnectedServers();

  console.log(`Active connections: ${servers.length}`);
  console.log("Connected servers:", servers);

  // Implement additional monitoring logic
}

// Monitor connections periodically
setInterval(monitorConnections, 30000);
```

### 3. Error Handling

#### Comprehensive Error Handling
```typescript
async function handleServerOperation(operation: () => Promise<void>) {
  try {
    await operation();
  } catch (error) {
    if (error instanceof WebSocket.Error) {
      console.error("WebSocket error:", error);
      // Handle WebSocket specific errors
    } else if (error.message.includes("timeout")) {
      console.error("Operation timed out:", error);
      // Handle timeout errors
    } else {
      console.error("Unknown error:", error);
      // Handle other errors
    }
  }
}
```

## Configuration Examples

### 1. Development Configuration
```typescript
const devConfig: FederationConfig = {
  serverId: "dev-server",
  endpoints: {
    control: "ws://localhost:3000",
    data: "http://localhost:3001"
  },
  auth: {
    type: "jwt",
    config: {
      secret: "dev-secret",
      expiresIn: "1h"
    }
  }
};
```

### 2. Production Configuration
```typescript
const prodConfig: FederationConfig = {
  serverId: "prod-server",
  endpoints: {
    control: "wss://production.example.com/ws",
    data: "https://production.example.com/api"
  },
  auth: {
    type: "jwt",
    config: {
      secret: Deno.env.get("PROD_SECRET"),
      expiresIn: "24h"
    }
  }
};
```

## Testing

### 1. Connection Testing
```typescript
async function testConnection(config: FederationConfig) {
  try {
    await proxy.registerServer(config);
    const servers = proxy.getConnectedServers();
    console.assert(servers.includes(config.serverId), "Server not connected");
    await proxy.removeServer(config.serverId);
  } catch (error) {
    console.error("Connection test failed:", error);
  }
}
```

### 2. Load Testing
```typescript
async function loadTest(numConnections: number) {
  const results = [];

  for (let i = 0; i < numConnections; i++) {
    const config: FederationConfig = {
      serverId: `test-server-${i}`,
      endpoints: {
        control: `ws://localhost:${3000 + i}`,
        data: `http://localhost:${4000 + i}`
      },
      auth: {
        type: "jwt",
        config: { secret: SECRET_KEY }
      }
    };

    results.push(proxy.registerServer(config));
  }

  await Promise.allSettled(results);
}
```

## Troubleshooting

### Common Issues and Solutions

1. **Connection Failures**
   ```typescript
   // Check if server is reachable
   async function checkServerAvailability(url: string) {
     try {
       const response = await fetch(url);
       return response.ok;
     } catch {
       return false;
     }
   }
   ```

2. **Authentication Issues**
   ```typescript
   // Verify token is valid
   async function verifyAuthentication(config: FederationConfig) {
     const authManager = new AuthManager(config.auth.config.secret as string);
     try {
       const token = await authManager.createToken({ test: true });
       await authManager.verifyToken(token);
       return true;
     } catch {
       return false;
     }
   }
   ```

3. **Performance Issues**
   ```typescript
   // Monitor connection latency
   async function checkLatency(serverId: string) {
     const start = Date.now();
     await proxy.removeServer(serverId);
     await proxy.registerServer(config);
     return Date.now() - start;
   }
   ```

## Maintenance

### Regular Maintenance Tasks

1. **Connection Cleanup**
   ```typescript
   async function cleanupConnections() {
     const servers = proxy.getConnectedServers();
     for (const serverId of servers) {
       // Implement cleanup logic
       await proxy.removeServer(serverId);
     }
   }
   ```

2. **Health Checks**
   ```typescript
   async function performHealthCheck() {
     const servers = proxy.getConnectedServers();
     const results = new Map();

     for (const serverId of servers) {
       // Implement health check logic
       results.set(serverId, "healthy");
     }

     return results;
   }
   ```

Remember to regularly:
- Monitor system performance
- Update security configurations
- Perform connection maintenance
- Review error logs
- Test recovery procedures



---
File: /federated-mcp-main/src/apps/deno/lib/edge-functions.ts
---

/// <reference lib="deno.ns" />

import { stats } from "./types.ts";
import { SupabaseDeployer } from "../../../packages/edge/supabase-deploy.ts";

const supabaseDeployer = new SupabaseDeployer();

export async function toggleEdgeFunctions(enable: boolean) {
  console.log(`\n\x1b[38;5;117m⚡ ${enable ? 'Activating' : 'Deactivating'} edge computing system...\x1b[0m`);

  stats.edgeFunctionsEnabled = enable;
  if (!enable) {
    stats.activeEdgeFunctions = [];
    stats.deployedUrls = {};
    console.log('\x1b[38;5;209m↳ All edge functions terminated\x1b[0m');
  }
}

export async function viewEdgeFunctionStatus() {
  console.log('\n\x1b[38;5;51m▀▀▀ EDGE FUNCTION STATUS ▀▀▀\x1b[0m');
  if (stats.edgeFunctionsEnabled) {
    if (stats.activeEdgeFunctions.length === 0) {
      console.log('\x1b[38;5;209m! No active functions detected\x1b[0m');
    } else {
      stats.activeEdgeFunctions.forEach(func => {
        console.log(`\x1b[38;5;82m✓ ${func} [RUNNING]\x1b[0m`);
        if (stats.deployedUrls[func]) {
          console.log(`  \x1b[38;5;245m↳ Endpoint: \x1b[38;5;117m${stats.deployedUrls[func]}\x1b[0m`);
        }
      });
    }
  } else {
    console.log('\x1b[38;5;196m✗ Edge computing system offline\x1b[0m');
  }
}

export async function viewEdgeFunctionLogs() {
  console.log('\n\x1b[38;5;51m▀▀▀ SYSTEM LOGS ▀▀▀\x1b[0m');
  if (stats.edgeFunctionsEnabled && stats.activeEdgeFunctions.length > 0) {
    if (stats.selectedProvider === 'supabase') {
      for (const func of stats.activeEdgeFunctions) {
        console.log(`\n\x1b[38;5;117m⚡ ${func} Logs:\x1b[0m`);
        try {
          const logs = await supabaseDeployer.getFunctionLogs(func);
          if (logs.length === 0) {
            console.log('\x1b[38;5;245m  No log entries found\x1b[0m');
          } else {
            logs.forEach(log => {
              const timestamp = new Date().toISOString();
              console.log(`\x1b[38;5;245m[${timestamp}]\x1b[0m ${log}`);
            });
          }
        } catch (error) {
          console.log(`\x1b[38;5;196m  ✗ Error retrieving logs: ${error.message}\x1b[0m`);
        }
      }
    } else {
      console.log('\x1b[38;5;196m✗ Log access not supported for current provider\x1b[0m');
    }
  } else {
    console.log('\x1b[38;5;196m✗ No active functions to monitor\x1b[0m');
  }
}



---
File: /federated-mcp-main/src/apps/deno/lib/edge-providers.ts
---

/// <reference lib="deno.ns" />

import { stats, edgeProviders } from "./types.ts";
import { toggleEdgeFunctions } from "./edge-functions.ts";

async function promptForCredentials(provider: string): Promise<Record<string, string>> {
  const credentials: Record<string, string> = {};
  const providerConfig = edgeProviders[provider];

  console.log(`\n\x1b[38;5;51m▀▀▀ CLOUD PROVIDER AUTHENTICATION ▀▀▀\x1b[0m`);
  console.log(`\x1b[38;5;117mInitiating secure connection to ${providerConfig.name}...\x1b[0m`);

  for (const envVar of providerConfig.requiredEnvVars) {
    const input = prompt(`\x1b[38;5;251m${envVar.name}\x1b[0m (\x1b[38;5;245m${envVar.description}\x1b[0m): `);
    if (!input) {
      throw new Error('Authentication sequence aborted');
    }
    credentials[envVar.name] = input;
  }

  return credentials;
}

async function saveCredentials(credentials: Record<string, string>): Promise<void> {
  const envPath = '../../.env';

  try {
    console.log('\n\x1b[38;5;117m⚡ Initializing secure storage...\x1b[0m');

    // Read existing .env content
    let envContent = '';
    try {
      envContent = await Deno.readTextFile(envPath);
      console.log('\x1b[38;5;245m↳ Existing configuration detected\x1b[0m');
    } catch {
      console.log('\x1b[38;5;245m↳ No existing configuration found\x1b[0m');
    }

    // Parse existing variables
    const envVars = new Map();
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        envVars.set(match[1], match[2]);
      }
    });

    // Update with new credentials
    console.log('\x1b[38;5;117m⚡ Encrypting credentials...\x1b[0m');
    Object.entries(credentials).forEach(([key, value]) => {
      envVars.set(key, value);
      console.log(`\x1b[38;5;245m↳ Secured ${key}\x1b[0m`);
    });

    // Build new .env content
    const newContent = Array.from(envVars.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('\n') + '\n';

    // Write back to .env
    console.log('\x1b[38;5;117m⚡ Committing to secure storage...\x1b[0m');
    await Deno.writeTextFile(envPath, newContent);
    console.log('\n\x1b[38;5;82m✓ Authentication data secured\x1b[0m');

    // Set environment variables for current process
    Object.entries(credentials).forEach(([key, value]) => {
      Deno.env.set(key, value);
    });

  } catch (error) {
    console.error('\n\x1b[38;5;196m✗ Security violation:', error.message, '\x1b[0m');
    throw error;
  }
}

export async function checkEdgeProviders() {
  console.log('\n\x1b[38;5;51m▀▀▀ EDGE PROVIDER STATUS ▀▀▀\x1b[0m');
  for (const [name, provider] of Object.entries(edgeProviders)) {
    if (provider.isConfigured()) {
      console.log(`\x1b[38;5;82m✓ ${provider.name} [AUTHENTICATED]\x1b[0m`);
    } else {
      console.log(`\x1b[38;5;209m! ${provider.name} [REQUIRES AUTH]\x1b[0m`);
      console.log('\x1b[38;5;245mRequired credentials:\x1b[0m');
      provider.requiredEnvVars.forEach(v => {
        console.log(`  \x1b[38;5;251m${v.name}\x1b[0m: ${v.description}`);
      });
    }
  }
}

export async function configureProvider() {
  console.log('\n\x1b[38;5;51m▀▀▀ CLOUD PROVIDER SELECTION ▀▀▀\x1b[0m');
  console.log('\x1b[38;5;239m┌─────────────────────────┐\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 1. Supabase              \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 2. Cloudflare Workers    \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 3. Fly.io                \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 4. Cancel                \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m└─────────────────────────┘\x1b[0m');

  const choice = prompt('\n\x1b[38;5;51m▶ Select provider [1-4]:\x1b[0m ');

  let provider: string;
  switch (choice) {
    case '1':
      provider = 'supabase';
      break;
    case '2':
      provider = 'cloudflare';
      break;
    case '3':
      provider = 'flyio';
      break;
    default:
      return;
  }

  const selectedProvider = edgeProviders[provider];
  if (!selectedProvider) {
    console.log('\n\x1b[38;5;196m✗ Invalid provider selection\x1b[0m');
    return;
  }

  try {
    // Prompt for and save credentials
    const credentials = await promptForCredentials(provider);
    await saveCredentials(credentials);

    // Verify configuration
    if (selectedProvider.isConfigured()) {
      console.log(`\n\x1b[38;5;82m✓ ${selectedProvider.name} authentication successful\x1b[0m`);
      stats.selectedProvider = provider;
      await toggleEdgeFunctions(true);
      console.log('\n\x1b[38;5;82m✓ Edge computing system online\x1b[0m');
    } else {
      console.log(`\n\x1b[38;5;196m✗ Authentication verification failed\x1b[0m`);
    }
  } catch (error) {
    if (error.message !== 'Authentication sequence aborted') {
      console.error('\n\x1b[38;5;196m✗ Authentication failed:', error.message, '\x1b[0m');
    }
  }
}



---
File: /federated-mcp-main/src/apps/deno/lib/server-status.ts
---

import { serverInfo, stats } from "./types.ts";

const ASCII_LOGO = `
╔════════════════════════════════════════════════════════════╗
║    ___    ____   ______ ____ ___  _______________          ║
║   /   |  /  _/  / ____// __// _ \\/ ___/ __/ __/            ║
║  / /| |  / /   / /_   / _/ / // / /__/ _// _/              ║
║ / ___ |_/ /   / __/  / ___/ // / ___/ __/ __/              ║
║/_/  |_/___/  /_/    /_/  /___/_/  /_/ /_/                  ║
║                                                            ║
║                 AI FEDERATION NETWORK                      ║
║              Distributed Runtime System                    ║
╚════════════════════════════════════════════════════════════╝
`;

const PROCESS_SPINNER = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃', '▂'];
let spinnerInterval: number | undefined;

function startProcessMonitor(message: string) {
  let i = 0;
  console.log(''); // Add spacing
  spinnerInterval = setInterval(() => {
    console.log(`\r${PROCESS_SPINNER[i]} ${message}`);
    i = (i + 1) % PROCESS_SPINNER.length;
  }, 80);
}

function stopProcessMonitor() {
  if (spinnerInterval) {
    clearInterval(spinnerInterval);
    console.log('\r'); // Clear spinner line
  }
}

export function displayServerStatus() {
  console.clear(); // Clear the terminal for fresh display

  // Display Federation Logo
  console.log('\x1b[36m%s\x1b[0m', ASCII_LOGO);

  // Runtime Status
  console.log('\n\x1b[38;5;51m▀▀▀ RUNTIME STATUS ▀▀▀\x1b[0m');
  console.log(`⚡ Instance: \x1b[38;5;87m${serverInfo.name} [v${serverInfo.version}]\x1b[0m`);
  console.log(`🔌 Active Connections: \x1b[38;5;147m${stats.connections}\x1b[0m`);

  // Edge Computing Status
  console.log('\n\x1b[38;5;51m▀▀▀ EDGE COMPUTING STATUS ▀▀▀\x1b[0m');
  if (stats.edgeFunctionsEnabled) {
    console.log('⚛️  Service Status: \x1b[38;5;82mONLINE\x1b[0m');
    if (stats.selectedProvider) {
      console.log(`🌐 Cloud Provider: \x1b[38;5;117m${stats.selectedProvider}\x1b[0m`);
    }
    if (stats.activeEdgeFunctions.length > 0) {
      console.log('📡 Active Functions:');
      stats.activeEdgeFunctions.forEach(func => {
        console.log(`   ∟ \x1b[38;5;82m${func}\x1b[0m`);
        if (stats.deployedUrls[func]) {
          console.log(`     ⮡ \x1b[38;5;45m${stats.deployedUrls[func]}\x1b[0m`);
        }
      });
    }
  } else {
    console.log('💠 Service Status: \x1b[38;5;209mOFFLINE\x1b[0m');
  }

  // System Capabilities
  console.log('\n\x1b[38;5;51m▀▀▀ SYSTEM CAPABILITIES ▀▀▀\x1b[0m');
  if (serverInfo.capabilities.models?.length) {
    console.log('🤖 ML Models:', serverInfo.capabilities.models.map(m => `\x1b[38;5;117m${m}\x1b[0m`).join(', '));
  }
  if (serverInfo.capabilities.protocols?.length) {
    console.log('🌐 Network Protocols:', serverInfo.capabilities.protocols.map(p => `\x1b[38;5;117m${p}\x1b[0m`).join(', '));
  }
  if (serverInfo.capabilities.features?.length) {
    console.log('⚙️  Runtime Features:', serverInfo.capabilities.features.map(f => `\x1b[38;5;117m${f}\x1b[0m`).join(', '));
  }

  // Command Interface
  console.log('\n\x1b[38;5;51m▀▀▀ SYSTEM CONTROLS ▀▀▀\x1b[0m');
  console.log('\x1b[38;5;239m┌───────────────────────────────────────┐\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 1️⃣  Monitor Network Connections        \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 2️⃣  View System Information            \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 3️⃣  List Runtime Capabilities          \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 4️⃣  Configure Cloud Provider           \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 5️⃣  Deploy Edge Function               \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 6️⃣  Check Edge Function Status         \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 7️⃣  View System Logs                   \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 8️⃣  List Deployed Functions            \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m│\x1b[0m 9️⃣  Show Command Interface             \x1b[38;5;239m│\x1b[0m');
  console.log('\x1b[38;5;239m└───────────────────────────────────────┘\x1b[0m');

  console.log('\n\x1b[38;5;51m▶ Enter command [1-9]:\x1b[0m');
}



---
File: /federated-mcp-main/src/apps/deno/lib/types.ts
---

/// <reference lib="deno.ns" />

import { ServerInfo } from "../../../packages/core/types.ts";

export interface ServerStats {
  connections: number;
  edgeFunctionsEnabled: boolean;
  activeEdgeFunctions: string[];
  deployedUrls: Record<string, string>;
  selectedProvider?: string;
  lastDeployment?: string;
}

export interface EdgeProviderConfig {
  name: string;
  requiredEnvVars: { name: string; description: string }[];
  isConfigured: () => boolean;
}

export const serverInfo: ServerInfo = {
  name: "deno-mcp-server",
  version: "1.0.0",
  capabilities: {
    models: ["gpt-3.5-turbo", "gpt-4"],
    protocols: ["json-rpc", "http", "websocket"],
    features: [
      "task-execution",
      "federation",
      "intent-detection",
      "meeting-info",
      "webhook-handler"
    ]
  }
};

export const stats: ServerStats = {
  connections: 0,
  edgeFunctionsEnabled: false,
  activeEdgeFunctions: [],
  deployedUrls: {},
  selectedProvider: undefined
};

export const edgeProviders: Record<string, EdgeProviderConfig> = {
  supabase: {
    name: "Supabase",
    requiredEnvVars: [
      { name: "SUPABASE_PROJECT_ID", description: "Your Supabase project ID" },
      { name: "SUPABASE_ACCESS_TOKEN", description: "Your Supabase access token" }
    ],
    isConfigured: () => !!Deno.env.get("SUPABASE_PROJECT_ID") && !!Deno.env.get("SUPABASE_ACCESS_TOKEN")
  },
  cloudflare: {
    name: "Cloudflare Workers",
    requiredEnvVars: [
      { name: "CLOUDFLARE_API_TOKEN", description: "Your Cloudflare API token" },
      { name: "CLOUDFLARE_ACCOUNT_ID", description: "Your Cloudflare account ID" }
    ],
    isConfigured: () => !!Deno.env.get("CLOUDFLARE_API_TOKEN") && !!Deno.env.get("CLOUDFLARE_ACCOUNT_ID")
  },
  flyio: {
    name: "Fly.io",
    requiredEnvVars: [
      { name: "FLY_API_TOKEN", description: "Your Fly.io API token" },
      { name: "FLY_APP_NAME", description: "Your Fly.io application name" }
    ],
    isConfigured: () => !!Deno.env.get("FLY_API_TOKEN") && !!Deno.env.get("FLY_APP_NAME")
  }
};



---
File: /federated-mcp-main/src/apps/deno/server.ts
---

/// <reference lib="deno.ns" />

import { MCPServer } from "../../packages/core/server.ts";
import { ServerInfo } from "../../packages/core/types.ts";
import { SupabaseDeployer } from "../../packages/edge/supabase-deploy.ts";
import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";
import {
  serverInfo,
  stats,
  edgeProviders
} from "./lib/types.ts";
import {
  checkEdgeProviders,
  configureProvider
} from "./lib/edge-providers.ts";
import {
  toggleEdgeFunctions,
  viewEdgeFunctionStatus,
  viewEdgeFunctionLogs
} from "./lib/edge-functions.ts";
import { displayServerStatus } from "./lib/server-status.ts";

const server = new MCPServer(serverInfo);
const supabaseDeployer = new SupabaseDeployer();

function formatJSON(obj: any, indent = 0): string {
  const spaces = '  '.repeat(indent);
  const nextSpaces = '  '.repeat(indent + 1);
  const colors = {
    key: '\x1b[38;5;51m',     // Cyan for keys
    string: '\x1b[38;5;87m',  // Light cyan for strings
    number: '\x1b[38;5;207m', // Pink for numbers
    boolean: '\x1b[38;5;219m',// Light pink for booleans
    null: '\x1b[38;5;243m',   // Dark gray for null
    bracket: '\x1b[38;5;39m', // Blue for brackets
    comma: '\x1b[38;5;45m',   // Bright cyan for commas
    reset: '\x1b[0m'
  };

  if (Array.isArray(obj)) {
    if (obj.length === 0) return `${colors.bracket}[]${colors.reset}`;
    const items = obj.map((item, index) => {
      const comma = index < obj.length - 1 ? `${colors.comma},${colors.reset}` : '';
      if (typeof item === 'string') {
        return `${nextSpaces}${colors.string}"${item}"${colors.reset}${comma}`;
      }
      return `${formatJSON(item, indent + 1)}${comma}`;
    }).join('\n');
    return `${colors.bracket}[\n${colors.reset}${items}\n${spaces}${colors.bracket}]${colors.reset}`;
  }

  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj);
    if (entries.length === 0) return `${colors.bracket}{}${colors.reset}`;
    const formattedEntries = entries.map(([key, value], index) => {
      const comma = index < entries.length - 1 ? `${colors.comma},${colors.reset}` : '';
      let formattedValue;
      switch (typeof value) {
        case 'string':
          formattedValue = `${colors.string}"${value}"${colors.reset}`;
          break;
        case 'number':
          formattedValue = `${colors.number}${value}${colors.reset}`;
          break;
        case 'boolean':
          formattedValue = `${colors.boolean}${value}${colors.reset}`;
          break;
        case 'object':
          if (value === null) {
            formattedValue = `${colors.null}null${colors.reset}`;
          } else {
            formattedValue = formatJSON(value, indent + 1);
          }
          break;
        default:
          formattedValue = String(value);
      }
      return `${nextSpaces}${colors.key}"${key}"${colors.reset}: ${formattedValue}${comma}`;
    }).join('\n');
    return `${colors.bracket}{\n${colors.reset}${formattedEntries}\n${spaces}${colors.bracket}}${colors.reset}`;
  }

  if (typeof obj === 'string') {
    return `${colors.string}"${obj}"${colors.reset}`;
  }
  if (typeof obj === 'number') {
    return `${colors.number}${obj}${colors.reset}`;
  }
  if (typeof obj === 'boolean') {
    return `${colors.boolean}${obj}${colors.reset}`;
  }
  if (obj === null) {
    return `${colors.null}null${colors.reset}`;
  }

  return String(obj);
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function displayStartupSequence() {
  console.clear();
  const steps = [
    '⚡ Initializing AI Federation Network...',
    '🔌 Establishing network protocols...',
    '🤖 Loading ML models...',
    '⚙️  Configuring runtime environment...',
    '🌐 Scanning edge computing matrix...',
    '📡 Starting distributed system...'
  ];

  for (const step of steps) {
    console.log(`\x1b[38;5;117m${step}\x1b[0m`);
    await sleep(300);
  }
  console.log('\n\x1b[38;5;82m✓ System initialization complete\x1b[0m\n');
  await sleep(500);
}

async function handleKeypress() {
  for await (const line of readLines(Deno.stdin)) {
    const choice = line.trim();

    switch (choice) {
      case '1':
        console.log('\n\x1b[38;5;51m▀▀▀ NETWORK STATUS ▀▀▀\x1b[0m');
        console.log(`Active Connections: \x1b[38;5;117m${stats.connections}\x1b[0m`);
        break;

      case '2':
        console.log('\n\x1b[38;5;51m╔══════════════════════════════════╗\x1b[0m');
        console.log('\x1b[38;5;51m║     SYSTEM CORE INFORMATION      ║\x1b[0m');
        console.log('\x1b[38;5;51m╚══════════════════════════════════╝\x1b[0m');
        console.log('\x1b[38;5;117m<< INITIATING DATA STREAM >>\x1b[0m\n');
        console.log(formatJSON(serverInfo));
        console.log('\n\x1b[38;5;117m<< END TRANSMISSION >>\x1b[0m');
        break;

      case '3':
        console.log('\n\x1b[38;5;51m▀▀▀ SYSTEM CAPABILITIES ▀▀▀\x1b[0m');
        console.log(formatJSON(serverInfo.capabilities));
        break;

      case '4':
        await configureProvider();
        break;

      case '5':
        if (!stats.edgeFunctionsEnabled) {
          console.log('\n\x1b[38;5;196m✗ Edge computing system offline\x1b[0m');
          console.log('\x1b[38;5;245mUse option [4] to configure and enable edge functions\x1b[0m');
          break;
        }
        console.log('\n\x1b[38;5;51m▀▀▀ FUNCTION DEPLOYMENT ▀▀▀\x1b[0m');
        console.log('\x1b[38;5;239m┌─────────────────────┐\x1b[0m');
        console.log('\x1b[38;5;239m│\x1b[0m 1. intent-detection \x1b[38;5;239m│\x1b[0m');
        console.log('\x1b[38;5;239m│\x1b[0m 2. meeting-info     \x1b[38;5;239m│\x1b[0m');
        console.log('\x1b[38;5;239m│\x1b[0m 3. webhook-handler  \x1b[38;5;239m│\x1b[0m');
        console.log('\x1b[38;5;239m│\x1b[0m 4. Cancel          \x1b[38;5;239m│\x1b[0m');
        console.log('\x1b[38;5;239m└─────────────────────┘\x1b[0m');

        for await (const deployChoice of readLines(Deno.stdin)) {
          switch (deployChoice.trim()) {
            case '1':
              await supabaseDeployer.deployFunction('intent-detection');
              break;
            case '2':
              await supabaseDeployer.deployFunction('meeting-info');
              break;
            case '3':
              await supabaseDeployer.deployFunction('webhook-handler');
              break;
            case '4':
            default:
              break;
          }
          break;
        }
        break;

      case '6':
        await viewEdgeFunctionStatus();
        break;

      case '7':
        await viewEdgeFunctionLogs();
        break;

      case '8':
        if (stats.edgeFunctionsEnabled) {
          const functions = await supabaseDeployer.listDeployedFunctions();
          console.log('\n\x1b[38;5;51m▀▀▀ DEPLOYED FUNCTIONS ▀▀▀\x1b[0m');
          if (functions.length === 0) {
            console.log('\x1b[38;5;245mNo functions currently deployed\x1b[0m');
          } else {
            functions.forEach(f => console.log(`\x1b[38;5;82m✓ ${f}\x1b[0m`));
          }
        } else {
          console.log('\n\x1b[38;5;196m✗ Edge computing system offline\x1b[0m');
        }
        break;

      case '9':
        displayServerStatus();
        break;

      default:
        console.log('\n\x1b[38;5;196m✗ Invalid command\x1b[0m');
        break;
    }

    console.log('\n\x1b[38;5;51m[SYS]>\x1b[38;5;87m AWAITING INPUT\x1b[38;5;51m [1-9]:\x1b[0m');
  }
}

// Create request handler
async function handler(req: Request): Promise<Response> {
  return new Response("AI Federation Network Online", { status: 200 });
}

// Initialize everything in sequence
await displayStartupSequence();
await checkEdgeProviders();
displayServerStatus();

// Start the HTTP server with logging disabled
const httpServer = Deno.serve({
  port: 3000,
  onListen: ({ port }) => {
    console.log(`\x1b[38;5;245m🌐 Network interface active on port ${port}\x1b[0m`);
  }
}, handler);

// Start keyboard input handler
handleKeypress();

await httpServer.finished;



---
File: /federated-mcp-main/src/packages/core/auth.ts
---

import { create, verify } from "https://deno.land/x/djwt/mod.ts";

export class AuthManager {
  private key: Promise<CryptoKey>;

  constructor(secret: string) {
    this.key = this.initializeKey(secret);
  }

  private async initializeKey(secret: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    return await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign", "verify"]
    );
  }

  async createToken(payload: Record<string, unknown>): Promise<string> {
    const key = await this.key;
    return await create({ alg: "HS512", typ: "JWT" }, payload, key);
  }

  async verifyToken(token: string): Promise<Record<string, unknown>> {
    const key = await this.key;
    return await verify(token, key);
  }
}



---
File: /federated-mcp-main/src/packages/core/schema.ts
---

/* JSON-RPC types */

// Base interface for JSON-RPC messages
interface JSONRPCBase {
  jsonrpc: "2.0";
}

// Request message
export interface JSONRPCRequest extends JSONRPCBase {
  method: string;
  params?: unknown;
  id: number | string;
}

// Notification message (request without id)
export interface JSONRPCNotification extends JSONRPCBase {
  method: string;
  params?: unknown;
}

// Success response
export interface JSONRPCResponse extends JSONRPCBase {
  result: unknown;
  id: number | string;
}

// Error response
export interface JSONRPCError extends JSONRPCBase {
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: number | string | null;
}

// Union type for all JSON-RPC messages
export type JSONRPCMessage =
  | JSONRPCRequest
  | JSONRPCNotification
  | JSONRPCResponse
  | JSONRPCError;

// Protocol version constants
export const LATEST_PROTOCOL_VERSION = "2024-11-05";
export const JSONRPC_VERSION = "2.0";



---
File: /federated-mcp-main/src/packages/core/server.ts
---

import { ServerInfo, Capabilities, Message, Response as MCPResponse } from './types.ts';

interface ConsoleOptions {
  showTimestamp?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export class MCPServer {
  protected info: ServerInfo;
  private consoleOptions: ConsoleOptions;

  constructor(info: ServerInfo, options: ConsoleOptions = {}) {
    this.info = info;
    this.consoleOptions = {
      showTimestamp: options.showTimestamp ?? true,
      logLevel: options.logLevel ?? 'info'
    };
  }

  protected log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: unknown) {
    const levels = ['debug', 'info', 'warn', 'error'];
    if (levels.indexOf(level) < levels.indexOf(this.consoleOptions.logLevel!)) {
      return;
    }

    const timestamp = this.consoleOptions.showTimestamp
      ? `[${new Date().toISOString()}] `
      : '';

    const prefix = `${timestamp}[${this.info.name}] ${level.toUpperCase()}: `;

    switch (level) {
      case 'debug':
        console.debug(prefix + message, data ?? '');
        break;
      case 'info':
        console.info(prefix + message, data ?? '');
        break;
      case 'warn':
        console.warn(prefix + message, data ?? '');
        break;
      case 'error':
        console.error(prefix + message, data ?? '');
        break;
    }
  }

  async handleWebSocket(socket: WebSocket): Promise<void> {
    this.log('info', 'WebSocket connection established');

    socket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        this.log('debug', 'Received WebSocket message', message);

        const response = await this.handleMessage(message);
        socket.send(JSON.stringify(response));

        this.log('debug', 'Sent WebSocket response', response);
      } catch (error) {
        this.log('error', 'WebSocket error', error);
        socket.send(JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    };

    socket.onclose = () => {
      this.log('info', 'WebSocket connection closed');
    };

    socket.onerror = (error) => {
      this.log('error', 'WebSocket error', error);
    };
  }

  async handleHTTP(request: Request): Promise<globalThis.Response> {
    try {
      const body = await request.json();
      this.log('debug', 'Received HTTP request', {
        method: request.method,
        url: request.url,
        body
      });

      const response = await this.handleMessage(body);
      this.log('debug', 'Sending HTTP response', response);

      return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      this.log('error', 'HTTP error', error);

      const errorResponse: MCPResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  protected async handleMessage(message: Message): Promise<MCPResponse> {
    this.log('debug', 'Processing message', message);

    try {
      switch (message.type) {
        case 'info':
          return {
            success: true,
            data: this.info
          };
        case 'capabilities':
          return {
            success: true,
            data: this.info.capabilities
          };
        default:
          this.log('warn', `Unknown message type: ${message.type}`);
          return {
            success: false,
            error: `Unknown message type: ${message.type}`
          };
      }
    } catch (error) {
      this.log('error', 'Message handling error', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  printServerInfo() {
    console.log('\n=== MCP Server Information ===');
    console.log(`Name: ${this.info.name}`);
    console.log(`Version: ${this.info.version}`);
    console.log('\nCapabilities:');
    if (this.info.capabilities.models?.length) {
      console.log('- Models:', this.info.capabilities.models.join(', '));
    }
    if (this.info.capabilities.protocols?.length) {
      console.log('- Protocols:', this.info.capabilities.protocols.join(', '));
    }
    if (this.info.capabilities.features?.length) {
      console.log('- Features:', this.info.capabilities.features.join(', '));
    }
    console.log('\nLogging:');
    console.log(`- Level: ${this.consoleOptions.logLevel}`);
    console.log(`- Timestamps: ${this.consoleOptions.showTimestamp ? 'enabled' : 'disabled'}`);
    console.log('===========================\n');
  }
}



---
File: /federated-mcp-main/src/packages/core/types.ts
---

// Core protocol types
export interface Capabilities {
  models?: string[];
  protocols?: string[];
  features?: string[];
}

export interface ServerInfo {
  name: string;
  version: string;
  capabilities: Capabilities;
}

export interface Message {
  type: string;
  content: unknown;
}

export interface Response {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface FederationConfig {
  serverId: string;
  endpoints: {
    control: string;
    data: string;
  };
  auth: {
    type: 'jwt' | 'oauth2';
    config: Record<string, unknown>;
  };
}



---
File: /federated-mcp-main/src/packages/edge/tests/intent-detection.test.ts
---

import { assertEquals, assertExists } from "https://deno.land/std/testing/asserts.ts";
import { handleIntentDetection } from "../intent-detection.ts";

// Mock OpenAI API for testing
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
  if (input.toString().includes('api.openai.com')) {
    return new Response(JSON.stringify({
      choices: [
        {
          message: {
            content: JSON.stringify([
              {
                type: "Task Assignment",
                confidence: 0.9,
                segment: {
                  text: "Let's schedule a follow-up meeting next week",
                  timestamp: 0,
                  speaker: "unknown"
                },
                metadata: {
                  context: ["meeting planning"],
                  entities: ["next week"]
                }
              }
            ])
          }
        }
      ]
    }));
  }
  return originalFetch(input, init);
};

Deno.test("Intent Detection - handles valid request", async () => {
  const mockRequest = new Request("http://localhost/intent-detection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      meetingId: "test-meeting-123",
      transcriptionText: "Let's schedule a follow-up meeting next week. @John will prepare the presentation.",
      participants: ["John", "Alice"],
      metadata: {
        duration: 3600,
        date: "2024-01-15T10:00:00Z"
      }
    })
  });

  const response = await handleIntentDetection(mockRequest);
  assertEquals(response.status, 200);

  const data = await response.json();
  assertExists(data.success);
  assertEquals(data.success, true);
  assertExists(data.data.intents);
  assertEquals(Array.isArray(data.data.intents), true);
});

Deno.test("Intent Detection - handles missing required fields", async () => {
  const mockRequest = new Request("http://localhost/intent-detection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      meetingId: "test-meeting-123"
      // Missing transcriptionText
    })
  });

  const response = await handleIntentDetection(mockRequest);
  assertEquals(response.status, 400);

  const data = await response.json();
  assertEquals(data.success, false);
  assertExists(data.message);
});

Deno.test("Intent Detection - handles invalid method", async () => {
  const mockRequest = new Request("http://localhost/intent-detection", {
    method: "GET"
  });

  const response = await handleIntentDetection(mockRequest);
  assertEquals(response.status, 405);
});

Deno.test("Intent Detection - handles CORS preflight", async () => {
  const mockRequest = new Request("http://localhost/intent-detection", {
    method: "OPTIONS"
  });

  const response = await handleIntentDetection(mockRequest);
  assertEquals(response.status, 200);
  assertEquals(response.headers.get("Access-Control-Allow-Origin"), "*");
  assertEquals(response.headers.get("Access-Control-Allow-Methods"), "POST, OPTIONS");
});



---
File: /federated-mcp-main/src/packages/edge/tests/mcp.test.ts
---

import { assertEquals, assertExists } from "https://deno.land/std/testing/asserts.ts";
import { edgeMCP } from "../mcp.ts";
import { Message, Response as MCPResponse } from "../../core/types.ts";

// Mock external API calls
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
  const url = input.toString();

  if (url.includes('api.openai.com')) {
    return new Response(JSON.stringify({
      choices: [
        {
          message: {
            content: JSON.stringify([
              {
                type: "Task Assignment",
                confidence: 0.9,
                segment: {
                  text: "Let's schedule a follow-up meeting next week",
                  timestamp: 0,
                  speaker: "unknown"
                },
                metadata: {
                  context: ["meeting planning"],
                  entities: ["next week"]
                }
              }
            ])
          }
        }
      ]
    }));
  }

  if (url.includes('api.fireflies.ai')) {
    return new Response(JSON.stringify({
      data: {
        transcript: {
          summary: {
            keywords: ["meeting", "planning"],
            action_items: ["Schedule follow-up"],
            outline: ["Introduction", "Discussion"],
            shorthand_bullet: ["Meeting recap"],
            overview: "Team planning meeting",
            bullet_gist: ["Key points discussed"],
            gist: "Planning session",
            short_summary: "Team discussed upcoming plans"
          }
        }
      }
    }));
  }

  return originalFetch(input, init);
};

// Test MCP server capabilities
Deno.test("MCP Server - provides correct capabilities", async () => {
  const message: Message = {
    type: "capabilities",
    content: null
  };

  const response = await edgeMCP.processMessage(message);
  assertEquals(response.success, true);
  const capabilities = response.data as { features: string[] };
  assertEquals(Array.isArray(capabilities.features), true);
  assertEquals(capabilities.features.includes('intent-detection'), true);
  assertEquals(capabilities.features.includes('meeting-info'), true);
  assertEquals(capabilities.features.includes('webhook-handler'), true);
});

// Test intent detection through MCP
Deno.test("MCP Server - handles intent detection", async () => {
  const message: Message = {
    type: "intent-detection",
    content: {
      meetingId: "test-meeting-123",
      transcriptionText: "Let's schedule a follow-up meeting next week.",
      participants: ["John", "Alice"],
      metadata: {
        duration: 3600,
        date: "2024-01-15T10:00:00Z"
      }
    }
  };

  const response = await edgeMCP.processMessage(message);
  assertEquals(response.success, true);
  assertExists(response.data);
  const data = response.data as { data: { intents: unknown[] } };
  assertExists(data.data.intents);
  assertEquals(Array.isArray(data.data.intents), true);
});

// Test meeting info through MCP
Deno.test("MCP Server - handles meeting info", async () => {
  const message: Message = {
    type: "meeting-info",
    content: {
      meetingId: "test-meeting-123",
      authorization: "Bearer test-token"
    }
  };

  const response = await edgeMCP.processMessage(message);
  assertEquals(response.success, true);
  assertExists(response.data);
  const data = response.data as { data: { transcript: unknown } };
  assertExists(data.data.transcript);
});

// Test webhook through MCP
Deno.test("MCP Server - handles webhook", async () => {
  const message: Message = {
    type: "webhook",
    content: {
      meetingId: "test-meeting-123",
      eventType: "Transcription completed",
      clientReferenceId: "client-ref-123"
    }
  };

  const response = await edgeMCP.processMessage(message);
  assertEquals(response.success, true);
  assertExists(response.data);
  const data = response.data as { data: { meetingId: string } };
  assertEquals(data.data.meetingId, "test-meeting-123");
});

// Test invalid message type
Deno.test("MCP Server - handles invalid message type", async () => {
  const message: Message = {
    type: "invalid-type",
    content: {}
  };

  const response = await edgeMCP.processMessage(message);
  assertEquals(response.success, false);
  assertExists(response.error);
});



---
File: /federated-mcp-main/src/packages/edge/tests/meeting-info.test.ts
---

import { assertEquals, assertExists } from "https://deno.land/std/testing/asserts.ts";
import { handleMeetingInfo } from "../meeting-info.ts";

// Mock Fireflies API for testing
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
  if (input.toString().includes('api.fireflies.ai')) {
    return new Response(JSON.stringify({
      data: {
        transcript: {
          summary: {
            keywords: ["meeting", "planning"],
            action_items: ["Schedule follow-up"],
            outline: ["Introduction", "Discussion"],
            shorthand_bullet: ["Meeting recap"],
            overview: "Team planning meeting",
            bullet_gist: ["Key points discussed"],
            gist: "Planning session",
            short_summary: "Team discussed upcoming plans"
          }
        }
      }
    }));
  }
  return originalFetch(input, init);
};

Deno.test("Meeting Info - handles valid request", async () => {
  const mockRequest = new Request("http://localhost/meeting-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer test-api-key"
    },
    body: JSON.stringify({
      meetingId: "test-meeting-123"
    })
  });

  const response = await handleMeetingInfo(mockRequest);
  assertEquals(response.status, 200);

  const data = await response.json();
  assertExists(data.success);
  assertEquals(data.success, true);
  assertExists(data.data.transcript);
});

Deno.test("Meeting Info - handles missing API key", async () => {
  const mockRequest = new Request("http://localhost/meeting-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      meetingId: "test-meeting-123"
    })
  });

  const response = await handleMeetingInfo(mockRequest);
  assertEquals(response.status, 401);

  const data = await response.json();
  assertEquals(data.success, false);
  assertEquals(data.message, "Missing API key");
});

Deno.test("Meeting Info - handles missing meetingId", async () => {
  const mockRequest = new Request("http://localhost/meeting-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer test-api-key"
    },
    body: JSON.stringify({})
  });

  const response = await handleMeetingInfo(mockRequest);
  assertEquals(response.status, 400);

  const data = await response.json();
  assertEquals(data.success, false);
  assertEquals(data.message, "Missing meetingId");
});

Deno.test("Meeting Info - handles invalid method", async () => {
  const mockRequest = new Request("http://localhost/meeting-info", {
    method: "GET"
  });

  const response = await handleMeetingInfo(mockRequest);
  assertEquals(response.status, 405);
});

Deno.test("Meeting Info - handles CORS preflight", async () => {
  const mockRequest = new Request("http://localhost/meeting-info", {
    method: "OPTIONS"
  });

  const response = await handleMeetingInfo(mockRequest);
  assertEquals(response.status, 200);
  assertEquals(response.headers.get("Access-Control-Allow-Origin"), "*");
  assertEquals(response.headers.get("Access-Control-Allow-Methods"), "POST, OPTIONS");
});



---
File: /federated-mcp-main/src/packages/edge/tests/webhook-handler.test.ts
---

import { assertEquals, assertExists } from "https://deno.land/std/testing/asserts.ts";
import { handleWebhook } from "../webhook-handler.ts";

Deno.test("Webhook Handler - handles valid transcription completed event", async () => {
  const mockRequest = new Request("http://localhost/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      meetingId: "test-meeting-123",
      eventType: "Transcription completed",
      clientReferenceId: "client-ref-123"
    })
  });

  const response = await handleWebhook(mockRequest);
  assertEquals(response.status, 200);

  const data = await response.json();
  assertExists(data.success);
  assertEquals(data.success, true);
  assertExists(data.data);
  assertEquals(data.data.meetingId, "test-meeting-123");
  assertEquals(data.data.eventType, "Transcription completed");
});

Deno.test("Webhook Handler - handles unsupported event type", async () => {
  const mockRequest = new Request("http://localhost/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      meetingId: "test-meeting-123",
      eventType: "Meeting started",
      clientReferenceId: "client-ref-123"
    })
  });

  const response = await handleWebhook(mockRequest);
  assertEquals(response.status, 200);

  const data = await response.json();
  assertEquals(data.success, true);
  assertEquals(data.message, "Event type not supported for processing");
});

Deno.test("Webhook Handler - handles missing required fields", async () => {
  const mockRequest = new Request("http://localhost/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      meetingId: "test-meeting-123"
      // Missing eventType
    })
  });

  const response = await handleWebhook(mockRequest);
  assertEquals(response.status, 400);

  const data = await response.json();
  assertEquals(data.success, false);
  assertExists(data.message);
});

Deno.test("Webhook Handler - handles invalid method", async () => {
  const mockRequest = new Request("http://localhost/webhook", {
    method: "GET"
  });

  const response = await handleWebhook(mockRequest);
  assertEquals(response.status, 405);
});

Deno.test("Webhook Handler - handles CORS preflight", async () => {
  const mockRequest = new Request("http://localhost/webhook", {
    method: "OPTIONS"
  });

  const response = await handleWebhook(mockRequest);
  assertEquals(response.status, 200);
  assertEquals(response.headers.get("Access-Control-Allow-Origin"), "*");
  assertEquals(response.headers.get("Access-Control-Allow-Methods"), "POST, OPTIONS");
});



---
File: /federated-mcp-main/src/packages/edge/deploy-mcp.ts
---

import { edgeMCP } from './mcp.ts';

interface DeployConfig {
  port?: number;
  hostname?: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

async function startMCPServer(config: DeployConfig = {}) {
  const port = config.port || 8000;
  const hostname = config.hostname || 'localhost';

  // Display server information
  edgeMCP.printServerInfo();

  // Create HTTP server
  const server = Deno.serve({ port, hostname }, async (request) => {
    const url = new URL(request.url);

    // Handle WebSocket upgrade
    if (request.headers.get("upgrade") === "websocket") {
      try {
        const { socket, response } = Deno.upgradeWebSocket(request);
        await edgeMCP.handleWebSocket(socket);
        return response;
      } catch (err) {
        console.error('WebSocket upgrade failed:', err);
        return new Response('WebSocket upgrade failed', { status: 400 });
      }
    }

    // Handle HTTP requests
    try {
      switch (url.pathname) {
        case '/mcp':
          return await edgeMCP.handleHTTP(request);

        case '/intent-detection':
        case '/meeting-info':
        case '/webhook':
          // Forward to appropriate edge function handler
          const message = {
            type: url.pathname.slice(1),
            content: await request.json()
          };
          const response = await edgeMCP.handleHTTP(new Request(request.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
          }));
          return response;

        default:
          return new Response('Not Found', { status: 404 });
      }
    } catch (error) {
      console.error('Request handling error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  });

  console.log(`\nServer Endpoints:`);
  console.log(`- HTTP/WebSocket: http://${hostname}:${port}/mcp`);
  console.log(`- Intent Detection: http://${hostname}:${port}/intent-detection`);
  console.log(`- Meeting Info: http://${hostname}:${port}/meeting-info`);
  console.log(`- Webhook Handler: http://${hostname}:${port}/webhook\n`);

  return server;
}

if (import.meta.main) {
  const port = parseInt(Deno.env.get("PORT") || "8000");
  const hostname = Deno.env.get("HOSTNAME") || "localhost";
  const logLevel = (Deno.env.get("LOG_LEVEL") || "info") as 'debug' | 'info' | 'warn' | 'error';

  await startMCPServer({ port, hostname, logLevel });
}

export { startMCPServer };



---
File: /federated-mcp-main/src/packages/edge/deploy.ts
---

const EDGE_FUNCTIONS = [
  {
    name: 'intent-detection',
    path: './intent-detection.ts',
    description: 'Detects intents in meeting transcripts using AI'
  },
  {
    name: 'meeting-info',
    path: './meeting-info.ts',
    description: 'Retrieves meeting information and summaries'
  },
  {
    name: 'webhook-handler',
    path: './webhook-handler.ts',
    description: 'Handles incoming webhooks for meeting events'
  }
];

interface DeploymentConfig {
  project?: string;
  region?: string;
  env?: Record<string, string>;
}

async function deployFunction(name: string, config: DeploymentConfig = {}) {
  const func = EDGE_FUNCTIONS.find(f => f.name === name);
  if (!func) {
    throw new Error(`Function ${name} not found`);
  }

  const deployCmd = new Deno.Command("deployctl", {
    args: [
      "deploy",
      "--project", config.project || "default",
      "--prod",
      func.path
    ],
    env: {
      ...config.env,
      DENO_DEPLOY_TOKEN: Deno.env.get("DENO_DEPLOY_TOKEN") || "",
    }
  });

  const { code, stdout, stderr } = await deployCmd.output();

  if (code === 0) {
    console.log(`Successfully deployed ${func.name}`);
    console.log(new TextDecoder().decode(stdout));
  } else {
    console.error(`Error deploying ${func.name}`);
    console.error(new TextDecoder().decode(stderr));
    throw new Error(`Deployment failed with code ${code}`);
  }
}

async function deployAll(config: DeploymentConfig = {}) {
  for (const func of EDGE_FUNCTIONS) {
    try {
      await deployFunction(func.name, config);
      console.log(`✓ ${func.name}: ${func.description}`);
    } catch (error) {
      console.error(`✗ ${func.name}: ${error.message}`);
    }
  }
}

if (import.meta.main) {
  const args = Deno.args;
  const config: DeploymentConfig = {
    project: args[1],
    region: args[2]
  };

  if (args[0] === "--all") {
    await deployAll(config);
  } else {
    await deployFunction(args[0], config);
  }
}



---
File: /federated-mcp-main/src/packages/edge/intent-detection.ts
---

import { DetectedIntent, IntentDetectionPayload, EdgeResponse } from './types.ts';

const INTENT_DETECTION_PROMPT = `
Analyze the following meeting segment and identify any specific intents:
[SEGMENT]

Classify the intent into one of the following categories:
- Task Assignment
- Follow-up Required
- Decision Made
- Question Asked
- Commitment Made
- Meeting Scheduled

For each intent detected:
1. Specify the intent type
2. Extract relevant entities
3. Identify the key action items
4. Determine the level of confidence
5. Note any dependencies or context

Provide the analysis in a structured JSON format matching this TypeScript interface:

interface DetectedIntent {
  type: string;          // One of the categories above
  confidence: number;    // Between 0 and 1
  segment: {
    text: string;        // The relevant text segment
    timestamp: number;   // Set to 0 if not available
    speaker: string;     // Set to "unknown" if not available
  }
  metadata: {
    context: string[];   // Related context snippets
    entities: string[];  // Named entities involved
  }
}

Return an array of DetectedIntent objects.
`;

async function detectIntents(segment: string): Promise<DetectedIntent[]> {
  try {
    const prompt = INTENT_DETECTION_PROMPT.replace('[SEGMENT]', segment);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "You are an AI trained to detect intents in meeting transcripts."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content) as DetectedIntent[];
  } catch (error) {
    console.error('Error detecting intents:', error);
    throw error;
  }
}

export async function handleIntentDetection(req: Request): Promise<Response> {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Validate request method
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Parse and validate payload
    const payload: IntentDetectionPayload = await req.json();
    if (!payload.meetingId || !payload.transcriptionText) {
      const response: EdgeResponse = {
        success: false,
        message: 'Invalid payload: missing required fields'
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Split text into segments (simplified for example)
    const segments = payload.transcriptionText.split('\n\n').filter(Boolean);

    // Process each segment
    const allIntents: DetectedIntent[] = [];
    for (const segment of segments) {
      const intents = await detectIntents(segment);
      if (Array.isArray(intents)) {
        allIntents.push(...intents);
      }
    }

    const response: EdgeResponse<{
      meetingId: string;
      intentsCount: number;
      intents: DetectedIntent[];
    }> = {
      success: true,
      message: 'Intents detected successfully',
      data: {
        meetingId: payload.meetingId,
        intentsCount: allIntents.length,
        intents: allIntents
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    const response: EdgeResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    };
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}



---
File: /federated-mcp-main/src/packages/edge/mcp.ts
---

import { MCPServer } from '../core/server.ts';
import { ServerInfo, Capabilities, Message, Response as MCPResponse } from '../core/types.ts';
import { handleIntentDetection } from './intent-detection.ts';
import { handleMeetingInfo } from './meeting-info.ts';
import { handleWebhook } from './webhook-handler.ts';
import { EdgeResponse } from './types.ts';

const EDGE_CAPABILITIES: Capabilities = {
  models: ['gpt-4'],
  protocols: ['http', 'websocket'],
  features: [
    'intent-detection',
    'meeting-info',
    'webhook-handler'
  ]
};

export class EdgeMCPServer extends MCPServer {
  constructor() {
    const info: ServerInfo = {
      name: 'edge-mcp',
      version: '1.0.0',
      capabilities: EDGE_CAPABILITIES
    };
    super(info, {
      showTimestamp: true,
      logLevel: 'debug'
    });
  }

  // Public method for testing
  async processMessage(message: Message): Promise<MCPResponse> {
    return this.handleMessage(message);
  }

  protected override async handleMessage(message: Message): Promise<MCPResponse> {
    try {
      switch (message.type) {
        case 'intent-detection': {
          this.log('info', 'Processing intent detection request');
          const request = this.createRequest(message);
          this.log('debug', 'Created intent detection request', request);

          const response = await handleIntentDetection(request);
          const edgeResponse = await response.json() as EdgeResponse;

          this.log('debug', 'Intent detection response', edgeResponse);
          return {
            success: edgeResponse.success,
            data: edgeResponse
          };
        }

        case 'meeting-info': {
          this.log('info', 'Processing meeting info request');
          const request = this.createRequest(message);
          this.log('debug', 'Created meeting info request', request);

          const response = await handleMeetingInfo(request);
          const edgeResponse = await response.json() as EdgeResponse;

          this.log('debug', 'Meeting info response', edgeResponse);
          return {
            success: edgeResponse.success,
            data: edgeResponse
          };
        }

        case 'webhook': {
          this.log('info', 'Processing webhook request');
          const request = this.createRequest(message);
          this.log('debug', 'Created webhook request', request);

          const response = await handleWebhook(request);
          const edgeResponse = await response.json() as EdgeResponse;

          this.log('debug', 'Webhook response', edgeResponse);
          return {
            success: edgeResponse.success,
            data: edgeResponse
          };
        }

        case 'info':
        case 'capabilities':
          return await super.handleMessage(message);

        default:
          this.log('warn', `Unsupported message type: ${message.type}`);
          return {
            success: false,
            error: `Unsupported message type: ${message.type}`
          };
      }
    } catch (error) {
      this.log('error', 'Message handling error', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private createRequest(message: Message): Request {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    // Add authorization if provided
    if (typeof message.content === 'object' && message.content !== null) {
      const content = message.content as Record<string, unknown>;
      if (content.authorization) {
        headers.set('Authorization', String(content.authorization));
      }
    }

    return new Request('http://edge-mcp', {
      method: 'POST',
      headers,
      body: JSON.stringify(message.content)
    });
  }
}

// Create and export server instance
export const edgeMCP = new EdgeMCPServer();



---
File: /federated-mcp-main/src/packages/edge/meeting-info.ts
---

import { TranscriptResponse, EdgeResponse } from './types.ts';

export async function handleMeetingInfo(req: Request): Promise<Response> {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
      const response: EdgeResponse = {
        success: false,
        message: 'Method not allowed'
      };
      return new Response(JSON.stringify(response), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get API key from request header
    const apiKey = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!apiKey) {
      const response: EdgeResponse = {
        success: false,
        message: 'Missing API key'
      };
      return new Response(JSON.stringify(response), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const { meetingId } = await req.json();
    if (!meetingId) {
      const response: EdgeResponse = {
        success: false,
        message: 'Missing meetingId'
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Query Fireflies GraphQL API
    const query = `
      query Transcript($transcriptId: String!) {
        transcript(id: $transcriptId) {
          summary {
            keywords
            action_items
            outline
            shorthand_bullet
            overview
            bullet_gist
            gist
            short_summary
          }
        }
      }
    `;

    const response = await fetch('https://api.fireflies.ai/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        variables: { transcriptId: meetingId },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      const errorResponse: EdgeResponse = {
        success: false,
        message: result.errors[0].message
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const successResponse: EdgeResponse<TranscriptResponse> = {
      success: true,
      message: 'Meeting info retrieved successfully',
      data: result.data
    };

    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error: unknown) {
    const errorResponse: EdgeResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}



---
File: /federated-mcp-main/src/packages/edge/README-SUPABASE.md
---

# Supabase Edge Function Deployment Guide

This guide explains how to set up and deploy edge functions to Supabase using the MCP server.

## Prerequisites

1. Install Supabase CLI:
```bash
# macOS
brew install supabase/tap/supabase

# Windows (requires scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
curl -fsSL https://cli.supabase.com/install.sh | sh
```

2. Log in to Supabase:
```bash
supabase login
```

## Configuration

1. Create a `.env` file in the project root:
```bash
touch .env
```

2. Add the following environment variables to `.env`:
```env
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_ACCESS_TOKEN=your_access_token
```

To get these values:

1. **Project ID**:
   - Go to your Supabase project dashboard
   - Click on Settings -> API
   - Copy the "Project ID" value

2. **Access Token**:
   - Go to https://supabase.com/dashboard/account/tokens
   - Generate a new access token
   - Copy the token value

## Project Setup

1. Initialize Supabase in your project:
```bash
supabase init
```

2. Link to your Supabase project:
```bash
supabase link --project-ref your_project_id
```

## Using the MCP Server

1. Start the server with environment variables:
```bash
export $(cat .env | xargs) && deno run --allow-net --allow-env --allow-read --allow-write --allow-run apps/deno/server.ts
```

2. Deploy Edge Functions:
   - Select option [5] from the menu
   - Choose the function to deploy
   - The server will handle the deployment process

## Available Edge Functions

1. Intent Detection (`intent-detection`)
   - AI-powered intent detection for meeting transcripts
   - Uses OpenAI GPT-4

2. Meeting Info (`meeting-info`)
   - Meeting information and summary handler
   - Integrates with Fireflies API

3. Webhook Handler (`webhook-handler`)
   - Processes meeting-related webhooks
   - Handles event notifications

## Deployment Process

When deploying a function:
1. The server creates necessary Supabase function directories
2. Copies the function code to the Supabase structure
3. Deploys using Supabase CLI
4. Provides the deployed function URL

## Monitoring

- Use option [6] to view function status
- Use option [7] to view function logs
- Use option [8] to list all deployed functions

## Troubleshooting

1. **Missing Configuration**
   ```
   Error: Missing Supabase configuration
   ```
   - Ensure `.env` file exists with required variables
   - Verify environment variables are properly exported

2. **Deployment Failures**
   - Check Supabase CLI is installed and logged in
   - Verify project linking is correct
   - Check function logs for detailed error messages

3. **Permission Issues**
   - Ensure proper Supabase access token permissions
   - Verify project access rights

## Security Notes

- Keep your access token secure
- Don't commit `.env` file to version control
- Regularly rotate access tokens
- Monitor function access logs

## Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Edge Functions Examples](https://github.com/supabase/supabase/tree/master/examples/edge-functions)



---
File: /federated-mcp-main/src/packages/edge/README.md
---

# Edge Functions Integration

This directory contains the edge function implementations integrated from the Supabase project. These functions provide real-time processing capabilities for meeting transcripts and related functionality.

## Structure

```
edge/
├── types.ts           # Shared TypeScript types
├── server.ts          # Main edge server implementation
├── intent-detection.ts # Intent detection service
├── meeting-info.ts    # Meeting information handler
├── webhook-handler.ts # Webhook processing
└── deploy.ts         # Deployment utilities
```

## Features

- **Intent Detection**: AI-powered intent detection for meeting transcripts
- **Meeting Info**: Retrieval and processing of meeting information
- **Webhook Handler**: Processing of meeting-related events

## Development

1. Install Deno if not already installed:
   ```bash
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

2. Run the development server:
   ```bash
   deno task dev
   ```

3. Test the implementation:
   ```bash
   deno task test
   ```

## Deployment

Deploy all functions:
```bash
deno run --allow-run --allow-env deploy.ts --all
```

Deploy specific function:
```bash
deno run --allow-run --allow-env deploy.ts intent-detection
```

## Environment Variables

Required environment variables:
- `OPENAI_API_KEY`: API key for OpenAI services
- `DENO_DEPLOY_TOKEN`: Token for Deno Deploy

## API Endpoints

### Intent Detection
- **POST** `/intent-detection`
- Detects intents in meeting transcripts
- Requires: `meetingId`, `transcriptionText`

### Meeting Info
- **POST** `/meeting-info`
- Retrieves meeting information and summaries
- Requires: `meetingId`

### Webhook Handler
- **POST** `/webhook`
- Handles incoming meeting events
- Requires: `meetingId`, `eventType`

## Integration Notes

1. The edge functions are designed to work with the existing federation system
2. All functions use TypeScript for type safety
3. CORS is enabled for all endpoints
4. Error handling follows a consistent pattern
5. Responses follow the standard EdgeResponse format

## Testing

Each function includes its own test file. Run all tests:

```bash
deno test --allow-net --allow-env
```

## Error Handling

All functions use a standardized error response format:
```typescript
{
  success: false,
  message: string,
  data?: any
}



---
File: /federated-mcp-main/src/packages/edge/server.ts
---

import { handleIntentDetection } from './intent-detection.ts';
import { handleMeetingInfo } from './meeting-info.ts';
import { handleWebhook } from './webhook-handler.ts';
import { EdgeResponse } from './types.ts';

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Route requests to appropriate handlers
  switch (url.pathname) {
    case '/intent-detection':
      return handleIntentDetection(req);

    case '/meeting-info':
      return handleMeetingInfo(req);

    case '/webhook':
      return handleWebhook(req);

    default:
      const response: EdgeResponse = {
        success: false,
        message: 'Not found'
      };
      return new Response(JSON.stringify(response), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
  }
}

// Start the server if not in test environment
if (!Deno.env.get("DENO_TEST")) {
  Deno.serve(handleRequest);
}



---
File: /federated-mcp-main/src/packages/edge/supabase-deploy.ts
---

interface SupabaseConfig {
  projectId?: string;
  accessToken?: string;
}

interface DeploymentResult {
  success: boolean;
  message: string;
  functionUrl?: string;
  error?: string;
}

export class SupabaseDeployer {
  private config: SupabaseConfig;

  constructor(config: SupabaseConfig = {}) {
    this.config = {
      projectId: config.projectId || Deno.env.get("SUPABASE_PROJECT_ID"),
      accessToken: config.accessToken || Deno.env.get("SUPABASE_ACCESS_TOKEN")
    };
  }

  private async validateConfig(): Promise<boolean> {
    if (!this.config.projectId || !this.config.accessToken) {
      console.error('\x1b[31mError: Missing Supabase configuration\x1b[0m');
      console.error('Please set SUPABASE_PROJECT_ID and SUPABASE_ACCESS_TOKEN environment variables');
      return false;
    }
    return true;
  }

  private async executeCommand(command: string[]): Promise<{ success: boolean; output: string }> {
    try {
      const process = new Deno.Command("supabase", {
        args: command,
        env: {
          "SUPABASE_ACCESS_TOKEN": this.config.accessToken!
        }
      });

      const { code, stdout, stderr } = await process.output();
      const output = new TextDecoder().decode(code === 0 ? stdout : stderr);
      return { success: code === 0, output };
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deployFunction(functionName: string): Promise<DeploymentResult> {
    if (!await this.validateConfig()) {
      return {
        success: false,
        message: 'Invalid configuration',
        error: 'Missing required environment variables'
      };
    }

    console.log(`\n\x1b[33mDeploying ${functionName} to Supabase...\x1b[0m`);

    // Verify function exists
    const functionPath = `src/packages/edge/${functionName}.ts`;
    try {
      await Deno.stat(functionPath);
    } catch {
      return {
        success: false,
        message: `Function ${functionName} not found`,
        error: `File ${functionPath} does not exist`
      };
    }

    // Create Supabase function directory
    const supabaseFunctionPath = `supabase/functions/${functionName}`;
    try {
      await Deno.mkdir(supabaseFunctionPath, { recursive: true });
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create function directory',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Copy function file
    try {
      await Deno.copyFile(functionPath, `${supabaseFunctionPath}/index.ts`);
    } catch (error) {
      return {
        success: false,
        message: 'Failed to copy function file',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    // Deploy to Supabase
    const deployResult = await this.executeCommand([
      "functions",
      "deploy",
      functionName,
      "--project-ref",
      this.config.projectId!
    ]);

    if (!deployResult.success) {
      return {
        success: false,
        message: 'Deployment failed',
        error: deployResult.output
      };
    }

    const functionUrl = `https://${this.config.projectId}.supabase.co/functions/v1/${functionName}`;
    return {
      success: true,
      message: `Successfully deployed ${functionName}`,
      functionUrl
    };
  }

  async listDeployedFunctions(): Promise<string[]> {
    if (!await this.validateConfig()) {
      return [];
    }

    const result = await this.executeCommand([
      "functions",
      "list",
      "--project-ref",
      this.config.projectId!
    ]);

    if (!result.success) {
      console.error('\x1b[31mError listing functions:\x1b[0m', result.output);
      return [];
    }

    // Parse function names from output
    const functions = result.output
      .split('\n')
      .slice(1) // Skip header
      .filter(line => line.trim())
      .map(line => line.split(/\s+/)[0]);

    return functions;
  }

  async getFunctionLogs(functionName: string): Promise<string[]> {
    if (!await this.validateConfig()) {
      return [];
    }

    const result = await this.executeCommand([
      "functions",
      "logs",
      functionName,
      "--project-ref",
      this.config.projectId!
    ]);

    if (!result.success) {
      console.error(`\x1b[31mError getting logs for ${functionName}:\x1b[0m`, result.output);
      return [];
    }

    return result.output.split('\n').filter(line => line.trim());
  }
}



---
File: /federated-mcp-main/src/packages/edge/types.ts
---

// Intent Detection Types
export interface IntentDetectionPayload {
  meetingId: string;
  transcriptionText: string;
  participants: string[];
  metadata: {
    duration: number;
    date: string;
  }
}

export interface DetectedIntent {
  type: string;
  confidence: number;
  segment: {
    text: string;
    timestamp: number;
    speaker: string;
  }
  metadata: {
    context: string[];
    entities: string[];
  }
}

// Meeting Info Types
export interface TranscriptSummary {
  keywords: string[];
  action_items: string[];
  outline: string[];
  shorthand_bullet: string[];
  overview: string;
  bullet_gist: string[];
  gist: string;
  short_summary: string;
}

export interface TranscriptResponse {
  transcript?: {
    summary: TranscriptSummary;
  };
}

// Webhook Types
export interface WebhookPayload {
  meetingId: string;
  eventType: string;
  clientReferenceId?: string;
}

// Shared Response Type
export interface EdgeResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}



---
File: /federated-mcp-main/src/packages/edge/webhook-handler.ts
---

import { WebhookPayload, EdgeResponse } from './types.ts';

export async function handleWebhook(req: Request): Promise<Response> {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
      const response: EdgeResponse = {
        success: false,
        message: 'Method not allowed'
      };
      return new Response(JSON.stringify(response), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse and validate webhook payload
    const payload: WebhookPayload = await req.json();

    if (!payload.meetingId || !payload.eventType) {
      const response: EdgeResponse = {
        success: false,
        message: 'Invalid webhook payload: missing required fields'
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Only process completed transcriptions
    if (payload.eventType !== 'Transcription completed') {
      const response: EdgeResponse = {
        success: true,
        message: 'Event type not supported for processing',
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Process the webhook
    const response: EdgeResponse<WebhookPayload> = {
      success: true,
      message: 'Webhook received successfully',
      data: payload
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error: unknown) {
    const errorResponse: EdgeResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}



---
File: /federated-mcp-main/src/packages/proxy/federation.ts
---

import { FederationConfig } from '../core/types.ts';
import { AuthManager } from '../core/auth.ts';
import { JSONRPCMessage, JSONRPCRequest, JSONRPCResponse } from '../core/schema.ts';

export class FederationProxy {
  private servers: Map<string, FederationConfig>;
  private authManager: AuthManager;
  private connections: Map<string, WebSocket>;

  constructor(secret: string) {
    this.servers = new Map();
    this.connections = new Map();
    this.authManager = new AuthManager(secret);
  }

  async registerServer(config: FederationConfig): Promise<void> {
    this.servers.set(config.serverId, config);
    await this.establishConnection(config);
  }

  async removeServer(serverId: string): Promise<void> {
    const connection = this.connections.get(serverId);
    if (connection) {
      connection.close();
      this.connections.delete(serverId);
    }
    this.servers.delete(serverId);
  }

  private async establishConnection(config: FederationConfig): Promise<void> {
    try {
      const token = await this.authManager.createToken({
        serverId: config.serverId,
        type: 'federation'
      });

      // Append token as query parameter
      const wsUrl = new URL(config.endpoints.control);
      wsUrl.searchParams.set('token', token);

      return new Promise((resolve, reject) => {
        const ws = new WebSocket(wsUrl.toString());

        ws.onopen = () => {
          console.log(`Connected to server ${config.serverId}`);
          this.connections.set(config.serverId, ws);
          resolve();
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as JSONRPCMessage;
            this.handleMessage(config.serverId, message);
          } catch (error) {
            console.error(`Failed to parse message from ${config.serverId}:`, error);
          }
        };

        ws.onclose = () => {
          console.log(`Disconnected from server ${config.serverId}`);
          this.connections.delete(config.serverId);
        };

        ws.onerror = (error) => {
          console.error(`Error with server ${config.serverId}:`, error);
          reject(error);
        };

        // Set a connection timeout
        const timeout = setTimeout(() => {
          ws.close();
          reject(new Error('Connection timeout'));
        }, 5000);

        // Clear timeout on successful connection
        ws.addEventListener('open', () => clearTimeout(timeout));
      });

    } catch (error) {
      console.error(`Failed to establish connection with ${config.serverId}:`, error);
      throw error;
    }
  }

  private handleMessage(serverId: string, message: JSONRPCMessage): void {
    // Implement message handling logic based on the JSON-RPC message type
    console.log(`Received message from ${serverId}:`, message);
  }

  getConnectedServers(): string[] {
    return Array.from(this.connections.keys());
  }
}



---
File: /federated-mcp-main/src/schema/schema.ts
---

{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "definitions": {
        "Annotated": {
            "description": "Base for objects that include optional annotations for the client. The client can use annotations to inform how objects are used or displayed",
            "properties": {
                "annotations": {
                    "properties": {
                        "audience": {
                            "description": "Describes who the intended customer of this object or data is.\n\nIt can include multiple entries to indicate content useful for multiple audiences (e.g., `[\"user\", \"assistant\"]`).",
                            "items": {
                                "$ref": "#/definitions/Role"
                            },
                            "type": "array"
                        },
                        "priority": {
                            "description": "Describes how important this data is for operating the server.\n\nA value of 1 means \"most important,\" and indicates that the data is\neffectively required, while 0 means \"least important,\" and indicates that\nthe data is entirely optional.",
                            "maximum": 1,
                            "minimum": 0,
                            "type": "number"
                        }
                    },
                    "type": "object"
                }
            },
            "type": "object"
        },
        "BlobResourceContents": {
            "properties": {
                "blob": {
                    "description": "A base64-encoded string representing the binary data of the item.",
                    "format": "byte",
                    "type": "string"
                },
                "mimeType": {
                    "description": "The MIME type of this resource, if known.",
                    "type": "string"
                },
                "uri": {
                    "description": "The URI of this resource.",
                    "format": "uri",
                    "type": "string"
                }
            },
            "required": [
                "blob",
                "uri"
            ],
            "type": "object"
        },
        "CallToolRequest": {
            "description": "Used by the client to invoke a tool provided by the server.",
            "properties": {
                "method": {
                    "const": "tools/call",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "arguments": {
                            "additionalProperties": {},
                            "type": "object"
                        },
                        "name": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "name"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        },
        "CallToolResult": {
            "description": "The server's response to a tool call.\n\nAny errors that originate from the tool SHOULD be reported inside the result\nobject, with `isError` set to true, _not_ as an MCP protocol-level error\nresponse. Otherwise, the LLM would not be able to see that an error occurred\nand self-correct.\n\nHowever, any errors in _finding_ the tool, an error indicating that the\nserver does not support tool calls, or any other exceptional conditions,\nshould be reported as an MCP error response.",
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                },
                "content": {
                    "items": {
                        "anyOf": [
                            {
                                "$ref": "#/definitions/TextContent"
                            },
                            {
                                "$ref": "#/definitions/ImageContent"
                            },
                            {
                                "$ref": "#/definitions/EmbeddedResource"
                            }
                        ]
                    },
                    "type": "array"
                },
                "isError": {
                    "description": "Whether the tool call ended in an error.\n\nIf not set, this is assumed to be false (the call was successful).",
                    "type": "boolean"
                }
            },
            "required": [
                "content"
            ],
            "type": "object"
        },
        "CancelledNotification": {
            "description": "This notification can be sent by either side to indicate that it is cancelling a previously-issued request.\n\nThe request SHOULD still be in-flight, but due to communication latency, it is always possible that this notification MAY arrive after the request has already finished.\n\nThis notification indicates that the result will be unused, so any associated processing SHOULD cease.\n\nA client MUST NOT attempt to cancel its `initialize` request.",
            "properties": {
                "method": {
                    "const": "notifications/cancelled",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "reason": {
                            "description": "An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.",
                            "type": "string"
                        },
                        "requestId": {
                            "$ref": "#/definitions/RequestId",
                            "description": "The ID of the request to cancel.\n\nThis MUST correspond to the ID of a request previously issued in the same direction."
                        }
                    },
                    "required": [
                        "requestId"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        },
        "ClientCapabilities": {
            "description": "Capabilities a client may support. Known capabilities are defined here, in this schema, but this is not a closed set: any client can define its own, additional capabilities.",
            "properties": {
                "experimental": {
                    "additionalProperties": {
                        "additionalProperties": true,
                        "properties": {},
                        "type": "object"
                    },
                    "description": "Experimental, non-standard capabilities that the client supports.",
                    "type": "object"
                },
                "roots": {
                    "description": "Present if the client supports listing roots.",
                    "properties": {
                        "listChanged": {
                            "description": "Whether the client supports notifications for changes to the roots list.",
                            "type": "boolean"
                        }
                    },
                    "type": "object"
                },
                "sampling": {
                    "additionalProperties": true,
                    "description": "Present if the client supports sampling from an LLM.",
                    "properties": {},
                    "type": "object"
                }
            },
            "type": "object"
        },
        "ClientNotification": {
            "anyOf": [
                {
                    "$ref": "#/definitions/CancelledNotification"
                },
                {
                    "$ref": "#/definitions/InitializedNotification"
                },
                {
                    "$ref": "#/definitions/ProgressNotification"
                },
                {
                    "$ref": "#/definitions/RootsListChangedNotification"
                }
            ]
        },
        "ClientRequest": {
            "anyOf": [
                {
                    "$ref": "#/definitions/InitializeRequest"
                },
                {
                    "$ref": "#/definitions/PingRequest"
                },
                {
                    "$ref": "#/definitions/ListResourcesRequest"
                },
                {
                    "$ref": "#/definitions/ReadResourceRequest"
                },
                {
                    "$ref": "#/definitions/SubscribeRequest"
                },
                {
                    "$ref": "#/definitions/UnsubscribeRequest"
                },
                {
                    "$ref": "#/definitions/ListPromptsRequest"
                },
                {
                    "$ref": "#/definitions/GetPromptRequest"
                },
                {
                    "$ref": "#/definitions/ListToolsRequest"
                },
                {
                    "$ref": "#/definitions/CallToolRequest"
                },
                {
                    "$ref": "#/definitions/SetLevelRequest"
                },
                {
                    "$ref": "#/definitions/CompleteRequest"
                }
            ]
        },
        "ClientResult": {
            "anyOf": [
                {
                    "$ref": "#/definitions/Result"
                },
                {
                    "$ref": "#/definitions/CreateMessageResult"
                },
                {
                    "$ref": "#/definitions/ListRootsResult"
                }
            ]
        },
        "CompleteRequest": {
            "description": "A request from the client to the server, to ask for completion options.",
            "properties": {
                "method": {
                    "const": "completion/complete",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "argument": {
                            "description": "The argument's information",
                            "properties": {
                                "name": {
                                    "description": "The name of the argument",
                                    "type": "string"
                                },
                                "value": {
                                    "description": "The value of the argument to use for completion matching.",
                                    "type": "string"
                                }
                            },
                            "required": [
                                "name",
                                "value"
                            ],
                            "type": "object"
                        },
                        "ref": {
                            "anyOf": [
                                {
                                    "$ref": "#/definitions/PromptReference"
                                },
                                {
                                    "$ref": "#/definitions/ResourceReference"
                                }
                            ]
                        }
                    },
                    "required": [
                        "argument",
                        "ref"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        },
        "CompleteResult": {
            "description": "The server's response to a completion/complete request",
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                },
                "completion": {
                    "properties": {
                        "hasMore": {
                            "description": "Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.",
                            "type": "boolean"
                        },
                        "total": {
                            "description": "The total number of completion options available. This can exceed the number of values actually sent in the response.",
                            "type": "integer"
                        },
                        "values": {
                            "description": "An array of completion values. Must not exceed 100 items.",
                            "items": {
                                "type": "string"
                            },
                            "type": "array"
                        }
                    },
                    "required": [
                        "values"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "completion"
            ],
            "type": "object"
        },
        "CreateMessageRequest": {
            "description": "A request from the server to sample an LLM via the client. The client has full discretion over which model to select. The client should also inform the user before beginning sampling, to allow them to inspect the request (human in the loop) and decide whether to approve it.",
            "properties": {
                "method": {
                    "const": "sampling/createMessage",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "includeContext": {
                            "description": "A request to include context from one or more MCP servers (including the caller), to be attached to the prompt. The client MAY ignore this request.",
                            "enum": [
                                "allServers",
                                "none",
                                "thisServer"
                            ],
                            "type": "string"
                        },
                        "maxTokens": {
                            "description": "The maximum number of tokens to sample, as requested by the server. The client MAY choose to sample fewer tokens than requested.",
                            "type": "integer"
                        },
                        "messages": {
                            "items": {
                                "$ref": "#/definitions/SamplingMessage"
                            },
                            "type": "array"
                        },
                        "metadata": {
                            "additionalProperties": true,
                            "description": "Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.",
                            "properties": {},
                            "type": "object"
                        },
                        "modelPreferences": {
                            "$ref": "#/definitions/ModelPreferences",
                            "description": "The server's preferences for which model to select. The client MAY ignore these preferences."
                        },
                        "stopSequences": {
                            "items": {
                                "type": "string"
                            },
                            "type": "array"
                        },
                        "systemPrompt": {
                            "description": "An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.",
                            "type": "string"
                        },
                        "temperature": {
                            "type": "number"
                        }
                    },
                    "required": [
                        "maxTokens",
                        "messages"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        },
        "CreateMessageResult": {
            "description": "The client's response to a sampling/create_message request from the server. The client should inform the user before returning the sampled message, to allow them to inspect the response (human in the loop) and decide whether to allow the server to see it.",
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                },
                "content": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/TextContent"
                        },
                        {
                            "$ref": "#/definitions/ImageContent"
                        }
                    ]
                },
                "model": {
                    "description": "The name of the model that generated the message.",
                    "type": "string"
                },
                "role": {
                    "$ref": "#/definitions/Role"
                },
                "stopReason": {
                    "description": "The reason why sampling stopped, if known.",
                    "type": "string"
                }
            },
            "required": [
                "content",
                "model",
                "role"
            ],
            "type": "object"
        },
        "Cursor": {
            "description": "An opaque token used to represent a cursor for pagination.",
            "type": "string"
        },
        "EmbeddedResource": {
            "description": "The contents of a resource, embedded into a prompt or tool call result.\n\nIt is up to the client how best to render embedded resources for the benefit\nof the LLM and/or the user.",
            "properties": {
                "annotations": {
                    "properties": {
                        "audience": {
                            "description": "Describes who the intended customer of this object or data is.\n\nIt can include multiple entries to indicate content useful for multiple audiences (e.g., `[\"user\", \"assistant\"]`).",
                            "items": {
                                "$ref": "#/definitions/Role"
                            },
                            "type": "array"
                        },
                        "priority": {
                            "description": "Describes how important this data is for operating the server.\n\nA value of 1 means \"most important,\" and indicates that the data is\neffectively required, while 0 means \"least important,\" and indicates that\nthe data is entirely optional.",
                            "maximum": 1,
                            "minimum": 0,
                            "type": "number"
                        }
                    },
                    "type": "object"
                },
                "resource": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/TextResourceContents"
                        },
                        {
                            "$ref": "#/definitions/BlobResourceContents"
                        }
                    ]
                },
                "type": {
                    "const": "resource",
                    "type": "string"
                }
            },
            "required": [
                "resource",
                "type"
            ],
            "type": "object"
        },
        "EmptyResult": {
            "$ref": "#/definitions/Result"
        },
        "GetPromptRequest": {
            "description": "Used by the client to get a prompt provided by the server.",
            "properties": {
                "method": {
                    "const": "prompts/get",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "arguments": {
                            "additionalProperties": {
                                "type": "string"
                            },
                            "description": "Arguments to use for templating the prompt.",
                            "type": "object"
                        },
                        "name": {
                            "description": "The name of the prompt or prompt template.",
                            "type": "string"
                        }
                    },
                    "required": [
                        "name"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        },
        "GetPromptResult": {
            "description": "The server's response to a prompts/get request from the client.",
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                },
                "description": {
                    "description": "An optional description for the prompt.",
                    "type": "string"
                },
                "messages": {
                    "items": {
                        "$ref": "#/definitions/PromptMessage"
                    },
                    "type": "array"
                }
            },
            "required": [
                "messages"
            ],
            "type": "object"
        },
        "ImageContent": {
            "description": "An image provided to or from an LLM.",
            "properties": {
                "annotations": {
                    "properties": {
                        "audience": {
                            "description": "Describes who the intended customer of this object or data is.\n\nIt can include multiple entries to indicate content useful for multiple audiences (e.g., `[\"user\", \"assistant\"]`).",
                            "items": {
                                "$ref": "#/definitions/Role"
                            },
                            "type": "array"
                        },
                        "priority": {
                            "description": "Describes how important this data is for operating the server.\n\nA value of 1 means \"most important,\" and indicates that the data is\neffectively required, while 0 means \"least important,\" and indicates that\nthe data is entirely optional.",
                            "maximum": 1,
                            "minimum": 0,
                            "type": "number"
                        }
                    },
                    "type": "object"
                },
                "data": {
                    "description": "The base64-encoded image data.",
                    "format": "byte",
                    "type": "string"
                },
                "mimeType": {
                    "description": "The MIME type of the image. Different providers may support different image types.",
                    "type": "string"
                },
                "type": {
                    "const": "image",
                    "type": "string"
                }
            },
            "required": [
                "data",
                "mimeType",
                "type"
            ],
            "type": "object"
        },
        "Implementation": {
            "description": "Describes the name and version of an MCP implementation.",
            "properties": {
                "name": {
                    "type": "string"
                },
                "version": {
                    "type": "string"
                }
            },
            "required": [
                "name",
                "version"
            ],
            "type": "object"
        },
        "InitializeRequest": {
            "description": "This request is sent from the client to the server when it first connects, asking it to begin initialization.",
            "properties": {
                "method": {
                    "const": "initialize",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "capabilities": {
                            "$ref": "#/definitions/ClientCapabilities"
                        },
                        "clientInfo": {
                            "$ref": "#/definitions/Implementation"
                        },
                        "protocolVersion": {
                            "description": "The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.",
                            "type": "string"
                        }
                    },
                    "required": [
                        "capabilities",
                        "clientInfo",
                        "protocolVersion"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        },
        "InitializeResult": {
            "description": "After receiving an initialize request from the client, the server sends this response.",
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                },
                "capabilities": {
                    "$ref": "#/definitions/ServerCapabilities"
                },
                "instructions": {
                    "description": "Instructions describing how to use the server and its features.\n\nThis can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a \"hint\" to the model. For example, this information MAY be added to the system prompt.",
                    "type": "string"
                },
                "protocolVersion": {
                    "description": "The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.",
                    "type": "string"
                },
                "serverInfo": {
                    "$ref": "#/definitions/Implementation"
                }
            },
            "required": [
                "capabilities",
                "protocolVersion",
                "serverInfo"
            ],
            "type": "object"
        },
        "InitializedNotification": {
            "description": "This notification is sent from the client to the server after initialization has finished.",
            "properties": {
                "method": {
                    "const": "notifications/initialized",
                    "type": "string"
                },
                "params": {
                    "additionalProperties": {},
                    "properties": {
                        "_meta": {
                            "additionalProperties": {},
                            "description": "This parameter name is reserved by MCP to allow clients and servers to attach additional metadata to their notifications.",
                            "type": "object"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "JSONRPCError": {
            "description": "A response to a request that indicates an error occurred.",
            "properties": {
                "error": {
                    "properties": {
                        "code": {
                            "description": "The error type that occurred.",
                            "type": "integer"
                        },
                        "data": {
                            "description": "Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.)."
                        },
                        "message": {
                            "description": "A short description of the error. The message SHOULD be limited to a concise single sentence.",
                            "type": "string"
                        }
                    },
                    "required": [
                        "code",
                        "message"
                    ],
                    "type": "object"
                },
                "id": {
                    "$ref": "#/definitions/RequestId"
                },
                "jsonrpc": {
                    "const": "2.0",
                    "type": "string"
                }
            },
            "required": [
                "error",
                "id",
                "jsonrpc"
            ],
            "type": "object"
        },
        "JSONRPCMessage": {
            "anyOf": [
                {
                    "$ref": "#/definitions/JSONRPCRequest"
                },
                {
                    "$ref": "#/definitions/JSONRPCNotification"
                },
                {
                    "$ref": "#/definitions/JSONRPCResponse"
                },
                {
                    "$ref": "#/definitions/JSONRPCError"
                }
            ]
        },
        "JSONRPCNotification": {
            "description": "A notification which does not expect a response.",
            "properties": {
                "jsonrpc": {
                    "const": "2.0",
                    "type": "string"
                },
                "method": {
                    "type": "string"
                },
                "params": {
                    "additionalProperties": {},
                    "properties": {
                        "_meta": {
                            "additionalProperties": {},
                            "description": "This parameter name is reserved by MCP to allow clients and servers to attach additional metadata to their notifications.",
                            "type": "object"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "jsonrpc",
                "method"
            ],
            "type": "object"
        },
        "JSONRPCRequest": {
            "description": "A request that expects a response.",
            "properties": {
                "id": {
                    "$ref": "#/definitions/RequestId"
                },
                "jsonrpc": {
                    "const": "2.0",
                    "type": "string"
                },
                "method": {
                    "type": "string"
                },
                "params": {
                    "additionalProperties": {},
                    "properties": {
                        "_meta": {
                            "properties": {
                                "progressToken": {
                                    "$ref": "#/definitions/ProgressToken",
                                    "description": "If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications."
                                }
                            },
                            "type": "object"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "id",
                "jsonrpc",
                "method"
            ],
            "type": "object"
        },
        "JSONRPCResponse": {
            "description": "A successful (non-error) response to a request.",
            "properties": {
                "id": {
                    "$ref": "#/definitions/RequestId"
                },
                "jsonrpc": {
                    "const": "2.0",
                    "type": "string"
                },
                "result": {
                    "$ref": "#/definitions/Result"
                }
            },
            "required": [
                "id",
                "jsonrpc",
                "result"
            ],
            "type": "object"
        },
        "ListPromptsRequest": {
            "description": "Sent from the client to request a list of prompts and prompt templates the server has.",
            "properties": {
                "method": {
                    "const": "prompts/list",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "cursor": {
                            "description": "An opaque token representing the current pagination position.\nIf provided, the server should return results starting after this cursor.",
                            "type": "string"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "ListPromptsResult": {
            "description": "The server's response to a prompts/list request from the client.",
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                },
                "nextCursor": {
                    "description": "An opaque token representing the pagination position after the last returned result.\nIf present, there may be more results available.",
                    "type": "string"
                },
                "prompts": {
                    "items": {
                        "$ref": "#/definitions/Prompt"
                    },
                    "type": "array"
                }
            },
            "required": [
                "prompts"
            ],
            "type": "object"
        },
        "ListResourceTemplatesRequest": {
            "description": "Sent from the client to request a list of resource templates the server has.",
            "properties": {
                "method": {
                    "const": "resources/templates/list",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "cursor": {
                            "description": "An opaque token representing the current pagination position.\nIf provided, the server should return results starting after this cursor.",
                            "type": "string"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "ListResourceTemplatesResult": {
            "description": "The server's response to a resources/templates/list request from the client.",
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                },
                "nextCursor": {
                    "description": "An opaque token representing the pagination position after the last returned result.\nIf present, there may be more results available.",
                    "type": "string"
                },
                "resourceTemplates": {
                    "items": {
                        "$ref": "#/definitions/ResourceTemplate"
                    },
                    "type": "array"
                }
            },
            "required": [
                "resourceTemplates"
            ],
            "type": "object"
        },
        "ListResourcesRequest": {
            "description": "Sent from the client to request a list of resources the server has.",
            "properties": {
                "method": {
                    "const": "resources/list",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "cursor": {
                            "description": "An opaque token representing the current pagination position.\nIf provided, the server should return results starting after this cursor.",
                            "type": "string"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "ListResourcesResult": {
            "description": "The server's response to a resources/list request from the client.",
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                },
                "nextCursor": {
                    "description": "An opaque token representing the pagination position after the last returned result.\nIf present, there may be more results available.",
                    "type": "string"
                },
                "resources": {
                    "items": {
                        "$ref": "#/definitions/Resource"
                    },
                    "type": "array"
                }
            },
            "required": [
                "resources"
            ],
            "type": "object"
        },
        "ListRootsRequest": {
            "description": "Sent from the server to request a list of root URIs from the client. Roots allow\nservers to ask for specific directories or files to operate on. A common example\nfor roots is providing a set of repositories or directories a server should operate\non.\n\nThis request is typically used when the server needs to understand the file system\nstructure or access specific locations that the client has permission to read from.",
            "properties": {
                "method": {
                    "const": "roots/list",
                    "type": "string"
                },
                "params": {
                    "additionalProperties": {},
                    "properties": {
                        "_meta": {
                            "properties": {
                                "progressToken": {
                                    "$ref": "#/definitions/ProgressToken",
                                    "description": "If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications."
                                }
                            },
                            "type": "object"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "ListRootsResult": {
            "description": "The client's response to a roots/list request from the server.\nThis result contains an array of Root objects, each representing a root directory\nor file that the server can operate on.",
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                },
                "roots": {
                    "items": {
                        "$ref": "#/definitions/Root"
                    },
                    "type": "array"
                }
            },
            "required": [
                "roots"
            ],
            "type": "object"
        },
        "ListToolsRequest": {
            "description": "Sent from the client to request a list of tools the server has.",
            "properties": {
                "method": {
                    "const": "tools/list",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "cursor": {
                            "description": "An opaque token representing the current pagination position.\nIf provided, the server should return results starting after this cursor.",
                            "type": "string"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "ListToolsResult": {
            "description": "The server's response to a tools/list request from the client.",
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                },
                "nextCursor": {
                    "description": "An opaque token representing the pagination position after the last returned result.\nIf present, there may be more results available.",
                    "type": "string"
                },
                "tools": {
                    "items": {
                        "$ref": "#/definitions/Tool"
                    },
                    "type": "array"
                }
            },
            "required": [
                "tools"
            ],
            "type": "object"
        },
        "LoggingLevel": {
            "description": "The severity of a log message.\n\nThese map to syslog message severities, as specified in RFC-5424:\nhttps://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1",
            "enum": [
                "alert",
                "critical",
                "debug",
                "emergency",
                "error",
                "info",
                "notice",
                "warning"
            ],
            "type": "string"
        },
        "LoggingMessageNotification": {
            "description": "Notification of a log message passed from server to client. If no logging/setLevel request has been sent from the client, the server MAY decide which messages to send automatically.",
            "properties": {
                "method": {
                    "const": "notifications/message",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "data": {
                            "description": "The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here."
                        },
                        "level": {
                            "$ref": "#/definitions/LoggingLevel",
                            "description": "The severity of this log message."
                        },
                        "logger": {
                            "description": "An optional name of the logger issuing this message.",
                            "type": "string"
                        }
                    },
                    "required": [
                        "data",
                        "level"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        },
        "ModelHint": {
            "description": "Hints to use for model selection.\n\nKeys not declared here are currently left unspecified by the spec and are up\nto the client to interpret.",
            "properties": {
                "name": {
                    "description": "A hint for a model name.\n\nThe client SHOULD treat this as a substring of a model name; for example:\n - `claude-3-5-sonnet` should match `claude-3-5-sonnet-20241022`\n - `sonnet` should match `claude-3-5-sonnet-20241022`, `claude-3-sonnet-20240229`, etc.\n - `claude` should match any Claude model\n\nThe client MAY also map the string to a different provider's model name or a different model family, as long as it fills a similar niche; for example:\n - `gemini-1.5-flash` could match `claude-3-haiku-20240307`",
                    "type": "string"
                }
            },
            "type": "object"
        },
        "ModelPreferences": {
            "description": "The server's preferences for model selection, requested of the client during sampling.\n\nBecause LLMs can vary along multiple dimensions, choosing the \"best\" model is\nrarely straightforward.  Different models excel in different areas—some are\nfaster but less capable, others are more capable but more expensive, and so\non. This interface allows servers to express their priorities across multiple\ndimensions to help clients make an appropriate selection for their use case.\n\nThese preferences are always advisory. The client MAY ignore them. It is also\nup to the client to decide how to interpret these preferences and how to\nbalance them against other considerations.",
            "properties": {
                "costPriority": {
                    "description": "How much to prioritize cost when selecting a model. A value of 0 means cost\nis not important, while a value of 1 means cost is the most important\nfactor.",
                    "maximum": 1,
                    "minimum": 0,
                    "type": "number"
                },
                "hints": {
                    "description": "Optional hints to use for model selection.\n\nIf multiple hints are specified, the client MUST evaluate them in order\n(such that the first match is taken).\n\nThe client SHOULD prioritize these hints over the numeric priorities, but\nMAY still use the priorities to select from ambiguous matches.",
                    "items": {
                        "$ref": "#/definitions/ModelHint"
                    },
                    "type": "array"
                },
                "intelligencePriority": {
                    "description": "How much to prioritize intelligence and capabilities when selecting a\nmodel. A value of 0 means intelligence is not important, while a value of 1\nmeans intelligence is the most important factor.",
                    "maximum": 1,
                    "minimum": 0,
                    "type": "number"
                },
                "speedPriority": {
                    "description": "How much to prioritize sampling speed (latency) when selecting a model. A\nvalue of 0 means speed is not important, while a value of 1 means speed is\nthe most important factor.",
                    "maximum": 1,
                    "minimum": 0,
                    "type": "number"
                }
            },
            "type": "object"
        },
        "Notification": {
            "properties": {
                "method": {
                    "type": "string"
                },
                "params": {
                    "additionalProperties": {},
                    "properties": {
                        "_meta": {
                            "additionalProperties": {},
                            "description": "This parameter name is reserved by MCP to allow clients and servers to attach additional metadata to their notifications.",
                            "type": "object"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "PaginatedRequest": {
            "properties": {
                "method": {
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "cursor": {
                            "description": "An opaque token representing the current pagination position.\nIf provided, the server should return results starting after this cursor.",
                            "type": "string"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "PaginatedResult": {
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                },
                "nextCursor": {
                    "description": "An opaque token representing the pagination position after the last returned result.\nIf present, there may be more results available.",
                    "type": "string"
                }
            },
            "type": "object"
        },
        "PingRequest": {
            "description": "A ping, issued by either the server or the client, to check that the other party is still alive. The receiver must promptly respond, or else may be disconnected.",
            "properties": {
                "method": {
                    "const": "ping",
                    "type": "string"
                },
                "params": {
                    "additionalProperties": {},
                    "properties": {
                        "_meta": {
                            "properties": {
                                "progressToken": {
                                    "$ref": "#/definitions/ProgressToken",
                                    "description": "If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications."
                                }
                            },
                            "type": "object"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "ProgressNotification": {
            "description": "An out-of-band notification used to inform the receiver of a progress update for a long-running request.",
            "properties": {
                "method": {
                    "const": "notifications/progress",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "progress": {
                            "description": "The progress thus far. This should increase every time progress is made, even if the total is unknown.",
                            "type": "number"
                        },
                        "progressToken": {
                            "$ref": "#/definitions/ProgressToken",
                            "description": "The progress token which was given in the initial request, used to associate this notification with the request that is proceeding."
                        },
                        "total": {
                            "description": "Total number of items to process (or total progress required), if known.",
                            "type": "number"
                        }
                    },
                    "required": [
                        "progress",
                        "progressToken"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        },
        "ProgressToken": {
            "description": "A progress token, used to associate progress notifications with the original request.",
            "type": [
                "string",
                "integer"
            ]
        },
        "Prompt": {
            "description": "A prompt or prompt template that the server offers.",
            "properties": {
                "arguments": {
                    "description": "A list of arguments to use for templating the prompt.",
                    "items": {
                        "$ref": "#/definitions/PromptArgument"
                    },
                    "type": "array"
                },
                "description": {
                    "description": "An optional description of what this prompt provides",
                    "type": "string"
                },
                "name": {
                    "description": "The name of the prompt or prompt template.",
                    "type": "string"
                }
            },
            "required": [
                "name"
            ],
            "type": "object"
        },
        "PromptArgument": {
            "description": "Describes an argument that a prompt can accept.",
            "properties": {
                "description": {
                    "description": "A human-readable description of the argument.",
                    "type": "string"
                },
                "name": {
                    "description": "The name of the argument.",
                    "type": "string"
                },
                "required": {
                    "description": "Whether this argument must be provided.",
                    "type": "boolean"
                }
            },
            "required": [
                "name"
            ],
            "type": "object"
        },
        "PromptListChangedNotification": {
            "description": "An optional notification from the server to the client, informing it that the list of prompts it offers has changed. This may be issued by servers without any previous subscription from the client.",
            "properties": {
                "method": {
                    "const": "notifications/prompts/list_changed",
                    "type": "string"
                },
                "params": {
                    "additionalProperties": {},
                    "properties": {
                        "_meta": {
                            "additionalProperties": {},
                            "description": "This parameter name is reserved by MCP to allow clients and servers to attach additional metadata to their notifications.",
                            "type": "object"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "PromptMessage": {
            "description": "Describes a message returned as part of a prompt.\n\nThis is similar to `SamplingMessage`, but also supports the embedding of\nresources from the MCP server.",
            "properties": {
                "content": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/TextContent"
                        },
                        {
                            "$ref": "#/definitions/ImageContent"
                        },
                        {
                            "$ref": "#/definitions/EmbeddedResource"
                        }
                    ]
                },
                "role": {
                    "$ref": "#/definitions/Role"
                }
            },
            "required": [
                "content",
                "role"
            ],
            "type": "object"
        },
        "PromptReference": {
            "description": "Identifies a prompt.",
            "properties": {
                "name": {
                    "description": "The name of the prompt or prompt template",
                    "type": "string"
                },
                "type": {
                    "const": "ref/prompt",
                    "type": "string"
                }
            },
            "required": [
                "name",
                "type"
            ],
            "type": "object"
        },
        "ReadResourceRequest": {
            "description": "Sent from the client to the server, to read a specific resource URI.",
            "properties": {
                "method": {
                    "const": "resources/read",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "uri": {
                            "description": "The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.",
                            "format": "uri",
                            "type": "string"
                        }
                    },
                    "required": [
                        "uri"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        },
        "ReadResourceResult": {
            "description": "The server's response to a resources/read request from the client.",
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                },
                "contents": {
                    "items": {
                        "anyOf": [
                            {
                                "$ref": "#/definitions/TextResourceContents"
                            },
                            {
                                "$ref": "#/definitions/BlobResourceContents"
                            }
                        ]
                    },
                    "type": "array"
                }
            },
            "required": [
                "contents"
            ],
            "type": "object"
        },
        "Request": {
            "properties": {
                "method": {
                    "type": "string"
                },
                "params": {
                    "additionalProperties": {},
                    "properties": {
                        "_meta": {
                            "properties": {
                                "progressToken": {
                                    "$ref": "#/definitions/ProgressToken",
                                    "description": "If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications."
                                }
                            },
                            "type": "object"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "RequestId": {
            "description": "A uniquely identifying ID for a request in JSON-RPC.",
            "type": [
                "string",
                "integer"
            ]
        },
        "Resource": {
            "description": "A known resource that the server is capable of reading.",
            "properties": {
                "annotations": {
                    "properties": {
                        "audience": {
                            "description": "Describes who the intended customer of this object or data is.\n\nIt can include multiple entries to indicate content useful for multiple audiences (e.g., `[\"user\", \"assistant\"]`).",
                            "items": {
                                "$ref": "#/definitions/Role"
                            },
                            "type": "array"
                        },
                        "priority": {
                            "description": "Describes how important this data is for operating the server.\n\nA value of 1 means \"most important,\" and indicates that the data is\neffectively required, while 0 means \"least important,\" and indicates that\nthe data is entirely optional.",
                            "maximum": 1,
                            "minimum": 0,
                            "type": "number"
                        }
                    },
                    "type": "object"
                },
                "description": {
                    "description": "A description of what this resource represents.\n\nThis can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a \"hint\" to the model.",
                    "type": "string"
                },
                "mimeType": {
                    "description": "The MIME type of this resource, if known.",
                    "type": "string"
                },
                "name": {
                    "description": "A human-readable name for this resource.\n\nThis can be used by clients to populate UI elements.",
                    "type": "string"
                },
                "uri": {
                    "description": "The URI of this resource.",
                    "format": "uri",
                    "type": "string"
                }
            },
            "required": [
                "name",
                "uri"
            ],
            "type": "object"
        },
        "ResourceContents": {
            "description": "The contents of a specific resource or sub-resource.",
            "properties": {
                "mimeType": {
                    "description": "The MIME type of this resource, if known.",
                    "type": "string"
                },
                "uri": {
                    "description": "The URI of this resource.",
                    "format": "uri",
                    "type": "string"
                }
            },
            "required": [
                "uri"
            ],
            "type": "object"
        },
        "ResourceListChangedNotification": {
            "description": "An optional notification from the server to the client, informing it that the list of resources it can read from has changed. This may be issued by servers without any previous subscription from the client.",
            "properties": {
                "method": {
                    "const": "notifications/resources/list_changed",
                    "type": "string"
                },
                "params": {
                    "additionalProperties": {},
                    "properties": {
                        "_meta": {
                            "additionalProperties": {},
                            "description": "This parameter name is reserved by MCP to allow clients and servers to attach additional metadata to their notifications.",
                            "type": "object"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "ResourceReference": {
            "description": "A reference to a resource or resource template definition.",
            "properties": {
                "type": {
                    "const": "ref/resource",
                    "type": "string"
                },
                "uri": {
                    "description": "The URI or URI template of the resource.",
                    "format": "uri-template",
                    "type": "string"
                }
            },
            "required": [
                "type",
                "uri"
            ],
            "type": "object"
        },
        "ResourceTemplate": {
            "description": "A template description for resources available on the server.",
            "properties": {
                "annotations": {
                    "properties": {
                        "audience": {
                            "description": "Describes who the intended customer of this object or data is.\n\nIt can include multiple entries to indicate content useful for multiple audiences (e.g., `[\"user\", \"assistant\"]`).",
                            "items": {
                                "$ref": "#/definitions/Role"
                            },
                            "type": "array"
                        },
                        "priority": {
                            "description": "Describes how important this data is for operating the server.\n\nA value of 1 means \"most important,\" and indicates that the data is\neffectively required, while 0 means \"least important,\" and indicates that\nthe data is entirely optional.",
                            "maximum": 1,
                            "minimum": 0,
                            "type": "number"
                        }
                    },
                    "type": "object"
                },
                "description": {
                    "description": "A description of what this template is for.\n\nThis can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a \"hint\" to the model.",
                    "type": "string"
                },
                "mimeType": {
                    "description": "The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.",
                    "type": "string"
                },
                "name": {
                    "description": "A human-readable name for the type of resource this template refers to.\n\nThis can be used by clients to populate UI elements.",
                    "type": "string"
                },
                "uriTemplate": {
                    "description": "A URI template (according to RFC 6570) that can be used to construct resource URIs.",
                    "format": "uri-template",
                    "type": "string"
                }
            },
            "required": [
                "name",
                "uriTemplate"
            ],
            "type": "object"
        },
        "ResourceUpdatedNotification": {
            "description": "A notification from the server to the client, informing it that a resource has changed and may need to be read again. This should only be sent if the client previously sent a resources/subscribe request.",
            "properties": {
                "method": {
                    "const": "notifications/resources/updated",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "uri": {
                            "description": "The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.",
                            "format": "uri",
                            "type": "string"
                        }
                    },
                    "required": [
                        "uri"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        },
        "Result": {
            "additionalProperties": {},
            "properties": {
                "_meta": {
                    "additionalProperties": {},
                    "description": "This result property is reserved by the protocol to allow clients and servers to attach additional metadata to their responses.",
                    "type": "object"
                }
            },
            "type": "object"
        },
        "Role": {
            "description": "The sender or recipient of messages and data in a conversation.",
            "enum": [
                "assistant",
                "user"
            ],
            "type": "string"
        },
        "Root": {
            "description": "Represents a root directory or file that the server can operate on.",
            "properties": {
                "name": {
                    "description": "An optional name for the root. This can be used to provide a human-readable\nidentifier for the root, which may be useful for display purposes or for\nreferencing the root in other parts of the application.",
                    "type": "string"
                },
                "uri": {
                    "description": "The URI identifying the root. This *must* start with file:// for now.\nThis restriction may be relaxed in future versions of the protocol to allow\nother URI schemes.",
                    "format": "uri",
                    "type": "string"
                }
            },
            "required": [
                "uri"
            ],
            "type": "object"
        },
        "RootsListChangedNotification": {
            "description": "A notification from the client to the server, informing it that the list of roots has changed.\nThis notification should be sent whenever the client adds, removes, or modifies any root.\nThe server should then request an updated list of roots using the ListRootsRequest.",
            "properties": {
                "method": {
                    "const": "notifications/roots/list_changed",
                    "type": "string"
                },
                "params": {
                    "additionalProperties": {},
                    "properties": {
                        "_meta": {
                            "additionalProperties": {},
                            "description": "This parameter name is reserved by MCP to allow clients and servers to attach additional metadata to their notifications.",
                            "type": "object"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "SamplingMessage": {
            "description": "Describes a message issued to or received from an LLM API.",
            "properties": {
                "content": {
                    "anyOf": [
                        {
                            "$ref": "#/definitions/TextContent"
                        },
                        {
                            "$ref": "#/definitions/ImageContent"
                        }
                    ]
                },
                "role": {
                    "$ref": "#/definitions/Role"
                }
            },
            "required": [
                "content",
                "role"
            ],
            "type": "object"
        },
        "ServerCapabilities": {
            "description": "Capabilities that a server may support. Known capabilities are defined here, in this schema, but this is not a closed set: any server can define its own, additional capabilities.",
            "properties": {
                "experimental": {
                    "additionalProperties": {
                        "additionalProperties": true,
                        "properties": {},
                        "type": "object"
                    },
                    "description": "Experimental, non-standard capabilities that the server supports.",
                    "type": "object"
                },
                "logging": {
                    "additionalProperties": true,
                    "description": "Present if the server supports sending log messages to the client.",
                    "properties": {},
                    "type": "object"
                },
                "prompts": {
                    "description": "Present if the server offers any prompt templates.",
                    "properties": {
                        "listChanged": {
                            "description": "Whether this server supports notifications for changes to the prompt list.",
                            "type": "boolean"
                        }
                    },
                    "type": "object"
                },
                "resources": {
                    "description": "Present if the server offers any resources to read.",
                    "properties": {
                        "listChanged": {
                            "description": "Whether this server supports notifications for changes to the resource list.",
                            "type": "boolean"
                        },
                        "subscribe": {
                            "description": "Whether this server supports subscribing to resource updates.",
                            "type": "boolean"
                        }
                    },
                    "type": "object"
                },
                "tools": {
                    "description": "Present if the server offers any tools to call.",
                    "properties": {
                        "listChanged": {
                            "description": "Whether this server supports notifications for changes to the tool list.",
                            "type": "boolean"
                        }
                    },
                    "type": "object"
                }
            },
            "type": "object"
        },
        "ServerNotification": {
            "anyOf": [
                {
                    "$ref": "#/definitions/CancelledNotification"
                },
                {
                    "$ref": "#/definitions/ProgressNotification"
                },
                {
                    "$ref": "#/definitions/ResourceListChangedNotification"
                },
                {
                    "$ref": "#/definitions/ResourceUpdatedNotification"
                },
                {
                    "$ref": "#/definitions/PromptListChangedNotification"
                },
                {
                    "$ref": "#/definitions/ToolListChangedNotification"
                },
                {
                    "$ref": "#/definitions/LoggingMessageNotification"
                }
            ]
        },
        "ServerRequest": {
            "anyOf": [
                {
                    "$ref": "#/definitions/PingRequest"
                },
                {
                    "$ref": "#/definitions/CreateMessageRequest"
                },
                {
                    "$ref": "#/definitions/ListRootsRequest"
                }
            ]
        },
        "ServerResult": {
            "anyOf": [
                {
                    "$ref": "#/definitions/Result"
                },
                {
                    "$ref": "#/definitions/InitializeResult"
                },
                {
                    "$ref": "#/definitions/ListResourcesResult"
                },
                {
                    "$ref": "#/definitions/ReadResourceResult"
                },
                {
                    "$ref": "#/definitions/ListPromptsResult"
                },
                {
                    "$ref": "#/definitions/GetPromptResult"
                },
                {
                    "$ref": "#/definitions/ListToolsResult"
                },
                {
                    "$ref": "#/definitions/CallToolResult"
                },
                {
                    "$ref": "#/definitions/CompleteResult"
                }
            ]
        },
        "SetLevelRequest": {
            "description": "A request from the client to the server, to enable or adjust logging.",
            "properties": {
                "method": {
                    "const": "logging/setLevel",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "level": {
                            "$ref": "#/definitions/LoggingLevel",
                            "description": "The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message."
                        }
                    },
                    "required": [
                        "level"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        },
        "SubscribeRequest": {
            "description": "Sent from the client to request resources/updated notifications from the server whenever a particular resource changes.",
            "properties": {
                "method": {
                    "const": "resources/subscribe",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "uri": {
                            "description": "The URI of the resource to subscribe to. The URI can use any protocol; it is up to the server how to interpret it.",
                            "format": "uri",
                            "type": "string"
                        }
                    },
                    "required": [
                        "uri"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        },
        "TextContent": {
            "description": "Text provided to or from an LLM.",
            "properties": {
                "annotations": {
                    "properties": {
                        "audience": {
                            "description": "Describes who the intended customer of this object or data is.\n\nIt can include multiple entries to indicate content useful for multiple audiences (e.g., `[\"user\", \"assistant\"]`).",
                            "items": {
                                "$ref": "#/definitions/Role"
                            },
                            "type": "array"
                        },
                        "priority": {
                            "description": "Describes how important this data is for operating the server.\n\nA value of 1 means \"most important,\" and indicates that the data is\neffectively required, while 0 means \"least important,\" and indicates that\nthe data is entirely optional.",
                            "maximum": 1,
                            "minimum": 0,
                            "type": "number"
                        }
                    },
                    "type": "object"
                },
                "text": {
                    "description": "The text content of the message.",
                    "type": "string"
                },
                "type": {
                    "const": "text",
                    "type": "string"
                }
            },
            "required": [
                "text",
                "type"
            ],
            "type": "object"
        },
        "TextResourceContents": {
            "properties": {
                "mimeType": {
                    "description": "The MIME type of this resource, if known.",
                    "type": "string"
                },
                "text": {
                    "description": "The text of the item. This must only be set if the item can actually be represented as text (not binary data).",
                    "type": "string"
                },
                "uri": {
                    "description": "The URI of this resource.",
                    "format": "uri",
                    "type": "string"
                }
            },
            "required": [
                "text",
                "uri"
            ],
            "type": "object"
        },
        "Tool": {
            "description": "Definition for a tool the client can call.",
            "properties": {
                "description": {
                    "description": "A human-readable description of the tool.",
                    "type": "string"
                },
                "inputSchema": {
                    "description": "A JSON Schema object defining the expected parameters for the tool.",
                    "properties": {
                        "properties": {
                            "additionalProperties": {
                                "additionalProperties": true,
                                "properties": {},
                                "type": "object"
                            },
                            "type": "object"
                        },
                        "type": {
                            "const": "object",
                            "type": "string"
                        }
                    },
                    "required": [
                        "type"
                    ],
                    "type": "object"
                },
                "name": {
                    "description": "The name of the tool.",
                    "type": "string"
                }
            },
            "required": [
                "inputSchema",
                "name"
            ],
            "type": "object"
        },
        "ToolListChangedNotification": {
            "description": "An optional notification from the server to the client, informing it that the list of tools it offers has changed. This may be issued by servers without any previous subscription from the client.",
            "properties": {
                "method": {
                    "const": "notifications/tools/list_changed",
                    "type": "string"
                },
                "params": {
                    "additionalProperties": {},
                    "properties": {
                        "_meta": {
                            "additionalProperties": {},
                            "description": "This parameter name is reserved by MCP to allow clients and servers to attach additional metadata to their notifications.",
                            "type": "object"
                        }
                    },
                    "type": "object"
                }
            },
            "required": [
                "method"
            ],
            "type": "object"
        },
        "UnsubscribeRequest": {
            "description": "Sent from the client to request cancellation of resources/updated notifications from the server. This should follow a previous resources/subscribe request.",
            "properties": {
                "method": {
                    "const": "resources/unsubscribe",
                    "type": "string"
                },
                "params": {
                    "properties": {
                        "uri": {
                            "description": "The URI of the resource to unsubscribe from.",
                            "format": "uri",
                            "type": "string"
                        }
                    },
                    "required": [
                        "uri"
                    ],
                    "type": "object"
                }
            },
            "required": [
                "method",
                "params"
            ],
            "type": "object"
        }
    }
}



---
File: /federated-mcp-main/src/tests/federation.test.ts
---

import { assertEquals } from "https://deno.land/std@0.224.0/testing/asserts.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { FederationProxy } from "../packages/proxy/federation.ts";
import { FederationConfig } from "../packages/core/types.ts";

const TEST_SECRET = "test-secret-key";
const WS_PORT = 3000;

async function setupMockServer() {
  const ac = new AbortController();
  const { signal } = ac;

  const handler = async (req: Request): Promise<Response> => {
    if (req.headers.get("upgrade") === "websocket") {
      const { socket, response } = Deno.upgradeWebSocket(req);
      socket.onopen = () => {
        console.log("WebSocket connected");
      };
      socket.onclose = () => {
        console.log("WebSocket closed");
      };
      return response;
    }
    return new Response("Not a websocket request", { status: 400 });
  };

  // Start the server and wait for it to be ready
  const serverPromise = serve(handler, { port: WS_PORT, signal });

  // Wait for the server to be ready
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    close: () => {
      ac.abort();
    }
  };
}

Deno.test({
  name: "Federation Proxy - Server Registration",
  async fn() {
    const mockServer = await setupMockServer();
    try {
      const proxy = new FederationProxy(TEST_SECRET);

      const config: FederationConfig = {
        serverId: "test-server",
        endpoints: {
          control: `ws://localhost:${WS_PORT}`,
          data: "http://localhost:3001",
        },
        auth: {
          type: "jwt",
          config: { secret: TEST_SECRET }
        }
      };

      await proxy.registerServer(config);

      const servers = proxy.getConnectedServers();
      assertEquals(servers.length, 1, "Should have one registered server");
      assertEquals(servers[0], "test-server", "Server ID should match");
    } finally {
      mockServer.close();
      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "Federation Proxy - Server Removal",
  async fn() {
    const mockServer = await setupMockServer();
    try {
      const proxy = new FederationProxy(TEST_SECRET);

      const config: FederationConfig = {
        serverId: "test-server",
        endpoints: {
          control: `ws://localhost:${WS_PORT}`,
          data: "http://localhost:3001",
        },
        auth: {
          type: "jwt",
          config: { secret: TEST_SECRET }
        }
      };

      await proxy.registerServer(config);
      await proxy.removeServer("test-server");

      const servers = proxy.getConnectedServers();
      assertEquals(servers.length, 0, "Should have no registered servers after removal");
    } finally {
      mockServer.close();
      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  },
  sanitizeResources: false,
  sanitizeOps: false
});



---
File: /federated-mcp-main/src/tests/workflow.test.ts
---

import { assertEquals } from "https://deno.land/std@0.224.0/testing/asserts.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { FederationProxy } from "../packages/proxy/federation.ts";
import { FederationConfig } from "../packages/core/types.ts";
import { JSONRPCRequest, JSONRPCResponse } from "../packages/core/schema.ts";

const TEST_SECRET = "test-secret-key";
const WS_PORT = 3002;

// Mock task data
const TASK_REQUEST: JSONRPCRequest = {
  jsonrpc: "2.0",
  method: "executeTask",
  params: {
    type: "calculation",
    input: {
      numbers: [1, 2, 3, 4, 5],
      operation: "sum"
    }
  },
  id: 1
};

const EXPECTED_RESPONSE: JSONRPCResponse = {
  jsonrpc: "2.0",
  result: {
    output: 15, // sum of [1,2,3,4,5]
    status: "completed"
  },
  id: 1
};

async function setupMockTaskServer() {
  const ac = new AbortController();
  const { signal } = ac;

  const handler = async (req: Request): Promise<Response> => {
    if (req.headers.get("upgrade") === "websocket") {
      const { socket, response } = Deno.upgradeWebSocket(req);

      socket.onopen = () => {
        console.log("Task Server WebSocket connected");
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.method === "executeTask") {
            // Simulate task execution and send response
            socket.send(JSON.stringify(EXPECTED_RESPONSE));
          }
        } catch (error) {
          console.error("Error handling message:", error);
        }
      };

      return response;
    }
    return new Response("Not a websocket request", { status: 400 });
  };

  const serverPromise = serve(handler, { port: WS_PORT, signal });
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    close: () => {
      ac.abort();
    }
  };
}

Deno.test({
  name: "Simple Task Workflow",
  async fn() {
    const mockServer = await setupMockTaskServer();
    try {
      const proxy = new FederationProxy(TEST_SECRET);

      // Configure and register a task execution server
      const config: FederationConfig = {
        serverId: "task-server",
        endpoints: {
          control: `ws://localhost:${WS_PORT}`,
          data: "http://localhost:3001",
        },
        auth: {
          type: "jwt",
          config: { secret: TEST_SECRET }
        }
      };

      // Register the server
      await proxy.registerServer(config);

      // Get the WebSocket connection
      const connection = proxy["connections"].get("task-server");
      assertEquals(!!connection, true, "WebSocket connection should be established");

      // Create a promise to wait for the response
      const responsePromise = new Promise<JSONRPCResponse>((resolve) => {
        if (connection) {
          connection.onmessage = (event) => {
            const response = JSON.parse(event.data);
            resolve(response);
          };
        }
      });

      // Send the task request
      if (connection) {
        connection.send(JSON.stringify(TASK_REQUEST));
      }

      // Wait for and verify the response
      const response = await responsePromise;
      assertEquals(response, EXPECTED_RESPONSE, "Task response should match expected output");

    } finally {
      mockServer.close();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  },
  sanitizeResources: false,
  sanitizeOps: false
});



---
File: /federated-mcp-main/src/worker/cloudflare.d.ts
---

declare global {
  interface KVNamespaceGetOptions<Type> {
    type: Type;
    cacheTtl?: number;
  }

  interface KVNamespacePutOptions {
    expiration?: number;
    expirationTtl?: number;
  }

  interface KVNamespace {
    get(key: string, options?: Partial<KVNamespaceGetOptions<undefined>>): Promise<string | null>;
    put(key: string, value: string | ReadableStream | ArrayBuffer, options?: KVNamespacePutOptions): Promise<void>;
    delete(key: string): Promise<void>;
  }

  interface DurableObjectNamespace {
    newUniqueId(): DurableObjectId;
    idFromName(name: string): DurableObjectId;
    get(id: DurableObjectId): DurableObjectInstance;
  }

  interface DurableObjectId {
    toString(): string;
    equals(other: DurableObjectId): boolean;
  }

  interface DurableObjectState {
    waitUntil(promise: Promise<any>): void;
    blockConcurrencyWhile<T>(callback: () => Promise<T>): Promise<T>;
    storage: DurableObjectStorage;
  }

  interface DurableObjectStorage {
    get<T = any>(key: string): Promise<T | undefined>;
    get<T = any>(keys: string[]): Promise<Map<string, T>>;
    put<T>(key: string, value: T): Promise<void>;
    put<T>(entries: Record<string, T>): Promise<void>;
    delete(key: string): Promise<boolean>;
    delete(keys: string[]): Promise<number>;
  }

  interface DurableObjectInstance {
    fetch(request: Request): Promise<Response>;
  }

  interface DurableObject {
    fetch(request: Request): Promise<Response>;
  }

  interface CloudflareWebSocket extends WebSocket {
    accept(): void;
  }

  interface ResponseInit {
    webSocket?: WebSocket;
  }
}

export type {
  KVNamespace,
  KVNamespaceGetOptions,
  KVNamespacePutOptions,
  DurableObjectNamespace,
  DurableObjectId,
  DurableObjectState,
  DurableObjectStorage,
  DurableObjectInstance,
  DurableObject,
  CloudflareWebSocket
};



---
File: /federated-mcp-main/src/worker/cloudflare.ts
---

export class WebSocketPair {
  0: WebSocket;
  1: WebSocket;

  constructor() {
    // This is just a type definition - the actual implementation
    // is provided by the Cloudflare Workers runtime
    throw new Error('WebSocketPair is provided by Cloudflare Workers runtime');
  }
}



---
File: /federated-mcp-main/src/worker/index.ts
---

import { ServerInfo } from '../packages/core/types.ts';
// Import types
import type {
  KVNamespace,
  DurableObjectNamespace,
  DurableObjectState,
  DurableObject,
  CloudflareWebSocket
} from './cloudflare.d.ts';
// Import value
import { WebSocketPair } from './cloudflare.d.ts';

interface Env {
  MCP_STORE: KVNamespace;
  CONNECTIONS: DurableObjectNamespace;
}

const serverInfo: ServerInfo = {
  name: "cloudflare-mcp-worker",
  version: "1.0.0",
  capabilities: {
    models: ["gpt-3.5-turbo", "gpt-4"],
    protocols: ["json-rpc"],
    features: ["task-execution", "federation"]
  }
};

export class ConnectionsStore implements DurableObject {
  private sessions: Map<string, CloudflareWebSocket>;
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.sessions = new Map();
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = [pair[0], pair[1]] as [CloudflareWebSocket, CloudflareWebSocket];

      await this.handleSession(server);

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    return new Response("Expected WebSocket", { status: 400 });
  }

  private async handleSession(ws: CloudflareWebSocket): Promise<void> {
    const sessionId = crypto.randomUUID();
    this.sessions.set(sessionId, ws);

    ws.accept();

    // Send initial server info
    ws.send(JSON.stringify({
      type: "info",
      data: serverInfo
    }));

    ws.addEventListener("message", async (msg: MessageEvent) => {
      try {
        const data = JSON.parse(msg.data as string);
        await this.handleMessage(sessionId, data);
      } catch (err) {
        ws.send(JSON.stringify({
          type: "error",
          error: "Invalid message format"
        }));
      }
    });

    ws.addEventListener("close", () => {
      this.sessions.delete(sessionId);
    });
  }

  private async handleMessage(sessionId: string, message: any): Promise<void> {
    const ws = this.sessions.get(sessionId);
    if (!ws) return;

    switch (message.type) {
      case "info":
        ws.send(JSON.stringify({
          type: "info",
          data: serverInfo
        }));
        break;

      case "capabilities":
        ws.send(JSON.stringify({
          type: "capabilities",
          data: serverInfo.capabilities
        }));
        break;

      case "task":
        try {
          const result = await this.processTask(message.data);
          ws.send(JSON.stringify({
            type: "task_result",
            data: result
          }));
        } catch (error) {
          ws.send(JSON.stringify({
            type: "error",
            error: error instanceof Error ? error.message : "Unknown error"
          }));
        }
        break;

      default:
        ws.send(JSON.stringify({
          type: "error",
          error: `Unknown message type: ${message.type}`
        }));
    }
  }

  private async processTask(task: any): Promise<Record<string, unknown>> {
    // Store task in Durable Object storage
    const taskId = crypto.randomUUID();
    await this.state.storage.put(`task:${taskId}`, JSON.stringify({
      ...task,
      timestamp: Date.now()
    }));

    return {
      status: "completed",
      taskId,
      result: "Task processed successfully"
    };
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // Handle WebSocket upgrade
      if (request.headers.get("Upgrade") === "websocket") {
        // Create or get the Durable Object for connection handling
        const id = env.CONNECTIONS.idFromName("default");
        const connectionStore = env.CONNECTIONS.get(id);
        return connectionStore.fetch(request);
      }

      // Handle HTTP requests
      const url = new URL(request.url);

      switch (url.pathname) {
        case "/info":
          return new Response(JSON.stringify(serverInfo), {
            headers: { "Content-Type": "application/json" }
          });

        case "/capabilities":
          return new Response(JSON.stringify(serverInfo.capabilities), {
            headers: { "Content-Type": "application/json" }
          });

        default:
          return new Response("Not Found", { status: 404 });
      }
    } catch (error) {
      return new Response(error instanceof Error ? error.message : "Internal Server Error", {
        status: 500
      });
    }
  }
};



---
File: /federated-mcp-main/src/Dockerfile
---

FROM denoland/deno:1.40.2

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Cache dependencies
RUN deno cache src/apps/deno/server.ts

# Compile the server with all required permissions
RUN deno compile \
    --allow-net \
    --allow-env \
    --allow-read \
    --allow-write \
    --allow-run \
    src/apps/deno/server.ts

# The port that your application listens to
EXPOSE 3000

# Create and use non-root user
RUN chown -R deno:deno /app
USER deno

# Start the server
CMD ["./server"]



---
File: /federated-mcp-main/src/jest.config.js
---

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};



---
File: /federated-mcp-main/supa_src/docs/api_documentation.md
---

# Fireflies Webhook Integration API Documentation

## Overview

This API provides two main endpoints:
1. A webhook endpoint for receiving Fireflies.ai transcription events
2. A meeting info endpoint for retrieving detailed transcript summaries

## Base URLs

Both endpoints are available at: `https://[YOUR_PROJECT_REF].functions.supabase.co/`

## Endpoints

### 1. POST /webhook-handler

Receives webhook notifications from Fireflies when transcriptions are completed.

#### Request

- Method: POST
- Content-Type: application/json

##### Payload Structure

```json
{
    "meetingId": "ASxwZxCstx",
    "eventType": "Transcription completed",
    "clientReferenceId": "be582c46-4ac9-4565-9ba6-6ab4264496a8"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| meetingId | String | Yes | Identifier for the meeting/transcript |
| eventType | String | Yes | Type of event (e.g., "Transcription completed") |
| clientReferenceId | String | No | Custom identifier set during upload |

#### Response

```json
{
  "success": true,
  "message": "Webhook received successfully",
  "data": {
    "meetingId": "ASxwZxCstx",
    "eventType": "Transcription completed",
    "clientReferenceId": "be582c46-4ac9-4565-9ba6-6ab4264496a8"
  }
}
```

### 2. POST /meeting-info

Retrieves detailed transcript summary for a specific meeting.

#### Request

- Method: POST
- Content-Type: application/json
- Authorization: Bearer YOUR_FIREFLIES_API_KEY

##### Payload Structure

```json
{
    "meetingId": "IQqVuslNBNQW0TIr"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| meetingId | String | Yes | Identifier for the meeting to retrieve |

#### Response

```json
{
  "success": true,
  "data": {
    "transcript": {
      "summary": {
        "keywords": ["AI models", "geo-arbitrage", "context windows"],
        "action_items": "**User1**\nAction 1 (timestamp)\n\n**User2**\nAction 2 (timestamp)",
        "outline": ["Section 1", "Section 2"],
        "shorthand_bullet": "🔹 Point 1\n🔹 Point 2",
        "overview": "Detailed meeting overview...",
        "bullet_gist": ["Key point 1", "Key point 2"],
        "gist": "Brief meeting summary",
        "short_summary": "Concise meeting summary"
      }
    }
  }
}
```

## Authentication

### Webhook Handler
No authentication required - designed to receive Fireflies webhooks.

### Meeting Info Endpoint
Requires Fireflies API key in Authorization header:
```
Authorization: Bearer YOUR_FIREFLIES_API_KEY
```

## Error Responses

Both endpoints use standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid payload or missing required fields |
| 401 | Unauthorized - Missing or invalid API key (meeting-info only) |
| 405 | Method Not Allowed - Only POST requests are supported |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

## Examples

### 1. Webhook Handler Example

```bash
curl -X POST "https://[YOUR_PROJECT_REF].functions.supabase.co/webhook-handler" \
  -H "Content-Type: application/json" \
  -d '{
    "meetingId": "ASxwZxCstx",
    "eventType": "Transcription completed",
    "clientReferenceId": "be582c46-4ac9-4565-9ba6-6ab4264496a8"
  }'
```

### 2. Meeting Info Example

```bash
curl -X POST "https://[YOUR_PROJECT_REF].functions.supabase.co/meeting-info" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREFLIES_API_KEY" \
  -d '{
    "meetingId": "IQqVuslNBNQW0TIr"
  }'
```

## Rate Limiting

Both endpoints are subject to Supabase Edge Functions rate limits. Additionally, the meeting-info endpoint is subject to Fireflies API rate limits.

## Support

For additional support:
1. Check the [Tutorial](./tutorial.md) for detailed setup and usage instructions
2. Review the [Fireflies Webhook Documentation](https://docs.fireflies.ai/graphql-api/webhooks)
3. Review the [Fireflies GraphQL API Documentation](https://docs.fireflies.ai/graphql-api/query/transcript)
4. Open an issue on our GitHub repository
5. Contact our support team

## See Also

- [Tutorial](./tutorial.md) - Detailed guide on setting up and using both endpoints
- [Fireflies API Documentation](https://docs.fireflies.ai) - Official Fireflies API documentation
- [Supabase Documentation](https://supabase.com/docs) - Supabase platform documentation



---
File: /federated-mcp-main/supa_src/docs/intent_detection_spec.md
---

# Intent Detection Function Technical Specification

## Overview
The Intent Detection function is a Supabase Edge Function that processes meeting transcriptions to identify and classify user intents within conversations. This function will be triggered after the transcription is completed and stored in the database.

## Technical Architecture

### Function Structure
```typescript
interface IntentDetectionPayload {
  meetingId: string;
  transcriptionText: string;
  participants: string[];
  metadata: {
    duration: number;
    date: string;
  }
}

interface DetectedIntent {
  type: string;          // The classified intent type
  confidence: number;    // Confidence score (0-1)
  segment: {
    text: string;        // The relevant text segment
    timestamp: number;   // Timestamp in the meeting
    speaker: string;     // Speaker identifier
  }
  metadata: {
    context: string[];   // Related context snippets
    entities: string[];  // Named entities involved
  }
}
```

### Database Schema
```sql
create type intent_type as enum (
  'task_assignment',
  'follow_up',
  'decision_made',
  'question_asked',
  'commitment_made',
  'meeting_scheduled'
);

create table meeting_intents (
  id uuid primary key default uuid_generate_v4(),
  meeting_id text references meetings(id),
  intent_type intent_type not null,
  confidence float not null,
  text_segment text not null,
  timestamp integer not null,
  speaker text not null,
  context jsonb,
  entities jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index idx_meeting_intents_meeting_id on meeting_intents(meeting_id);
create index idx_meeting_intents_type on meeting_intents(intent_type);
```

## Processing Pipeline

1. **Text Segmentation**
   - Split transcription into meaningful conversation segments
   - Maintain speaker attribution and timing information
   - Filter out non-relevant segments (greetings, small talk)

2. **Intent Classification**
   - Use OpenAI's GPT-4 for initial intent classification
   - Apply custom prompt engineering for business context
   - Extract key entities and action items
   - Calculate confidence scores

3. **Context Enhancement**
   - Analyze surrounding conversation context
   - Link related segments
   - Identify dependencies between intents

4. **Storage and Indexing**
   - Store detected intents in Supabase
   - Create efficient indexes for quick retrieval
   - Maintain relationships with original meeting data

## Implementation Details

### OpenAI Prompt Template
```typescript
const INTENT_DETECTION_PROMPT = `
Analyze the following meeting segment and identify any specific intents:
[SEGMENT]

Classify the intent into one of the following categories:
- Task Assignment
- Follow-up Required
- Decision Made
- Question Asked
- Commitment Made
- Meeting Scheduled

For each intent detected:
1. Specify the intent type
2. Extract relevant entities
3. Identify the key action items
4. Determine the level of confidence
5. Note any dependencies or context

Provide the analysis in a structured JSON format.
`;
```

### Error Handling
- Implement retry logic for API calls
- Log failed classifications for manual review
- Handle edge cases (multiple intents, ambiguous statements)
- Maintain transaction integrity with database operations

### Performance Considerations
- Batch process segments for efficient API usage
- Implement caching for frequent patterns
- Use parallel processing where possible
- Monitor and optimize database queries

## Integration Points

1. **Webhook Handler**
   - Receive transcription completed webhook
   - Validate and queue for processing
   - Handle rate limiting and backoff

2. **Meeting Info Function**
   - Extend existing function to include intent data
   - Provide filtered views based on intent types
   - Support aggregated intent statistics

3. **Database**
   - Maintain referential integrity
   - Support efficient querying patterns
   - Enable analytics and reporting

## Security Considerations

1. **Data Privacy**
   - Encrypt sensitive information
   - Implement access controls
   - Log access patterns
   - Handle PII appropriately

2. **API Security**
   - Validate all inputs
   - Implement rate limiting
   - Use secure API keys
   - Monitor for abuse

## Testing Strategy

1. **Unit Tests**
   - Test intent classification logic
   - Validate data transformations
   - Check error handling

2. **Integration Tests**
   - Verify database operations
   - Test API integrations
   - Validate end-to-end flow

3. **Performance Tests**
   - Measure processing latency
   - Test under load
   - Verify scaling capabilities

## Deployment and Monitoring

1. **Deployment**
   - Use Supabase CLI for function deployment
   - Implement blue-green deployment
   - Maintain version control

2. **Monitoring**
   - Track processing times
   - Monitor error rates
   - Alert on anomalies
   - Log key metrics

## Future Enhancements

1. **Machine Learning**
   - Train custom models on historical data
   - Improve classification accuracy
   - Add new intent types

2. **Integration**
   - Connect with task management systems
   - Enable automated follow-ups
   - Support custom workflows

3. **Analytics**
   - Provide intent trends
   - Generate meeting insights
   - Enable custom reporting



---
File: /federated-mcp-main/supa_src/docs/tutorial.md
---

# Fireflies Integration Tutorial

This tutorial explains how to set up and use the ruv bounce webhook approach with Fireflies and Supabase. The integration consists of two main components:
1. A webhook handler that receives notifications from Fireflies
2. A meeting info endpoint that retrieves detailed transcript summaries

## Overview

The integration follows this workflow:
1. Fireflies sends a webhook when a transcription is complete
2. Webhook handler validates and acknowledges the notification
3. You can then use the meeting info endpoint to fetch the detailed transcript summary

## Prerequisites

- Supabase account and project
- Fireflies.ai account with API access
- Basic understanding of webhooks and REST APIs

## Setup

### 1. Environment Variables

Create a `.env` file with your configuration:

```env
SUPABASE_PROJECT_REF=your-project-ref
SUPABASE_ACCESS_TOKEN=your-access-token
FIREFLIES_API_KEY=your-fireflies-api-key
```

### 2. Deploy the Functions

Use the provided deploy scripts:

```bash
# Deploy webhook handler
cd supabase/functions/webhook-handler
./deploy.sh

# Deploy meeting info endpoint
cd supabase/functions/meeting-info
./deploy.sh
```

This will:
- Run tests to verify functionality
- Deploy both functions to Supabase Edge Functions
- Output the function URLs

## Component Details

### 1. Webhook Handler

The webhook handler implements the ruv bounce approach:

#### Request Format

```json
{
    "meetingId": "ASxwZxCstx",
    "eventType": "Transcription completed",
    "clientReferenceId": "be582c46-4ac9-4565-9ba6-6ab4264496a8"
}
```

#### Key Features

1. **Immediate Response**: Responds quickly to prevent timeouts
```typescript
return new Response(JSON.stringify({
  success: true,
  message: 'Webhook received successfully',
  data: payload
}));
```

2. **Event Type Filtering**: Only processes relevant events
```typescript
if (payload.eventType !== 'Transcription completed') {
  return new Response(JSON.stringify({
    success: true,
    message: 'Event type not supported'
  }));
}
```

3. **CORS Support**: Built-in cross-origin support
```typescript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}
```

### 2. Meeting Info Endpoint

The meeting info endpoint retrieves detailed transcript summaries:

#### Request Format

```json
{
    "meetingId": "IQqVuslNBNQW0TIr"
}
```

#### Response Format

```json
{
  "success": true,
  "data": {
    "transcript": {
      "summary": {
        "keywords": ["keyword1", "keyword2"],
        "action_items": "**User1**\nAction 1\n**User2**\nAction 2",
        "outline": ["Section 1", "Section 2"],
        "shorthand_bullet": "🔹 Point 1\n🔹 Point 2",
        "overview": "Meeting overview...",
        "bullet_gist": ["Key point 1", "Key point 2"],
        "gist": "Brief summary",
        "short_summary": "Concise summary"
      }
    }
  }
}
```

## Complete Workflow Example

1. **Set Up Webhook in Fireflies**
   ```bash
   # Your webhook URL will be:
   https://[YOUR_PROJECT_REF].functions.supabase.co/webhook-handler
   ```

2. **Receive Webhook Notification**
   ```json
   {
     "meetingId": "IQqVuslNBNQW0TIr",
     "eventType": "Transcription completed"
   }
   ```

3. **Fetch Meeting Summary**
   ```bash
   curl -X POST "https://[YOUR_PROJECT_REF].functions.supabase.co/meeting-info" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_FIREFLIES_API_KEY" \
     -d '{
       "meetingId": "IQqVuslNBNQW0TIr"
     }'
   ```

## Testing

### 1. Testing Webhook Handler

```bash
curl -X POST "https://[YOUR_PROJECT_REF].functions.supabase.co/webhook-handler" \
  -H "Content-Type: application/json" \
  -d '{
    "meetingId": "test-123",
    "eventType": "Transcription completed"
  }'
```

### 2. Testing Meeting Info

```bash
curl -X POST "https://[YOUR_PROJECT_REF].functions.supabase.co/meeting-info" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREFLIES_API_KEY" \
  -d '{
    "meetingId": "IQqVuslNBNQW0TIr"
  }'
```

## Best Practices

1. **Webhook Handler**
   - Respond quickly to prevent timeouts
   - Validate payload before processing
   - Log important events for debugging

2. **Meeting Info Endpoint**
   - Always include Fireflies API key
   - Handle rate limits appropriately
   - Cache responses if needed

3. **General**
   - Keep environment variables secure
   - Monitor endpoint health
   - Implement proper error handling

## Troubleshooting

Common issues and solutions:

1. **Webhook Not Receiving Events**
   - Verify webhook URL in Fireflies settings
   - Check event type matches "Transcription completed"
   - Verify payload format

2. **Meeting Info Errors**
   - Verify Fireflies API key is correct
   - Check meeting ID exists
   - Ensure proper authorization header

3. **CORS Issues**
   - Check allowed origins configuration
   - Verify request headers
   - Check browser console for errors

## Next Steps

1. Add database integration to store transcripts
2. Implement additional event types
3. Add authentication middleware
4. Set up monitoring and alerting

## Support

For issues or questions:
1. Check the troubleshooting guide above
2. Review the API documentation
3. Open an issue on GitHub
4. Contact support team

Remember to keep your API keys secure and monitor your endpoint's performance regularly.



---
File: /federated-mcp-main/supa_src/docs/user_guide.md
---

# Fireflies Webhook User Guide

## Introduction

This guide provides instructions on how to use and interact with the Fireflies Webhook application. The webhook processes Fireflies transcripts, detects intents, and generates structured outputs using OpenAI.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fireflies-webhook.git
   cd fireflies-webhook
   ```

2. Install dependencies:
   ```
   ./install.sh
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Fireflies and OpenAI API keys

4. Start the server:
   ```
   uvicorn app.main:app --reload
   ```

## Using the Webhook

The main endpoint for the webhook is `/api/webhook`. To use it:

1. Send a POST request to `http://your-server-address/api/webhook`
2. Include the following JSON payload:
   ```json
   {
     "meeting_id": "your_meeting_id",
     "event_type": "transcription_complete"
   }
   ```

3. The webhook will process the request and return a response with detected intents and OpenAI outputs.

## Interpreting Results

The webhook response will include:

1. Detected intents: A list of intents found in the transcript, along with confidence scores.
2. OpenAI outputs: Structured data generated based on the detected intents.

## Troubleshooting

If you encounter issues:

1. Check the logs for error messages
2. Verify your API keys are correct in the `.env` file
3. Ensure your database is properly set up and migrated

For more detailed information, refer to the API documentation.

## Extending the Webhook

To add new intents or modify existing ones, edit the `INTENT_DICTIONARY` in `app/services/intent_detector.py`.

To change the OpenAI model or modify the prompt, update the `process_intent` function in `app/services/openai.py`.

Remember to run tests after making changes:
```
pytest
```

## Support

For additional support or to report issues, please open an issue on the GitHub repository.
# User Guide

## Getting Started

1. Ensure you have set up your environment variables in the `.env` file.
2. Start the server using the `start.sh` script.

## Sending Webhook Requests

To process a transcript, send a POST request to the `/api/webhook` endpoint with the following JSON payload:

```json
{
  "meeting_id": "your_meeting_id",
  "event_type": "transcription_complete"
}
```

Replace `your_meeting_id` with the actual meeting ID from Fireflies.

## Interpreting the Response

The webhook will respond with detected intents and generated outputs:

```json
{
  "meeting_id": "your_meeting_id",
  "intents": [
    {
      "intent": "follow-up",
      "confidence": 0.85
    },
    {
      "intent": "project management",
      "confidence": 0.72
    }
  ],
  "outputs": [
    {
      "intent": "follow-up",
      "output": "Generated follow-up content..."
    },
    {
      "intent": "project management",
      "output": "Generated project management content..."
    }
  ]
}
```

## Troubleshooting

- If you encounter authentication errors, ensure your API key is correctly set in the `.env` file.
- For other issues, check the `app.log` file for detailed error messages.

## Extending the Application

To add new intents or modify existing ones, edit the `INTENTS` list in `app/services/intent_detector.py`.

To customize the OpenAI output generation, modify the `process_intent` function in `app/services/openai.py`.



---
File: /federated-mcp-main/supa_src/supabase/functions/intent-detection/index.ts
---

// Types from spec
interface IntentDetectionPayload {
  meetingId: string;
  transcriptionText: string;
  participants: string[];
  metadata: {
    duration: number;
    date: string;
  }
}

interface DetectedIntent {
  type: string;
  confidence: number;
  segment: {
    text: string;
    timestamp: number;
    speaker: string;
  }
  metadata: {
    context: string[];
    entities: string[];
  }
}

// OpenAI prompt template from spec
const INTENT_DETECTION_PROMPT = `
Analyze the following meeting segment and identify any specific intents:
[SEGMENT]

Classify the intent into one of the following categories:
- Task Assignment
- Follow-up Required
- Decision Made
- Question Asked
- Commitment Made
- Meeting Scheduled

For each intent detected:
1. Specify the intent type
2. Extract relevant entities
3. Identify the key action items
4. Determine the level of confidence
5. Note any dependencies or context

Provide the analysis in a structured JSON format matching this TypeScript interface:

interface DetectedIntent {
  type: string;          // One of the categories above
  confidence: number;    // Between 0 and 1
  segment: {
    text: string;        // The relevant text segment
    timestamp: number;   // Set to 0 if not available
    speaker: string;     // Set to "unknown" if not available
  }
  metadata: {
    context: string[];   // Related context snippets
    entities: string[];  // Named entities involved
  }
}

Return an array of DetectedIntent objects.
`;

async function detectIntents(segment: string): Promise<DetectedIntent[]> {
  try {
    const prompt = INTENT_DETECTION_PROMPT.replace('[SEGMENT]', segment);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "You are an AI trained to detect intents in meeting transcripts."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content) as DetectedIntent[];
  } catch (error) {
    if (!Deno.env.get("DENO_TEST")) {
      console.error('Error detecting intents:', error);
    }
    throw error;
  }
}

export async function handler(req: Request): Promise<Response> {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Validate request method
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Parse and validate payload
    const payload: IntentDetectionPayload = await req.json();
    if (!payload.meetingId || !payload.transcriptionText) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid payload: missing required fields'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Split text into segments (simplified for example)
    const segments = payload.transcriptionText.split('\n\n').filter(Boolean);

    // Process each segment
    const allIntents: DetectedIntent[] = [];
    for (const segment of segments) {
      const intents = await detectIntents(segment);
      if (Array.isArray(intents)) {
        allIntents.push(...intents);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Intents detected successfully',
      data: {
        meetingId: payload.meetingId,
        intentsCount: allIntents.length,
        intents: allIntents
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    if (!Deno.env.get("DENO_TEST")) {
      console.error('Error in intent detection:', error);
    }
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Start server if not in test environment
if (!Deno.env.get("DENO_TEST")) {
  Deno.serve(handler);
}



---
File: /federated-mcp-main/supa_src/supabase/functions/intent-detection/test.ts
---

import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/testing/asserts.ts";

// Set test environment flag before any imports
Deno.env.set("DENO_TEST", "1");

// Mock data for testing
const MOCK_PAYLOAD = {
  meetingId: "test-meeting-123",
  transcriptionText: "Alice: Let's schedule a follow-up meeting next week.\nBob: I'll create a task to prepare the presentation.\nAlice: We've decided to proceed with the new feature.",
  participants: ["Alice", "Bob"],
  metadata: {
    duration: 1800,
    date: "2024-01-15T10:00:00Z"
  }
};

// Mock successful response from OpenAI
const MOCK_OPENAI_RESPONSE = {
  choices: [{
    message: {
      content: JSON.stringify([{
        type: "Meeting Scheduled",
        confidence: 0.95,
        segment: {
          text: "Let's schedule a follow-up meeting next week.",
          timestamp: 0,
          speaker: "Alice"
        },
        metadata: {
          context: ["Meeting planning"],
          entities: ["next week"]
        }
      }])
    }
  }]
};

// Mock error response from OpenAI
const MOCK_OPENAI_ERROR = {
  error: {
    message: "Invalid API key"
  }
};

// Mock fetch function
const createMockFetch = (success: boolean) => {
  return async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    if (input.toString().includes('openai.com')) {
      if (success) {
        return new Response(JSON.stringify(MOCK_OPENAI_RESPONSE), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify(MOCK_OPENAI_ERROR), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  };
};

// Store original fetch for cleanup
const originalFetch = globalThis.fetch;

// Helper to create a new module import for each test
async function getHandler() {
  const mod = await import("./index.ts?t=" + Date.now());
  return mod.handler;
}

// Test suite
Deno.test({
  name: "Intent Detection Tests",
  async fn(t) {
    await t.step("should handle OPTIONS request for CORS", async () => {
      const handler = await getHandler();
      const req = new Request("http://localhost", {
        method: "OPTIONS"
      });

      const response = await handler(req);
      assertEquals(response.status, 200);
      assertExists(response.headers.get("Access-Control-Allow-Origin"));
    });

    await t.step("should reject non-POST requests", async () => {
      const handler = await getHandler();
      const req = new Request("http://localhost", {
        method: "GET"
      });

      const response = await handler(req);
      assertEquals(response.status, 405);
    });

    await t.step("should validate payload - missing fields", async () => {
      const handler = await getHandler();
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      const response = await handler(req);
      assertEquals(response.status, 400);

      const data = await response.json();
      assertEquals(data.success, false);
      assertEquals(data.message, "Invalid payload: missing required fields");
    });

    await t.step("should handle successful intent detection", async () => {
      globalThis.fetch = createMockFetch(true);
      const handler = await getHandler();

      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(MOCK_PAYLOAD)
      });

      const response = await handler(req);
      assertEquals(response.status, 200);

      const data = await response.json();
      assertEquals(data.success, true);
      assertExists(data.data.intents);
      assertEquals(data.data.meetingId, MOCK_PAYLOAD.meetingId);
    });

    await t.step("should handle OpenAI API error", async () => {
      globalThis.fetch = createMockFetch(false);
      const handler = await getHandler();

      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(MOCK_PAYLOAD)
      });

      const response = await handler(req);
      assertEquals(response.status, 500);

      const data = await response.json();
      assertEquals(data.success, false);
    });

    // Reset fetch
    globalThis.fetch = originalFetch;
  }
});



---
File: /federated-mcp-main/supa_src/supabase/functions/meeting-info/index.ts
---

interface TranscriptSummary {
  keywords: string[];
  action_items: string[];
  outline: string[];
  shorthand_bullet: string[];
  overview: string;
  bullet_gist: string[];
  gist: string;
  short_summary: string;
}

interface TranscriptResponse {
  transcript?: {
    summary: TranscriptSummary;
  };
}

export async function handler(req: Request): Promise<Response> {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get API key from request header
    const apiKey = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing API key'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const { meetingId } = await req.json();
    if (!meetingId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing meetingId'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Query Fireflies GraphQL API
    const query = `
      query Transcript($transcriptId: String!) {
        transcript(id: $transcriptId) {
          summary {
            keywords
            action_items
            outline
            shorthand_bullet
            overview
            bullet_gist
            gist
            short_summary
          }
        }
      }
    `;

    console.log('Sending request to Fireflies API with:', {
      query,
      variables: { transcriptId: meetingId }
    });

    const response = await fetch('https://api.fireflies.ai/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        variables: { transcriptId: meetingId },
      }),
    });

    const result = await response.json();
    console.log('Fireflies API response:', result);

    if (result.errors) {
      return new Response(JSON.stringify({
        success: false,
        message: result.errors[0].message
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: result.data
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error: unknown) {
    console.error('Error fetching transcript summary:', error);

    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Only start the server if we're not in a test environment
if (!Deno.env.get("DENO_TEST")) {
  Deno.serve(handler);
}



---
File: /federated-mcp-main/supa_src/supabase/functions/meeting-info/test.ts
---

import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/testing/asserts.ts";

// Set test environment flag before any imports
Deno.env.set("DENO_TEST", "1");

// Mock successful response from Fireflies API
const MOCK_FIREFLIES_RESPONSE = {
  data: {
    transcript: {
      summary: {
        keywords: ["meeting", "discussion", "project"],
        action_items: ["Schedule follow-up", "Review documentation"],
        outline: ["Introduction", "Project Updates", "Next Steps"],
        shorthand_bullet: ["Intro", "Updates", "Next"],
        overview: "Team meeting to discuss project progress",
        bullet_gist: ["Project status reviewed", "Action items assigned"],
        gist: "Comprehensive project review meeting",
        short_summary: "Project status update and planning"
      }
    }
  }
};

// Mock error response from Fireflies API
const MOCK_FIREFLIES_ERROR = {
  errors: [
    {
      message: "Transcript not found"
    }
  ]
};

// Mock fetch function
const createMockFetch = (success: boolean) => {
  return async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    // Verify the GraphQL query structure
    if (init?.body) {
      const body = JSON.parse(init.body.toString());
      if (!body.variables?.transcriptId) {
        return new Response(JSON.stringify({
          errors: [{ message: "Missing required parameter: transcriptId" }]
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (success) {
      return new Response(JSON.stringify(MOCK_FIREFLIES_RESPONSE), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify(MOCK_FIREFLIES_ERROR), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
};

// Store original fetch for cleanup
const originalFetch = globalThis.fetch;

// Helper to create a new module import for each test
async function getHandler() {
  const mod = await import("./index.ts?t=" + Date.now());
  return mod.handler;
}

// Test suite
Deno.test({
  name: "Meeting Info Handler Tests",
  async fn(t) {
    await t.step("should handle OPTIONS request for CORS", async () => {
      const handler = await getHandler();
      const req = new Request("http://localhost", {
        method: "OPTIONS"
      });

      const response = await handler(req);
      assertEquals(response.status, 200);
      assertExists(response.headers.get("Access-Control-Allow-Origin"));
    });

    await t.step("should reject non-POST requests", async () => {
      const handler = await getHandler();
      const req = new Request("http://localhost", {
        method: "GET"
      });

      const response = await handler(req);
      assertEquals(response.status, 405);
    });

    await t.step("should require API key", async () => {
      const handler = await getHandler();
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId: "test-id" })
      });

      const response = await handler(req);
      assertEquals(response.status, 401);

      const data = await response.json();
      assertEquals(data.success, false);
      assertEquals(data.message, "Missing API key");
    });

    await t.step("should require meetingId", async () => {
      const handler = await getHandler();
      const req = new Request("http://localhost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-key"
        },
        body: JSON.stringify({})
      });

      const response = await handler(req);
      assertEquals(response.status, 400);

      const data = await response.json();
      assertEquals(data.success, false);
      assertEquals(data.message, "Missing meetingId");
    });

    await t.step("should handle successful API response", async () => {
      globalThis.fetch = createMockFetch(true);
      const handler = await getHandler();

      const req = new Request("http://localhost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-key"
        },
        body: JSON.stringify({ meetingId: "test-id" })
      });

      const response = await handler(req);
      assertEquals(response.status, 200);

      const data = await response.json();
      assertEquals(data.success, true);
      assertExists(data.data.transcript);
      assertExists(data.data.transcript.summary);
      assertEquals(data.data.transcript.summary.keywords.length, 3);
      assertEquals(data.data.transcript.summary.action_items.length, 2);
      assertEquals(data.data.transcript.summary.overview, "Team meeting to discuss project progress");
    });

    await t.step("should handle API error response", async () => {
      globalThis.fetch = createMockFetch(false);
      const handler = await getHandler();

      const req = new Request("http://localhost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-key"
        },
        body: JSON.stringify({ meetingId: "test-id" })
      });

      const response = await handler(req);
      assertEquals(response.status, 400);

      const data = await response.json();
      assertEquals(data.success, false);
      assertEquals(data.message, "Transcript not found");
    });

    // Reset fetch
    globalThis.fetch = originalFetch;
  }
});



---
File: /federated-mcp-main/supa_src/supabase/functions/webhook-handler/index.ts
---

// Types for Fireflies webhook payload
interface WebhookPayload {
  meetingId: string;
  eventType: string;
  clientReferenceId?: string;
}

// Main webhook handler
export async function handler(req: Request): Promise<Response> {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse and validate webhook payload
    const payload: WebhookPayload = await req.json();

    if (!payload.meetingId || !payload.eventType) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid webhook payload: missing required fields'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Only process completed transcriptions
    if (payload.eventType !== 'Transcription completed') {
      return new Response(JSON.stringify({
        success: true,
        message: 'Event type not supported for processing',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Process the webhook
    console.log(`Processing meeting: ${payload.meetingId}`);

    // For now, just echo back the received data
    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook received successfully',
      data: payload
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error: unknown) {
    console.error('Error processing webhook:', error);

    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Only start the server if we're not in a test environment
if (!Deno.env.get("DENO_TEST")) {
  Deno.serve(handler);
}



---
File: /federated-mcp-main/supa_src/supabase/functions/webhook-handler/test.ts
---

import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/testing/asserts.ts";

// Set test environment flag before any imports
Deno.env.set("DENO_TEST", "1");

// Mock data for testing - matches Fireflies webhook format exactly
const MOCK_WEBHOOK_PAYLOAD = {
  meetingId: "ASxwZxCstx",
  eventType: "Transcription completed",
  clientReferenceId: "be582c46-4ac9-4565-9ba6-6ab4264496a8"
};

// Helper to create a new module import for each test
async function getHandler() {
  const mod = await import("./index.ts?t=" + Date.now());
  return mod.handler;
}

// Test suite for webhook handler
Deno.test({
  name: "Webhook Handler Tests",
  async fn(t) {
    // Get fresh handler instance
    const handler = await getHandler();

    await t.step("should handle OPTIONS request for CORS", async () => {
      const req = new Request("http://localhost", {
        method: "OPTIONS"
      });

      const response = await handler(req);
      assertEquals(response.status, 200);
      assertExists(response.headers.get("Access-Control-Allow-Origin"));
    });

    await t.step("should reject non-POST requests", async () => {
      const req = new Request("http://localhost", {
        method: "GET"
      });

      const response = await handler(req);
      assertEquals(response.status, 405);
    });

    await t.step("should validate webhook payload - missing fields", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      const response = await handler(req);
      assertEquals(response.status, 400);

      const data = await response.json();
      assertEquals(data.success, false);
      assertEquals(data.message, "Invalid webhook payload: missing required fields");
    });

    await t.step("should validate webhook payload - missing eventType", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingId: "ASxwZxCstx"
        })
      });

      const response = await handler(req);
      assertEquals(response.status, 400);

      const data = await response.json();
      assertEquals(data.success, false);
      assertEquals(data.message, "Invalid webhook payload: missing required fields");
    });

    await t.step("should process valid webhook payload", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(MOCK_WEBHOOK_PAYLOAD)
      });

      const response = await handler(req);
      assertEquals(response.status, 200);

      const data = await response.json();
      assertEquals(data.success, true);
      assertEquals(data.message, "Webhook received successfully");
      assertEquals(data.data.meetingId, MOCK_WEBHOOK_PAYLOAD.meetingId);
      assertEquals(data.data.eventType, MOCK_WEBHOOK_PAYLOAD.eventType);
      assertEquals(data.data.clientReferenceId, MOCK_WEBHOOK_PAYLOAD.clientReferenceId);
    });

    await t.step("should handle unsupported event types", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...MOCK_WEBHOOK_PAYLOAD,
          eventType: "unsupported"
        })
      });

      const response = await handler(req);
      assertEquals(response.status, 200);

      const data = await response.json();
      assertEquals(data.success, true);
      assertEquals(data.message, "Event type not supported for processing");
    });
  }
});



---
File: /federated-mcp-main/supa_src/ARCHITECTURE.md
---

# System Architecture

## Components

1. FastAPI Application
   - Handles incoming webhook requests
   - Manages API routes and middleware

2. Intent Detection Module
   - Processes transcripts to identify intents
   - Uses keyword matching and potentially ML-based classification

3. OpenAI Integration Module
   - Generates prompts based on detected intents
   - Processes OpenAI API responses

4. Database Module
   - Manages SQLite database connections
   - Handles data storage and retrieval

5. Fireflies API Client
   - Manages communication with Fireflies API
   - Handles authentication and error retry logic

6. Logging and Monitoring Module
   - Implements comprehensive logging
   - Provides debugging and monitoring capabilities

## Technology Stack

- Python 3.9+
- FastAPI
- Pydantic
- SQLAlchemy
- LiteLLM
- httpx (for async HTTP requests)
- python-dotenv (for environment variable management)
- uvicorn (ASGI server)
- alembic (for database migrations)

## Folder Structure

```
fireflies-webhook/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── config.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── endpoints.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── fireflies.py
│   │   ├── openai.py
│   │   └── intent_detector.py
│   └── utils/
│       ├── __init__.py
│       └── logger.py
├── alembic/
│   ├── versions/
│   └── env.py
├── tests/
│   ├── __init__.py
│   ├── test_api.py
│   ├── test_services.py
│   └── test_utils.py
├── .env
├── .gitignore
├── alembic.ini
├── pyproject.toml
├── README.md
├── SPECIFICATION.md
├── ARCHITECTURE.md
└── install.sh
```

## Architectural Decisions

1. FastAPI: Chosen for its high performance, easy-to-use async capabilities, and built-in OpenAPI documentation.

2. SQLAlchemy with SQLite: Provides a lightweight, file-based database solution that's easy to set up and maintain. SQLAlchemy offers an ORM for database interactions and supports migrations through Alembic.

3. Pydantic: Used for data validation and settings management, integrating well with FastAPI.

4. LiteLLM: Provides a unified interface for working with various LLM providers, making it easier to switch between models if needed.

5. Modular Structure: The application is divided into modules (api, services, utils) to promote separation of concerns and maintainability.

6. Environment Variables: Sensitive information like API keys is stored in a .env file, which is not version-controlled.

7. Alembic: Used for database migrations, allowing for easy schema updates and version control of the database structure.

8. Poetry: Chosen for dependency management due to its deterministic builds and easy-to-use CLI.

This architecture provides a scalable and maintainable structure for the Fireflies webhook application, with clear separation of concerns and room for future expansion.



---
File: /federated-mcp-main/supa_src/commands.md
---

/architect fully implement README.md init-prompt.md including all files, folders, functions, configurations.

To improve the "/architect fully implement README.md init-prompt.md including all files, folders, functions, configurations." prompt using the SPARC framework, we can structure it as follows:

```
Using the SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) framework, fully implement the project described in README.md and init-prompt.md. Please follow these steps:

1. Specification:
   - Analyze README.md and init-prompt.md to extract all project requirements, objectives, and constraints.
   - Define clear functional and non-functional requirements.
   - Outline user scenarios and use cases.
   - Establish UI/UX guidelines if applicable.

2. Pseudocode:
   - Develop a high-level pseudocode outline for the main components and functions described in the project.
   - Include comments explaining the logic and flow of the pseudocode.

3. Architecture:
   - Design the system architecture, including all necessary components, modules, and their interactions.
   - Specify the technology stack, frameworks, and tools to be used.
   - Create a folder structure for the project, including all necessary files and configurations.
   - Provide a detailed explanation of the architectural decisions.

4. Refinement:
   - Iterate on the initial design, optimizing for performance, scalability, and maintainability.
   - Address any potential issues or challenges identified in the previous steps.
   - Refine the pseudocode into actual code implementations for key functions and components.

5. Completion:
   - Provide a complete implementation of all files, folders, functions, and configurations as specified in the README.md and init-prompt.md.
   - Include necessary documentation, such as inline comments, function docstrings, and a updated README.md.
   - Outline any testing strategies, deployment procedures, and maintenance considerations.

Throughout this process, please act as a reflective architect and editor by justifying decisions, considering alternatives, and discussing potential challenges and solutions. Use tools like Perplexity for research when needed, and document your findings and decisions in markdown files.

Please present your final output in a structured format, organizing all content in appropriate markdown files and code files within the specified project structure.
```

This improved prompt incorporates the key aspects of the SPARC framework, ensuring a comprehensive and structured approach to implementing the project. It guides the AI through each step of the process, from initial specification to final completion, while encouraging reflection and justification of decisions along the way.



---
File: /federated-mcp-main/supa_src/init-prompt.md
---

Create a complete specification, including files and folder structure, for a webhook endpoint that:

1. **Receives requests** from Fireflies and queries the Fireflies API for transcripts.
2. **Processes the transcript** to detect intents such as follow-up, proposal, SOW, coding, technical specification, functional specification, documentation, project management, product features, and tool selection.
3. **Executes actions** based on the detected intent using OpenAI's structured output with Python, Pydantic, FastAPI, SQLite (via SQLAlchemy), LiteLLM, and GPT-4o-mini.

### Requirements:
- **Webhook Endpoint**:
  - Must include error handling for retries, timeouts, and failed Fireflies API queries.
  - Implement security measures (e.g., API keys or OAuth) and store credentials securely in a `.env` file.

- **Intent Detection**:
  - Use OpenAI to process transcript sections for intent detection.
  - Implement a dictionary of intents for matching common phrases or topics (follow-up, proposal, etc.). Provide guidance on how this dictionary should be structured or updated.

- **SQLite Database**:
  - Save each step of the process (initial webhook request, transcript, detected intents, and final OpenAI output) in separate tables.
  - Ensure database transactions are secure, and include migration support via SQLAlchemy.

- **OpenAI Integration**:
  - Use GPT-4o-mini for structured outputs and ensure flexibility in switching to other models if needed.
  - OpenAI output should be clearly formatted to match the identified intent (e.g., for coding, generate Python code; for proposals, generate text content).

- **Tool Selection/Execution**:
  - Based on the detected intent, the webhook should trigger the appropriate tools or services. For instance, if coding is detected, generate Python code; if project management is detected, create a task list.
  - Provide an execution framework that can be expanded to integrate other tools and services.

- **Environment and Dependencies**:
  - Use Poetry for dependency management and ensure the `.env` file securely handles sensitive keys (API keys for Fireflies and OpenAI).
  - The project should include a setup script or instructions for environment configuration, including how to install and run the service.

- **Logging and Debugging**:
  - Implement logging throughout the process for monitoring and error tracking. Ensure logs capture webhook requests, API responses, detected intents, and execution steps.
  - Provide guidance on debugging common issues, such as failed API queries or incorrect intent detection.

### Output:
Provide a comprehensive folder structure, including:
- **app.py** or similar for the main FastAPI app.
- **models.py** for defining Pydantic models and SQLAlchemy database models.
- **intents.py** for defining the intent detection logic.
- **database.py** for SQLite connection and management.
- A `.env` template and `poetry.lock` for dependencies.
- SQLAlchemy migrations or setup for managing the database schema.
- A clear `README.md` that explains how to set up and run the application, along with API documentation.
- detailed documentation in /docs folder with installation, user guide, configuration.
- create install.sh in root folder that installs poetry, and python application.

Ensure robust documentation for extending the system, especially for adding new intents, integrating other APIs, and handling different output formats from OpenAI.



---
File: /federated-mcp-main/supa_src/README.md
---

# Cline Integration Guide: RUV Bounce Method with Site-Mocking Unit Testing

This guide provides an enhanced integration of **Cline** with the RUV Bounce Method, leveraging **Requirements Refinement**, **Unification of Architecture and AI**, and **Validation and Verification** with an automated, test-first framework. Here, we’ll use multi-hop, elaborated prompts to ensure a comprehensive and structured workflow for setting up, validating, and implementing components within the project.

# Introduction to RUV Bounce Method

The **RUV Bounce Method**, enhanced with **Cline Integration**, brings a new level of precision and efficiency to AI-native development. This approach shifts development from traditional code-first workflows to a **test-first, requirement-driven** methodology, where AI plays an integral role at every stage—from defining requirements to real-time deployment validation. At the heart of this workflow is **Cline**, an autonomous coding agent that leverages AI to automate complex, multi-step processes, enabling developers to focus on high-level strategy, system architecture, and refinement rather than manually handling each aspect of implementation.

### Why Integrate Cline with the RUV Bounce Method?

The RUV Bounce Method emphasizes **Requirements Refinement, Unification of Architecture and AI,** and **Validation and Verification** (RUV). These stages ensure that every feature, function, and system component aligns with project goals, adheres to architectural standards, and passes rigorous quality control. Cline is especially valuable within this framework, as it supports each phase with **automated, multi-hop prompts** and **real-time guidance**—transforming the entire development cycle.

**Requirements Refinement** is a cornerstone of the RUV Bounce Method. In traditional development, requirements evolve alongside code, creating potential misalignments or gaps in functionality. With Cline, developers can start with clear, AI-supported tests, instantly validating requirements within a mocked environment. This approach minimizes risk by identifying missing requirements or potential issues before full code implementation, saving time and reducing errors.

**Unification of Architecture and AI** ensures that AI capabilities are foundational, not just add-ons. By using Cline for component testing and AI integration within the architecture, developers can optimize performance and alignment, ensuring AI-driven components fit seamlessly into the system.

**Validation and Verification** are where Cline’s automated test execution, error monitoring, and feedback loops excel. With Cline, developers can run tests across different environments, configurations, and edge cases, ensuring code works reliably and securely in production. Cline’s real-time monitoring and automated debugging further refine this process, catching potential issues before they escalate.

### Key Benefits of Cline Integration with the RUV Bounce Method

1. **Enhanced Productivity**: Cline’s multi-step prompt capabilities allow developers to automate repetitive tasks and streamline complex workflows, cutting down development time without sacrificing quality.

2. **Increased Accuracy and Quality Control**: By defining requirements as test cases and using Cline to refine these tests, developers reduce the risk of missed features, hidden bugs, or unforeseen issues. Cline provides prompt-based guidance, encouraging thoroughness at each step.

3. **Early Detection and Prevention of Issues**: Mock environments help identify potential failures or errors early, allowing teams to address them before they reach production. This test-first approach, powered by Cline’s real-time feedback, ensures that issues are fixed quickly and thoroughly.

4. **Scalability and Adaptability**: The combination of AI-powered test automation and flexible architecture enables projects to scale seamlessly. Whether deploying new features, adapting to new requirements, or handling larger datasets, Cline’s integration supports scalability.

5. **Enhanced Security and Compliance**: Cline facilitates thorough validation of authentication, authorization, and security protocols, ensuring robust, secure systems across environments. It supports test-driven security measures, helping developers manage sensitive data and prevent unauthorized access.

6. **Streamlined Documentation and Knowledge Sharing**: Cline’s test-first and requirements-driven approach helps document each phase automatically, making it easier for teams to follow, audit, or onboard new developers. Detailed prompts create a clear trail of development decisions, aiding transparency.

By integrating Cline into the RUV Bounce Method, organizations can transition to a **more resilient, agile, and AI-empowered development approach**. This integration optimizes time, reduces manual work, and enhances the overall quality of code, making it ideal for modern development projects where precision, security, and scalability are paramount.

---

## Project Structure Overview

This project utilizes a Supabase-based architecture, organized for serverless functions, migrations, and documentation:

```plaintext
supabase/
├── functions/                    # Serverless functions
│   ├── webhook-handler/          # Webhook processing endpoint
│   │   ├── index.ts              # Main handler logic
│   │   ├── test.ts               # Handler tests
│   │   ├── deploy.sh             # Deployment script
│   │   └── .env.test             # Test environment config
│   ├── deno.json                 # Deno configuration
│   └── deno.lock                 # Deno dependencies lock
├── migrations/                   # Database migrations
│   └── 20240101000000_create_meeting_data.sql
├── config.toml                   # Supabase configuration
└── project.toml                  # Project settings

docs/                              # Documentation
├── api_documentation.md          # API specs
└── user_guide.md                 # Usage guide
```

### Project Structure Diagram

```mermaid
graph TD
    A[supabase] --> B[functions]
    B --> C[webhook-handler]
    C --> C1[index.ts]
    C --> C2[test.ts]
    C --> C3[deploy.sh]
    C --> C4[.env.test]
    B --> D[deno.json]
    B --> E[deno.lock]
    A --> F[migrations]
    F --> F1[20240101000000_create_meeting_data.sql]
    A --> G[config.toml]
    A --> H[project.toml]
    A --> I[docs]
    I --> I1[api_documentation.md]
    I --> I2[user_guide.md]
```

---

## Setup and Configuration for Cline

1. **Install Cline Extension**: Download the [Cline extension](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) from the VS Code marketplace.
2. **Open Cline**: Use `CMD/CTRL + Shift + P` and select "Cline: Open In New Tab".
3. **Configure API Provider**: Link Cline to an API provider (e.g., OpenRouter) for optimal performance.
4. **Set Project Context**: Set the project’s root directory to provide Cline access to relevant file structures and dependencies.
5. Install demo ```curl -fsSL https://deno.land/x/install/install.sh | sh1 ```
---
Here are some straightforward examples to help you start using Cline within the RUV Bounce Method, covering essential tasks from test-driven development to basic function implementation. These will help you get comfortable with setting up and running Cline multi-hop prompts for both mock tests and actual code.

---

### Example 1: Simple Mock Test for Webhook Handler

This example sets up a basic mock test to validate that the webhook handler processes payloads correctly.

```plaintext
# Step 1: Define Mock Test for Webhook Handler
"Create a mock test in supabase/functions/webhook-handler/test.ts to validate payload processing for the webhook handler.
  - Test case 1: A valid payload returns a 200 response.
  - Test case 2: An invalid payload (e.g., missing fields) returns a 400 response.
Make sure each test checks the response status and verifies error handling for malformed payloads."

# Step 2: Run the Mock Test
"Run the test cases in webhook-handler/test.ts and display the results, ensuring both cases execute as expected."
# Continue until there are no errors.
```

---

### Example 2: Simple Intent Detection with AI Integration

Here, we’ll set up a mock test for an AI-powered function that detects intents in a meeting transcript.

```plaintext
# Step 1: Define Mock Test for Intent Detection
"Set up a mock test in supabase/functions/webhook-handler/test.ts to validate the AI-powered intent detection function.
  - Test case 1: A valid meeting transcript with clear intents.
  - Test case 2: An empty or invalid transcript that returns a 'no intent detected' error.
Use basic inputs to verify that the function can handle both expected and edge cases."

# Step 2: Implement Intent Detection Function
"Using the mock test as a guide, create the intent detection function in webhook-handler/index.ts. This function should send the transcript data to OpenAI’s API, receive a response, and handle cases where the confidence is low."

# Step 3: Run and Verify
"Run the mock tests in test.ts to ensure that the function handles valid and invalid transcripts appropriately. Refine error handling if any test case fails."
# Continue until there are no errors.
```

---

### Example 3: Environment Configuration Check

This example helps validate that environment variables load correctly across different configurations, a basic but essential test.

```plaintext
# Step 1: Define Environment Configuration Mock Test
"Create a mock test in supabase/functions/webhook-handler/test.ts to validate that required environment variables load correctly.
  - Test case 1: All required variables (API keys, URLs) are present and correctly configured.
  - Test case 2: A missing variable generates a specific error message.
Ensure each test reads from .env.test and config.toml."

# Step 2: Run Environment Tests
"Run the environment configuration tests in webhook-handler/test.ts, and display results. Adjust configurations if any environment variables are missing or incorrectly set."
# Continue until there are no errors.
```

---

### Example 4: Basic Database Test for Meeting Data Migration

This example validates a simple database migration to ensure that the schema aligns with requirements for storing meeting data.

```plaintext
# Step 1: Define Mock Test for Meeting Data Schema
"Set up a mock test in supabase/migrations/test_meeting_data.sql to verify the meeting_data table schema.
  - Test case 1: Ensure all required fields (e.g., meeting_id, timestamp) are present.
  - Test case 2: Check data constraints like non-null fields and unique meeting_id.
This should confirm that the schema matches expectations and constraints are enforced."

# Step 2: Validate Schema in Mock Test
"Run the test for meeting_data migration in supabase/migrations and report results. Ensure that all schema and constraints match requirements."

# Continue until there are no errors.
```

---

### Example 5: End-to-End Workflow Test from Webhook to Database

This end-to-end example tests the complete workflow, verifying that data moves from the webhook to storage in the database.

```plaintext
# Step 1: Define End-to-End Test
"Create an end-to-end mock test in supabase/functions/webhook-handler/test.ts to cover the flow from webhook receipt to database storage.
  - Test case 1: A valid webhook payload that is processed and stored in the meeting_data table.
  - Test case 2: An invalid payload that returns a 400 error and does not store any data.
Ensure all steps verify responses and confirm data integrity in the meeting_data table."

# Step 2: Implement Workflow Logic Based on Tests
"Implement the logic in webhook-handler/index.ts to match the test cases. Ensure the handler checks payload validity, processes data, and stores results in the database."

# Step 3: Run and Refine Tests
"Run the end-to-end tests in webhook-handler/test.ts and verify the complete workflow from input to database. Refine any parts of the function that fail, ensuring a smooth end-to-end flow."

# Continue until there are no errors.
```

---

These examples provide a foundational start to using Cline in an RUV Bounce Method workflow. By combining mock tests with targeted, specific prompts, you’ll be able to build confidence in your setup and ensure each component meets its requirements before full implementation.

## Multi-Hop Prompts for Cline: Step-by-Step Workflow with Chain of Thought Reasoning

The following sections provide elaborate multi-hop prompts to guide you through the RUV Bounce Method stages. Each prompt incorporates detailed reasoning to refine requirements, unify architecture, and validate the final implementation.

### 1. Webhook Handler Example with Requirements Refinement

This example uses multi-hop prompts to validate both successful and unsuccessful payload processing with symbolic reasoning.

```plaintext
# Step 1: Define Mock Tests with Chain of Thought for Webhook Handler
"Create mock tests for the webhook-handler function in supabase/functions/webhook-handler/test.ts. The tests should cover the following cases:
  1. Successful payload processing where valid data returns a 200 response.
  2. Failed payload processing where missing fields return a 400 error.
  3. Security: Add a check to ensure only authenticated requests are processed.
Consider edge cases, such as empty payloads, malformed data, and unauthorized access. Walk through the logic to ensure all branches of input validation are covered."

# Step 2: Implement the Webhook Handler with Symbolic Reasoning
"Using the test cases in webhook-handler/test.ts as a basis, create the webhook handler function in supabase/functions/webhook-handler/index.ts. Ensure:
  - The function first checks authentication and authorization.
  - It validates payload format and field completeness.
  - It handles errors gracefully, mapping errors to respective status codes (200 for success, 400 for bad request, 403 for unauthorized).
Write the function modularly, allowing each validation step to be isolated and tested independently."

# Step 3: Execute and Refine the Mock Tests
"Run the tests in supabase/functions/webhook-handler/test.ts to validate webhook-handler/index.ts. Identify any failing cases, particularly around edge cases, and refine the function’s error handling and validation logic to pass all tests."
# Continue until there are no errors.
```

---

### 2. Database Migration Testing with Advanced Options

This example tests the database schema and data integrity with symbolic reasoning for constraints and edge cases.

```plaintext
# Step 1: Set Up Mock Tests for Migration Validation
"Generate mock tests for the meeting_data table in supabase/migrations/20240101000000_create_meeting_data.sql. Test cases should include:
  - Schema structure: Verify field names, types, and primary keys.
  - Data integrity: Test constraints such as non-null fields, unique identifiers, and foreign key relationships.
  - Error handling: Validate error responses for schema violations (e.g., missing required fields, duplicate entries).
Use symbolic reasoning to analyze how these constraints may interact with each other during operations."

# Step 2: Implement Data Operations with Stepwise Testing
"Implement basic data operations (INSERT, UPDATE, SELECT) for the meeting_data table in a temporary script to validate data integrity. Test scenarios:
  - Valid insertion of complete records.
  - Duplicate entries handling to ensure unique constraints are enforced.
  - Foreign key integrity to ensure related tables are referenced correctly.
Add comments explaining how each constraint enforces schema integrity and potential implications for future operations."

# Step 3: Validate Schema Constraints with Mock Test Execution
"Run all schema validation tests to confirm that meeting_data in supabase/migrations works as intended. If any constraint violations arise, provide detailed reasoning for each adjustment and its impact on overall data integrity."
# Continue until there are no errors.
```

---

### 3. AI Intent Detection for Transcript Analysis with Chain of Thought Prompts

This example covers setting up AI-driven intent detection with structured prompts for reasoning through intent validation.

```plaintext
# Step 1: Define Mock Tests for AI Intent Detection
"Create mock tests for the intent detection feature in supabase/functions/webhook-handler/test.ts. Include cases where:
  - A valid meeting transcript is processed to extract specific intents.
  - An empty transcript returns a clear, structured error message.
  - Invalid inputs (e.g., non-text data) are handled gracefully.
Consider the reasoning flow that an AI model would follow, outlining how intent extraction relies on structured, meaningful inputs. Outline expectations for different levels of AI confidence in detected intents."

# Step 2: Implement Intent Detection Function with AI Integration
"Based on the test cases in test.ts, implement an AI-powered intent detection function in webhook-handler/index.ts. This function should:
  - Send the transcript data to OpenAI's API, expecting structured responses containing identified intents.
  - Handle responses with low confidence by returning a 'no intent detected' message.
Break down each logical step within the function, ensuring modularity to handle both valid and invalid AI responses independently."

# Step 3: Test and Refine AI Interaction in the Mock Environment
"Run the intent detection tests in test.ts. Evaluate how the AI model handles various inputs, adjusting the function to improve handling for low-confidence cases or ambiguous results. Refine the logic so that all intents are either confidently identified or explicitly marked as undetected."
# Continue until there are no errors.
```

---

### 4. Comprehensive Integration and Environment Validation

This example uses multi-hop prompts to validate integrations and environment settings.

```plaintext
# Step 1: Verify Integration with Supabase Environment
"Create a mock test in supabase/functions/webhook-handler/test.ts to validate the integration between webhook-handler/index.ts and the Supabase database. This should cover:
  - Correct environment variable loading from .env.test.
  - Read and write access to the meeting_data table.
  - Handling of connection errors (e.g., invalid credentials).
Include chain-of-thought reasoning around potential failure points, such as network issues or incorrect configurations, and consider ways to log or alert for these cases."

# Step 2: Implement Cross-Environment Testing Logic
"Add functionality to webhook-handler/index.ts that checks the environment variables dynamically. This function should:
  - Validate that all required environment variables are present and correctly configured.
  - Handle missing configurations gracefully, logging a detailed error message.
Test this logic with .env.test and config.toml, verifying that all configurations are loaded correctly and that missing variables produce informative errors."

# Step 3: Execute Integration Tests Across Different Environments
"Run integration tests in webhook-handler/test.ts across multiple environments (.env.test and production). Verify that the system behaves as expected in each environment, focusing on the accuracy of environment-specific configurations. Ensure that all environment-based logic is functioning consistently."

# Continue until there are no errors.
```

---

### 5. Advanced Testing and Security Validation

This example validates authentication and security configurations with symbolic reasoning for security constraints.

```plaintext
# Step 1: Set Up Mock Security Tests for Webhook Authentication
"Create mock tests in webhook-handler/test.ts for security, focusing on:
  - Authentication: Only authenticated requests should reach the main function.
  - Authorization: Unauthorized roles should not access certain endpoints.
  - Validation: Add a layer of validation to check that tokens meet required standards.
Consider symbolic reasoning for how these constraints affect security and ensure only valid tokens allow access."

# Step 2: Implement Authentication and Authorization Checks
"Implement authentication and authorization logic in webhook-handler/index.ts to match the test cases. Ensure that

:
  - Unauthorized requests return a 403 response immediately.
  - Only authenticated users with specific roles can access certain data.
Use reasoning to describe how security checks integrate with each function step, clarifying the order in which they should run for optimal security."

# Step 3: Validate Security Layers and Refine Error Handling
"Run security tests in webhook-handler/test.ts. Evaluate any failed cases and refine error messages to be descriptive but not expose sensitive information. Adjust authorization checks to ensure that only necessary data is accessible per user role."
# Continue until there are no errors.
```

---

## Best Practices for Using Cline with the RUV Bounce Method

1. **Test-First Approach**: Begin each development cycle by defining and validating mock tests before implementing full functionality.
2. **Environment-Specific Tests**: Verify configurations across environments using `.env.test` and `config.toml`.
3. **Refine Reasoning with Detailed Prompts**: Use symbolic and chain-of-thought reasoning in prompts to guide complex logic, security, and validation.

## Resources

- [Cline VS Code Extension](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)
- [Cline Documentation](https://github.com/cline/cline/wiki)

Using these advanced prompts and structured project workflows, you can effectively leverage **Cline** within the **RUV Bounce Method**, ensuring robust testing, clear validation, and efficient development.



---
File: /federated-mcp-main/supa_src/SPECIFICATION.md
---

# Project Specification

## Functional Requirements

1. Webhook Endpoint:
   - Receive requests from Fireflies
   - Query Fireflies API for transcripts
   - Implement error handling (retries, timeouts, API failures)
   - Ensure security (API keys or OAuth)

2. Intent Detection:
   - Process transcripts to detect intents:
     - Follow-up
     - Proposal
     - SOW
     - Coding
     - Technical specification
     - Functional specification
     - Documentation
     - Project management
     - Product features
     - Tool selection
   - Use OpenAI for processing transcript sections
   - Implement a dictionary of intents for matching

3. Data Storage:
   - Use SQLite database via SQLAlchemy
   - Store data for each step:
     - Initial webhook request
     - Transcript
     - Detected intents
     - Final OpenAI output
   - Implement database migrations

4. OpenAI Integration:
   - Use GPT-4o-mini for structured outputs
   - Ensure flexibility to switch models if needed
   - Generate outputs formatted to match identified intents

5. Tool Selection/Execution:
   - Trigger appropriate tools/services based on detected intent
   - Provide an expandable execution framework

## Non-Functional Requirements

1. Technology Stack:
   - Python
   - Pydantic
   - FastAPI
   - SQLAlchemy
   - LiteLLM
   - Poetry for dependency management

2. Security:
   - Store credentials securely in .env file
   - Implement API key or OAuth authentication

3. Logging and Debugging:
   - Implement comprehensive logging
   - Provide guidance on debugging common issues

4. Documentation:
   - Clear README.md with setup and run instructions
   - API documentation
   - Guidance on extending the system (new intents, APIs, output formats)

5. Environment:
   - Use Poetry for dependency management
   - Provide setup script or instructions

## User Scenarios

1. Receiving a Fireflies webhook:
   - System receives webhook request
   - Validates request and extracts meeting ID
   - Queries Fireflies API for transcript
   - Processes transcript for intent detection
   - Generates structured output based on intent
   - Stores all data in database
   - Returns response to webhook sender

2. Adding a new intent:
   - Developer updates intent dictionary
   - Implements new processing logic if required
   - Updates OpenAI prompt to handle new intent
   - Tests new intent with sample transcripts

3. Debugging a failed webhook:
   - Admin checks logs for error messages
   - Verifies API credentials and connectivity
   - Checks database for partial data storage
   - Reviews OpenAI response for any issues

## UI/UX Guidelines

As this is primarily a backend service, there is no direct user interface. However, for any potential admin interface or API documentation:

- Use clear, concise language
- Provide examples for API requests and responses
- Use consistent formatting and structure
- Implement proper error messages and status codes
# Fireflies Webhook Specification

## Functional Requirements

1. Webhook Endpoint:
   - Receive POST requests from Fireflies
   - Authenticate incoming requests
   - Query Fireflies API for transcripts
   - Handle errors, retries, and timeouts

2. Intent Detection:
   - Process transcripts to detect intents
   - Use OpenAI for intent detection
   - Implement a dictionary of intents for matching

3. Action Execution:
   - Execute actions based on detected intents
   - Use OpenAI for structured output generation
   - Support various output formats based on intent

4. Data Storage:
   - Save webhook requests, transcripts, intents, and outputs in SQLite database
   - Implement database migrations

## Non-Functional Requirements

1. Security:
   - Implement API key authentication
   - Store credentials securely in .env file

2. Performance:
   - Handle concurrent requests efficiently
   - Optimize database queries

3. Scalability:
   - Design for potential future growth
   - Allow easy addition of new intents and actions

4. Maintainability:
   - Use clear code structure and documentation
   - Implement logging for monitoring and debugging

## Technology Stack

- Python 3.9+
- FastAPI
- Pydantic
- SQLAlchemy
- LiteLLM
- GPT-4o-mini (via OpenAI)
- Poetry for dependency management

## User Scenarios

1. Fireflies sends a webhook request with a meeting ID
2. System retrieves transcript from Fireflies API
3. System detects intents in the transcript
4. System generates structured output based on intents
5. System stores all data and responds to the webhook request

## UI/UX Guidelines

As this is an API-based system, there is no direct user interface. However, the API responses should be:

- Clear and consistent in format
- Well-documented for ease of integration
- Provide meaningful error messages



---
File: /federated-mcp-main/supa_src/start.md
---




---
File: /federated-mcp-main/Dockerfile
---

FROM denoland/deno:1.40.2

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY deno.json* ./
COPY import_map.json* ./

# Copy source code
COPY . .

# Install dependencies and cache
RUN deno cache src/apps/deno/server.ts

# Build the application
RUN deno compile \
    --allow-net \
    --allow-env \
    --allow-read \
    --allow-write \
    --allow-run \
    src/apps/deno/server.ts

# Create production image
FROM denoland/deno:1.40.2-slim

WORKDIR /app

# Copy the compiled binary
COPY --from=0 /app/server ./

# The port that your application listens to
EXPOSE 3000

# Create and use non-root user
RUN chown -R deno:deno /app
USER deno

# Start the server
CMD ["./server"]



---
File: /federated-mcp-main/README.md
---

# AI Federation Network

A distributed runtime system for federated AI services with edge computing capabilities.

# Complete implementation following the official MCP specification:

The Model Context Protocol (MCP) enables federated connections between AI systems and various data sources through a standardized architecture. Here’s a complete implementation following the official specification:

This implementation provides a foundation for building federated MCP systems that can scale across multiple servers while maintaining the protocol’s security and standardization requirements. The federation layer enables seamless communication between different MCP servers, allowing AI systems to maintain context while moving between different tools and datasets.

The implementation supports both local and remote connections through multiple transport mechanisms, including stdio for local process communication and HTTP with Server-Sent Events for remote connections.

Security is maintained through strict capability negotiation and user consent requirement

Model Context Protocol (MCP) with Federation Support

## Key Benefits

**Simplified Integration**:
- Eliminates custom connections for each data source
- Standardizes AI connections with enterprise tools
- Maintains context across federated tools and datasets

## Federation Architecture

**Core Components**:
- Federation Controller: Manages cross-server communication
- Proxy Layer: Handles authentication between federated servers
- Identity Management: Controls access across federated instances

## Basic Structure

**System Components**:
- MCP Hosts: AI applications needing federated data access
- MCP Servers: Programs providing federated resource access
- MCP Clients: Components maintaining federated connections
- Federation Proxy: Manages cross-server authentication

## Real-World Applications

**Implementation Areas**:
- Development tools with federated code repositories
- Enterprise systems with distributed databases
- Cross-organizational content repositories
- Multi-region business tool integration

## Security Features

**Protection Mechanisms**:
- Federated authentication and authorization
- Cross-server resource isolation
- Distributed consent management
- Encrypted cross-server communication
- Granular capability control

MCP with federation support enables secure, standardized AI system integration across organizational boundaries while maintaining strict security controls and seamless data access.

# Deno Nodejs version
complete implementation using both Deno and Node.js. Let's start with the project structure:


### 🌐 Network Protocols
- JSON-RPC 2.0
- HTTP/REST
- WebSocket

### ⚡ Edge Computing
- Multi-provider support (Supabase, Cloudflare Workers, Fly.io)
- Serverless function deployment
- Real-time logs and monitoring
- Auto-scaling capabilities

### 🔐 Security
- Provider-specific authentication
- Secure credential storage
- Environment isolation
- Access control

### 📡 Runtime Features
- Task execution
- Federation support
- Intent detection
- Meeting information processing
- Webhook handling
- Real-time status monitoring
- System health checks

## System Architecture

```mermaid
graph TD
    A[AI Federation Network] --> B[Core Runtime]
    B --> C[Edge Computing]
    B --> D[Network Layer]
    B --> E[Security]

    C --> F[Supabase]
    C --> G[Cloudflare]
    C --> H[Fly.io]

    D --> I[JSON-RPC]
    D --> J[HTTP/REST]
    D --> K[WebSocket]

    E --> L[Auth]
    E --> M[Credentials]
    E --> N[Access Control]
```

## Getting Started

```bash
# Run the server
deno run --allow-net --allow-env --allow-read --allow-write --allow-run src/apps/deno/server.ts
```

## License

MIT License - See LICENSE file for details.
