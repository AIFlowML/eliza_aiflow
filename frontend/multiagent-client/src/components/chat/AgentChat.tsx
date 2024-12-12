import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Message, AgentType } from '../../lib/agent';
import { sendMessage } from '../../lib/api';
import { v4 as uuidv4 } from 'uuid';
import { agentLogger } from '../../lib/logger';

interface AgentChatProps {
    agentId: string;
}

export function AgentChat({ agentId }: AgentChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const mutation = useMutation({
        mutationFn: async (text: string) => {
            agentLogger[agentId as AgentType](`User message: ${text}`);
            const response = await sendMessage(agentId, text);
            agentLogger[agentId as AgentType](`API response received`);
            return response;
        },
        onSuccess: (responses) => {
            const newMessages = responses.map(response => ({
                id: uuidv4(),
                text: response.text,
                user: response.user,
                timestamp: Date.now(),
            }));
            setMessages(prev => [...prev, ...newMessages]);
            responses.forEach(response => {
                agentLogger[agentId as AgentType](`Agent response: ${response.text}`);
            });
        },
        onError: (error: Error) => {
            const errorMessage: Message = {
                id: uuidv4(),
                text: 'Failed to send message. Please try again.',
                user: 'system',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
            agentLogger.error(`${agentId} error: ${error.message}`);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        agentLogger[agentId as AgentType]('Processing user submission');
        const userMessage: Message = {
            id: uuidv4(),
            text: input,
            user: 'user',
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            await mutation.mutateAsync(input);
        } catch (error) {
            agentLogger.error(`Failed to process message: ${error}`);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-lg shadow">
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
                                    : message.user === 'system'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-900'
                            }`}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}
                {mutation.isPending && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={mutation.isPending}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}