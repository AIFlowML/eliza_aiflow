# Eliza Framework Client Interface Documentation

## Overview
The Eliza Framework client interface provides a modern, responsive web application for interacting with AI agents. This document explains how to set up, customize, and extend the client interface.

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and configurations
│   ├── assets/        # Static assets (images, icons)
│   ├── App.tsx        # Main application component
│   ├── Chat.tsx       # Chat interface component
│   ├── Agent.tsx      # Agent management component
│   └── router.tsx     # Application routing
├── public/           # Static public assets
└── package.json      # Project dependencies
```

## Technology Stack
- React 18+ with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Shadcn UI for components
- React Router for navigation

## Quick Start

### 1. Installation
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### 2. Environment Configuration
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_AGENT_ENDPOINT=/api/agents
```

## Core Components

### 1. Chat Interface
```tsx
// src/components/ChatInterface.tsx
import { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { ChatMessage } from '../components/ChatMessage';
import { AgentTerminal } from '../components/AgentTerminal';

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const ws = useWebSocket();

    const sendMessage = async (text: string) => {
        const message = {
            type: 'user_message',
            content: text,
            timestamp: Date.now()
        };
        ws.send(JSON.stringify(message));
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} />
                ))}
            </div>
            <div className="border-t p-4">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 rounded-md border p-2"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Send
                    </button>
                </div>
            </div>
            <AgentTerminal />
        </div>
    );
}
```

### 2. Agent Terminal
```tsx
// src/components/AgentTerminal.tsx
import { useState, useEffect } from 'react';
import { useAgentLogs } from '../hooks/useAgentLogs';

export function AgentTerminal() {
    const { logs, isConnected } = useAgentLogs();

    return (
        <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-white">Agent Terminal</h3>
                <span className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
            </div>
            <div className="h-48 overflow-y-auto">
                {logs.map((log, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
}
```

### 3. Agent Selection
```tsx
// src/components/AgentSelector.tsx
import { useAgents } from '../hooks/useAgents';

export function AgentSelector() {
    const { agents, selectedAgent, selectAgent } = useAgents();

    return (
        <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-2">Available Agents</h2>
            <div className="flex gap-2">
                {agents.map(agent => (
                    <button
                        key={agent.id}
                        onClick={() => selectAgent(agent.id)}
                        className={`px-4 py-2 rounded-md ${
                            selectedAgent?.id === agent.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100'
                        }`}
                    >
                        {agent.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
```

## Custom Hooks

### 1. WebSocket Connection
```typescript
// src/hooks/useWebSocket.ts
import { useState, useEffect } from 'react';

export function useWebSocket() {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = new WebSocket(import.meta.env.VITE_WS_URL);

        socket.onopen = () => {
            setIsConnected(true);
        };

        socket.onclose = () => {
            setIsConnected(false);
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    return { ws, isConnected };
}
```

### 2. Agent Logs
```typescript
// src/hooks/useAgentLogs.ts
import { useState, useEffect } from 'react';

export function useAgentLogs() {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const eventSource = new EventSource(
            `${import.meta.env.VITE_API_URL}/agent-logs`
        );

        eventSource.onmessage = (event) => {
            setLogs(prev => [...prev, event.data]);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return { logs };
}
```

## Styling Guide

### 1. TailwindCSS Configuration
```javascript
// tailwind.config.js
module.exports = {
    content: ['./src/**/*.{ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                terminal: {
                    bg: '#1a1a1a',
                    text: '#00ff00',
                    error: '#ff0000',
                    warning: '#ffff00',
                    info: '#00ffff',
                },
                chat: {
                    user: '#e3f2fd',
                    agent: '#f5f5f5',
                    timestamp: '#9e9e9e',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            height: {
                'chat': 'calc(100vh - 4rem)', // Full height minus header
            },
            maxHeight: {
                'terminal': '20vh',
                'chat-messages': 'calc(70vh - 4rem)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
};
```

### 2. Global Styles
```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
    .chat-container {
        @apply flex flex-col h-chat bg-white dark:bg-gray-800;
    }

    .chat-messages {
        @apply flex-1 overflow-y-auto p-4 space-y-4;
    }

    .chat-input {
        @apply border-t dark:border-gray-700 p-4 bg-white dark:bg-gray-800;
    }

    .message-bubble {
        @apply rounded-lg p-3 max-w-[80%];
    }

    .user-message {
        @apply bg-chat-user dark:bg-blue-900 ml-auto;
    }

    .agent-message {
        @apply bg-chat-agent dark:bg-gray-700 mr-auto;
    }

    .terminal-window {
        @apply font-mono bg-terminal-bg text-terminal-text p-4 rounded-lg
               shadow-lg overflow-y-auto max-h-terminal;
    }
}
```

## Complete Example: Simple Chat Page

### 1. Page Layout Component
```tsx
// src/components/ChatPage.tsx
import { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { AgentTerminal } from './AgentTerminal';

export function ChatPage() {
    const [isTerminalVisible, setIsTerminalVisible] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="h-16 bg-white dark:bg-gray-800 shadow-sm">
                <div className="container mx-auto px-4 h-full flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Eliza Chat Interface
                    </h1>
                    <button
                        onClick={() => setIsTerminalVisible(!isTerminalVisible)}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                    >
                        {isTerminalVisible ? 'Hide Terminal' : 'Show Terminal'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="chat-container rounded-lg shadow-lg">
                    {/* Chat Messages */}
                    <div className="chat-messages">
                        <ChatMessages />
                    </div>

                    {/* Terminal (Collapsible) */}
                    {isTerminalVisible && (
                        <div className="border-t dark:border-gray-700">
                            <AgentTerminal />
                        </div>
                    )}

                    {/* Chat Input */}
                    <ChatInput />
                </div>
            </main>
        </div>
    );
}
```

### 2. Chat Messages Component
```tsx
// src/components/ChatMessages.tsx
import { useEffect, useRef } from 'react';
import { Message } from '../types';
import { useMessages } from '../hooks/useMessages';

export function ChatMessages() {
    const { messages } = useMessages();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="space-y-4">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`message-bubble ${
                        message.type === 'user' ? 'user-message' : 'agent-message'
                    }`}
                >
                    <div className="flex items-start">
                        {message.type === 'agent' && (
                            <div className="w-8 h-8 rounded-full bg-blue-500 mr-2" />
                        )}
                        <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {message.type === 'user' ? 'You' : 'Agent'}
                            </div>
                            <div className="prose dark:prose-invert max-w-none">
                                {message.content}
                            </div>
                            <div className="text-xs text-chat-timestamp mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}
```

### 3. Chat Input Component
```tsx
// src/components/ChatInput.tsx
import { useState } from 'react';
import { useChatActions } from '../hooks/useChatActions';

export function ChatInput() {
    const [message, setMessage] = useState('');
    const { sendMessage, isLoading } = useChatActions();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            await sendMessage(message);
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="chat-input">
            <div className="flex gap-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-md border-gray-300 dark:border-gray-600
                             dark:bg-gray-700 dark:text-white focus:ring-2
                             focus:ring-blue-500 dark:focus:ring-blue-400"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md
                             hover:bg-blue-600 focus:outline-none focus:ring-2
                             focus:ring-blue-500 focus:ring-offset-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </form>
    );
}
```

### 4. Custom Hooks for Chat Functionality
```typescript
// src/hooks/useChatActions.ts
import { useState } from 'react';
import { useWebSocket } from './useWebSocket';

export function useChatActions() {
    const [isLoading, setIsLoading] = useState(false);
    const ws = useWebSocket();

    const sendMessage = async (text: string) => {
        if (!ws) throw new Error('WebSocket not connected');

        setIsLoading(true);
        try {
            const message = {
                type: 'user_message',
                content: text,
                timestamp: Date.now(),
            };
            ws.send(JSON.stringify(message));
        } finally {
            setIsLoading(false);
        }
    };

    return { sendMessage, isLoading };
}

// src/hooks/useMessages.ts
import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { Message } from '../types';

export function useMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const ws = useWebSocket();

    useEffect(() => {
        if (!ws) return;

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prev) => [...prev, message]);
        };
    }, [ws]);

    return { messages };
}
```

### 5. Types Definition
```typescript
// src/types/index.ts
export interface Message {
    type: 'user' | 'agent';
    content: string;
    timestamp: number;
}

export interface AgentLog {
    level: 'info' | 'error' | 'warning';
    message: string;
    timestamp: number;
}
```

### 6. Connection with Eliza Framework
```typescript
// src/lib/eliza.ts
export class ElizaClient {
    private ws: WebSocket;
    private apiUrl: string;

    constructor() {
        this.apiUrl = import.meta.env.VITE_API_URL;
        this.ws = new WebSocket(import.meta.env.VITE_WS_URL);
    }

    public async initialize() {
        return new Promise((resolve, reject) => {
            this.ws.onopen = () => resolve(true);
            this.ws.onerror = (error) => reject(error);
        });
    }

    public async getAgents() {
        const response = await fetch(`${this.apiUrl}/agents`);
        return response.json();
    }

    public onMessage(callback: (message: any) => void) {
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            callback(data);
        };
    }

    public sendMessage(message: string) {
        this.ws.send(JSON.stringify({
            type: 'message',
            content: message,
            timestamp: Date.now()
        }));
    }
}
```

### 7. App Entry Point
```tsx
// src/App.tsx
import { useState, useEffect } from 'react';
import { ChatPage } from './components/ChatPage';
import { ElizaClient } from './lib/eliza';

export function App() {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const client = new ElizaClient();
        client.initialize()
            .then(() => setIsConnected(true))
            .catch((err) => setError(err.message));
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-red-500">
                    Failed to connect: {error}
                </div>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">
                    Connecting to Eliza...
                </div>
            </div>
        );
    }

    return <ChatPage />;
}
```

This complete example provides a fully functional chat interface that:
- Connects to the Eliza Framework
- Displays messages in a clean, modern interface
- Includes a collapsible terminal
- Handles loading and error states
- Provides real-time updates through WebSocket
- Is fully styled with TailwindCSS
- Supports dark mode
- Is responsive across different screen sizes

To use this example:
1. Copy the components into your project
2. Set up the environment variables
3. Install the required dependencies
4. Start the development server

The interface will automatically connect to your Eliza Framework instance and provide a clean, modern chat experience.

## API Integration

### 1. Agent Communication
```typescript
// src/lib/api.ts
export async function sendMessage(agentId: string, message: string) {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/${agentId}/message`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: message,
                timestamp: Date.now(),
            }),
        }
    );
    return response.json();
}
```

### 2. Agent Management
```typescript
// src/lib/agents.ts
export async function getAgents() {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/agents`
    );
    return response.json();
}

export async function getAgentLogs(agentId: string) {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/agents/${agentId}/logs`
    );
    return response.json();
}
```

## Deployment

### 1. Production Build
```bash
# Build the client
pnpm build

# Preview the build
pnpm preview
```

### 2. Environment Configuration
```env
# .env.production
VITE_API_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-api-domain.com
VITE_AGENT_ENDPOINT=/api/agents
```

## ChatGPT Prompts for Quick Development

### 1. Landing Page
```
Create a modern landing page for an AI agent chat interface using React, TypeScript, and TailwindCSS. Include:
- Hero section with a chat preview
- Features section highlighting agent capabilities
- Agent selection interface
- Dark/light mode toggle
- Responsive design for mobile and desktop
Use Shadcn UI components and follow modern design principles.
```

### 2. Chat Interface
```
Create a chat interface component using React and TypeScript that includes:
- Message history display
- Input field with send button
- Message typing indicators
- File attachment support
- Markdown rendering for messages
- Code syntax highlighting
- Emoji support
Use TailwindCSS for styling and ensure smooth animations.
```

### 3. Terminal Component
```
Create a terminal component that displays agent logs in real-time:
- Console-like interface
- Auto-scrolling
- Command history
- Color coding for different log types
- Collapsible/expandable interface
- Copy to clipboard functionality
Use a monospace font and terminal-like styling.
```

## Best Practices

### 1. Performance
- Implement virtualization for long message lists
- Use WebSocket for real-time communication
- Implement proper error boundaries
- Optimize bundle size with code splitting

### 2. Accessibility
- Follow WCAG guidelines
- Implement proper ARIA labels
- Ensure keyboard navigation
- Support screen readers

### 3. Error Handling
- Implement retry mechanisms for failed requests
- Show appropriate error messages
- Handle offline scenarios
- Provide fallback UI components

### 4. State Management
- Use React Query for API state
- Implement proper caching
- Handle loading and error states
- Maintain consistent UI state

## Testing

### 1. Component Testing
```typescript
// src/__tests__/ChatInterface.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { ChatInterface } from '../components/ChatInterface';

describe('ChatInterface', () => {
    it('sends messages correctly', () => {
        const { getByPlaceholderText, getByText } = render(<ChatInterface />);
        const input = getByPlaceholderText('Type your message...');
        const sendButton = getByText('Send');

        fireEvent.change(input, { target: { value: 'Hello' } });
        fireEvent.click(sendButton);

        expect(getByText('Hello')).toBeInTheDocument();
    });
});
```

### 2. Integration Testing
```typescript
// src/__tests__/AgentIntegration.test.tsx
import { render, waitFor } from '@testing-library/react';
import { AgentTerminal } from '../components/AgentTerminal';

describe('AgentTerminal', () => {
    it('displays agent logs', async () => {
        const { getByText } = render(<AgentTerminal />);

        await waitFor(() => {
            expect(getByText('Agent initialized')).toBeInTheDocument();
        });
    });
});
```

---
*Note: This documentation is continuously updated as we explore and understand more about the Eliza Framework client interface.*