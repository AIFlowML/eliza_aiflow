export interface Message {
    id: string;
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