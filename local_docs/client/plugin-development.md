# Plugin Development Guide

This guide provides detailed information about developing plugins for the Eliza framework.

## Table of Contents

1. [Plugin Basics](#plugin-basics)
2. [Development Setup](#development-setup)
3. [Plugin Components](#plugin-components)
4. [Testing](#testing)
5. [Deployment](#deployment)

## Plugin Basics

A plugin is a modular extension that adds functionality to the Eliza framework. Plugins can provide:

- Custom actions
- Data providers
- Specialized services
- Custom evaluators
- Client integrations

### Plugin Interface

```typescript
interface Plugin {
    name: string;           // Unique identifier
    description: string;    // Plugin description
    actions?: Action[];     // Custom actions
    providers?: Provider[]; // Data providers
    evaluators?: Evaluator[]; // Response evaluators
    services?: Service[];   // Specialized services
    clients?: Client[];     // Client implementations
}
```

## Development Setup

### Project Structure

```
plugin-[name]/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts          # Main entry point
│   ├── plugin.ts         # Plugin definition
│   ├── types.ts          # Type definitions
│   ├── actions/          # Action implementations
│   │   ├── index.ts
│   │   └── [action].ts
│   ├── providers/        # Data providers
│   │   ├── index.ts
│   │   └── [provider].ts
│   └── services/         # Specialized services
│       ├── index.ts
│       └── [service].ts
└── tests/
    ├── actions.test.ts
    └── providers.test.ts
```

### Configuration Files

#### package.json
```json
{
    "name": "@ai16z/plugin-[name]",
    "version": "1.0.0",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "scripts": {
        "build": "tsc",
        "test": "jest",
        "lint": "eslint src/**/*.ts"
    },
    "dependencies": {
        "@ai16z/eliza": "^1.0.0"
    },
    "devDependencies": {
        "typescript": "^4.5.0",
        "jest": "^27.0.0",
        "@types/jest": "^27.0.0"
    }
}
```

#### tsconfig.json
```json
{
    "compilerOptions": {
        "target": "es2020",
        "module": "commonjs",
        "declaration": true,
        "outDir": "./dist",
        "strict": true,
        "esModuleInterop": true
    },
    "include": ["src"],
    "exclude": ["node_modules", "tests"]
}
```

## Plugin Components

### 1. Actions

Actions define discrete operations that your plugin can perform:

```typescript
// src/actions/myAction.ts
import { Action, IAgentRuntime, Memory } from '@ai16z/eliza';

export const myAction: Action = {
    name: "MY_ACTION",
    description: "Performs a specific task",
    similes: ["ALTERNATE_NAME", "OTHER_TRIGGER"],
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        // Validation logic
        return true;
    },
    
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        // Action implementation
    }
};
```

### 2. Providers

Providers supply data or state information:

```typescript
// src/providers/myProvider.ts
import { Provider, IAgentRuntime, Memory } from '@ai16z/eliza';

export const myProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory) => {
        // Data retrieval logic
        return {
            data: "some data"
        };
    }
};
```

### 3. Services

Services handle specialized functionality:

```typescript
// src/services/myService.ts
import { Service, ServiceType, IAgentRuntime } from '@ai16z/eliza';

export class MyService extends Service {
    static serviceType = ServiceType.CUSTOM;

    async initialize(runtime: IAgentRuntime): Promise<void> {
        // Initialization logic
    }

    async customMethod(): Promise<void> {
        // Custom functionality
    }
}
```

## Testing

### Unit Tests

```typescript
// tests/actions.test.ts
import { myAction } from '../src/actions/myAction';

describe('MyAction', () => {
    const mockRuntime = {
        getSetting: jest.fn(),
        messageManager: {
            createMemory: jest.fn()
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should validate correctly', async () => {
        const result = await myAction.validate(mockRuntime as any);
        expect(result).toBe(true);
    });

    test('should handle action', async () => {
        await myAction.handler(mockRuntime as any);
        expect(mockRuntime.messageManager.createMemory).toHaveBeenCalled();
    });
});
```

### Integration Tests

```typescript
// tests/integration.test.ts
import { myPlugin } from '../src/plugin';
import { AgentRuntime } from '@ai16z/eliza';

describe('Plugin Integration', () => {
    let runtime: AgentRuntime;

    beforeAll(async () => {
        runtime = new AgentRuntime();
        await runtime.initialize();
    });

    test('should register plugin', async () => {
        await runtime.registerPlugin(myPlugin);
        // Verify plugin registration
    });
});
```

## Deployment

### Publishing

1. Build the plugin:
```bash
npm run build
```

2. Update version in package.json:
```json
{
    "version": "1.0.1"
}
```

3. Publish to npm:
```bash
npm publish
```

### Installation

Users can install your plugin using npm:

```bash
npm install @ai16z/plugin-[name]
```

### Usage

```typescript
import { myPlugin } from '@ai16z/plugin-[name]';
import { AgentRuntime } from '@ai16z/eliza';

const runtime = new AgentRuntime();
await runtime.registerPlugin(myPlugin);
```

### Best Practices

1. **Error Handling**
   - Implement comprehensive error handling
   - Use descriptive error messages
   - Log errors appropriately
   - Provide helpful feedback to users

2. **Performance**
   - Optimize resource usage
   - Implement caching where appropriate
   - Use efficient data structures
   - Monitor performance metrics

3. **Security**
   - Validate all inputs
   - Protect sensitive data
   - Use secure communication
   - Implement proper authentication

4. **Documentation**
   - Document all public APIs
   - Provide usage examples
   - Include troubleshooting guides
   - Keep documentation up to date
