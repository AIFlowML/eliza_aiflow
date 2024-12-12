export const channelStateProvider = {
    get: async (runtime, message, state) => {
        const slackEvent = state?.slackEvent;
        if (!slackEvent) {
            return "";
        }
        const agentName = state?.agentName || "The agent";
        const senderName = state?.senderName || "someone";
        const channelId = slackEvent.channel;
        const channelType = slackEvent.channel_type;
        // For direct messages
        if (channelType === 'im') {
            return `${agentName} is currently in a direct message conversation with ${senderName}`;
        }
        // For channel messages
        let response = `${agentName} is currently having a conversation in the Slack channel <#${channelId}>`;
        // Add thread context if in a thread
        if (slackEvent.thread_ts) {
            response += ` in a thread`;
        }
        // Add team context if available
        if (slackEvent.team) {
            response += ` in the workspace ${slackEvent.team}`;
        }
        return response;
    },
};
//# sourceMappingURL=channelState.js.map