import { getVoiceConnection } from "@discordjs/voice";
import { ChannelType } from "discord.js";
const voiceStateProvider = {
    get: async (runtime, message, state) => {
        // Voice doesn't get a discord message, so we need to use the channel for guild data
        const discordMessage = (state?.discordMessage ||
            state.discordChannel);
        const connection = getVoiceConnection(discordMessage?.guild?.id);
        const agentName = state?.agentName || "The agent";
        if (!connection) {
            return agentName + " is not currently in a voice channel";
        }
        const channel = (state?.discordMessage ||
            state.discordChannel)?.guild?.channels?.cache?.get(connection.joinConfig.channelId);
        if (!channel || channel.type !== ChannelType.GuildVoice) {
            return agentName + " is in an invalid voice channel";
        }
        return `${agentName} is currently in the voice channel: ${channel.name} (ID: ${channel.id})`;
    },
};
export default voiceStateProvider;
//# sourceMappingURL=voiceState.js.map