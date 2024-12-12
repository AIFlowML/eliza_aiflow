// Eliza Framework Core
/* eslint-disable @typescript-eslint/no-unused-vars */
/*
import {
    // Agent Runtime
    AgentRuntime,
    IAgentRuntime,

    // Cache Management
    CacheManager,
    ICacheManager,
    DbCacheAdapter,
    FsCacheAdapter,
    IDatabaseCacheAdapter,

    // Database
    IDatabaseAdapter,

    // Character Configuration
    Character,
    defaultCharacter,
    validateCharacterConfig,

    // Clients and Models
    Clients,
    ModelProviderName,

    // Utilities
    settings,
    stringToUuid,

    // Logging
    elizaLogger,
} from "@ai16z/eliza";/*
/* eslint-enable @typescript-eslint/no-unused-vars */

// Local Imports
import { AgentChat } from '../components/chat/AgentChat';
import { AGENT_IDS } from '../lib/agent';

export default function SubmissionPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Submission Agent
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Handles final task submissions and deliverables. This agent ensures all requirements are met before submission.
                    </p>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-4 py-5 sm:p-6">
                            <AgentChat agentId={AGENT_IDS.submission} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}