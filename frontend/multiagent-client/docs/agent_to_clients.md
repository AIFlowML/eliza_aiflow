# Eliza Framework - React Client Integration Guide

## Directory Structure
```
your-app/
├── frontend/
│   └── react-client/              # React Web Client
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   │   ├── button.tsx
│       │   │   │   └── input.tsx
│       │   │   └── chat/
│       │   │       ├── DistributionChat.tsx
│       │   │       ├── EvaluationChat.tsx
│       │   │       ├── MilestoneChat.tsx
│       │   │       └── SubmissionChat.tsx
│       │   ├── pages/
│       │   │   ├── distribution.tsx
│       │   │   ├── evaluation.tsx
│       │   │   ├── milestone.tsx
│       │   │   └── submission.tsx
│       │   ├── lib/
│       │   │   └── agent.ts
│       │   └── App.tsx
│       ├── package.json
│       ├── vite.config.ts
│       └── .env
├── shared/                       # Shared utilities and types
│   ├── types/
│   │   └── agent.ts
│   └── utils/
│       └── api.ts
└── scripts/
    └── list-agents.ts
```

## Installation & Setup

1. Create a new Vite React project:
```bash
pnpm create vite frontend/react-client -- --template react-ts
cd frontend/react-client
```

2. Install dependencies:
```bash
pnpm add @ai16z/eliza @tanstack/react-query react-router-dom
```

3. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_AGENT_DISTRIBUTION=distribution
VITE_AGENT_EVALUATION=evaluation
VITE_AGENT_MILESTONE=milestone
VITE_AGENT_SUBMISSION=submission
```

## Implementation

### 1. Types Setup (src/lib/agent.ts)
```typescript
import { UUID } from '@ai16z/eliza';

export interface Message {
    id: UUID;
    text: string;
    user: string;
    timestamp: number;
}

export interface ChatResponse {
    text: string;
    user: string;
}

export const AGENT_IDS = {
    distribution: import.meta.env.VITE_AGENT_DISTRIBUTION,
    evaluation: import.meta.env.VITE_AGENT_EVALUATION,
    milestone: import.meta.env.VITE_AGENT_MILESTONE,
    submission: import.meta.env.VITE_AGENT_SUBMISSION
} as const;

export type AgentType = keyof typeof AGENT_IDS;
```

### 2. API Utils (src/lib/api.ts)
```typescript
import { ChatResponse } from './agent';

export async function sendMessage(agentId: string, text: string): Promise<ChatResponse[]> {
    const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/${agentId}/message`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                userId: 'user',
                roomId: `default-room-${agentId}`,
            }),
        }
    );

    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
}
```

### 3. Chat Component (src/components/chat/DistributionChat.tsx)
```typescript
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Message, ChatResponse, AGENT_IDS } from '../../lib/agent';
import { sendMessage } from '../../lib/api';
import { v4 as uuidv4 } from 'uuid';

export function DistributionChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const mutation = useMutation({
        mutationFn: (text: string) => sendMessage(AGENT_IDS.distribution, text),
        onSuccess: (responses) => {
            const newMessages = responses.map(response => ({
                id: uuidv4(),
                text: response.text,
                user: response.user,
                timestamp: Date.now(),
            }));
            setMessages(prev => [...prev, ...newMessages]);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: uuidv4(),
            text: input,
            user: 'user',
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, userMessage]);

        await mutation.mutateAsync(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-screen max-h-screen">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.user === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                message.user === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200'
                            }`}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={mutation.isPending}
                    />
                    <Button type="submit" disabled={mutation.isPending}>
                        Send
                    </Button>
                </div>
            </form>
        </div>
    );
}
```

### 4. Page Component (src/pages/distribution.tsx)
```typescript
import { DistributionChat } from '../components/chat/DistributionChat';

export default function DistributionPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Distribution Agent
                    </h1>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <DistributionChat />
                </div>
            </main>
        </div>
    );
}
```

### 5. App Setup (src/App.tsx)
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DistributionPage from './pages/distribution';
import EvaluationPage from './pages/evaluation';
import MilestonePage from './pages/milestone';
import SubmissionPage from './pages/submission';

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: '/distribution',
        element: <DistributionPage />,
    },
    {
        path: '/evaluation',
        element: <EvaluationPage />,
    },
    {
        path: '/milestone',
        element: <MilestonePage />,
    },
    {
        path: '/submission',
        element: <SubmissionPage />,
    },
]);

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}
```

### 6. Vite Configuration (vite.config.ts)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});
```

## Development Workflow

1. List available agents:
```bash
./scripts/list-agents.ts
```

2. Start development server:
```bash
cd frontend/react-client
pnpm dev
```

## Agent Pages

Each agent has its own dedicated page:
- Distribution: http://localhost:5173/distribution
- Evaluation: http://localhost:5173/evaluation
- Milestone: http://localhost:5173/milestone
- Submission: http://localhost:5173/submission

## LLM-Friendly Documentation Structure

### Component Organization
- Each agent has its own chat component
- Pages are organized by agent function
- Shared utilities in lib directory

### State Management
- Local state for messages
- React Query for API interactions
- Environment variables for configuration

### Type Safety
- TypeScript interfaces for all data structures
- Strict type checking for API responses
- Constant agent IDs for type safety

### Error Handling
- API error catching in mutations
- Loading states for better UX
- Proper error boundaries

### Performance Considerations
- Message batching
- Optimistic updates
- Proper cleanup

This implementation provides a clean, maintainable way to integrate multiple agents into specific pages of your React application, following the Eliza Framework patterns.