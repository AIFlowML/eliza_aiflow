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