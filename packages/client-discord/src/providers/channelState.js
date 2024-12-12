import { ChannelType, } from "discord.js";
const channelStateProvider = {
    get: async (runtime, message, state) => {
        const discordMessage = state?.discordMessage ||
            state?.discordChannel;
        if (!discordMessage) {
            return "";
        }
        const guild = discordMessage?.guild;
        const agentName = state?.agentName || "The agent";
        const senderName = state?.senderName || "someone";
        if (!guild) {
            return (agentName +
                " is currently in a direct message conversation with " +
                senderName);
        }
        const serverName = guild.name; // The name of the server
        const guildId = guild.id; // The ID of the guild
        const channel = discordMessage.channel;
        if (!channel) {
            console.log("channel is null");
            return "";
        }
        let response = agentName +
            " is currently having a conversation in the channel `@" +
            channel.id +
            " in the server `" +
            serverName +
            "` (@" +
            guildId +
            ")";
        if (channel.type === ChannelType.GuildText &&
            channel.topic) {
            // Check if the channel is a text channel
            response +=
                "\nThe topic of the channel is: " +
                    channel.topic;
        }
        return response;
    },
};
export default channelStateProvider;
//# sourceMappingURL=channelState.js.map