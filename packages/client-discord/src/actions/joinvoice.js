// eslint-disable-next-line
// @ts-nocheck
// src/actions/joinVoice
import { composeContext, } from "@ai16z/eliza";
import { ChannelType, } from "discord.js";
export default {
    name: "JOIN_VOICE",
    similes: [
        "JOIN_VOICE",
        "JOIN_VC",
        "JOIN_VOICE_CHAT",
        "JOIN_VOICE_CHANNEL",
        "JOIN_MEETING",
        "JOIN_CALL",
    ],
    validate: async (_runtime, message, state) => {
        if (message.content.source !== "discord") {
            // not a discord message
            return false;
        }
        if (!state.discordClient) {
            return;
        }
        // did they say something about joining a voice channel? if not, don't validate
        const keywords = [
            "join",
            "come to",
            "come on",
            "enter",
            "voice",
            "chat",
            "talk",
            "call",
            "hop on",
            "get on",
            "vc",
            "meeting",
            "discussion",
        ];
        if (!keywords.some((keyword) => message.content.text.toLowerCase().includes(keyword))) {
            return false;
        }
        const client = state.discordClient;
        // Check if the client is connected to any voice channel
        const isConnectedToVoice = client.voice.adapters.size === 0;
        return isConnectedToVoice;
    },
    description: "Join a voice channel to participate in voice chat.",
    handler: async (runtime, message, state) => {
        if (!state) {
            console.error("State is not available.");
        }
        // We normalize data in from voice channels
        const discordMessage = (state.discordChannel ||
            state.discordMessage);
        if (!discordMessage.content) {
            discordMessage.content = message.content.text;
        }
        const id = discordMessage.guild?.id;
        const client = state.discordClient;
        const voiceChannels = client.guilds.cache.get(id).channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice);
        const messageContent = discordMessage.content;
        const targetChannel = voiceChannels.find((channel) => {
            const name = channel.name.toLowerCase();
            // remove all non-alphanumeric characters (keep spaces between words)
            const replacedName = name.replace(/[^a-z0-9 ]/g, "");
            return (name.includes(messageContent) ||
                messageContent.includes(name) ||
                replacedName.includes(messageContent) ||
                messageContent.includes(replacedName));
        });
        if (!state.voiceManager) {
            state.voiceManager = new VoiceManager({
                client: state.discordClient,
                runtime: runtime,
            });
        }
        if (targetChannel) {
            state.voiceManager.joinVoiceChannel({
                channelId: targetChannel.id,
                guildId: discordMessage.guild?.id,
                adapterCreator: client.guilds.cache.get(id)
                    .voiceAdapterCreator,
            });
            return true;
        }
        else {
            const member = discordMessage
                .member;
            if (member?.voice?.channel) {
                state.voiceManager.joinVoiceChannel({
                    channelId: member.voice.channel.id,
                    guildId: discordMessage.guild
                        ?.id,
                    adapterCreator: client.guilds.cache.get(id)
                        .voiceAdapterCreator,
                });
                return true;
            }
            const messageTemplate = `
The user has requested to join a voice channel.
Here is the list of channels available in the server:
{{voiceChannels}}

Here is the user's request:
{{userMessage}}

Please respond with the name of the voice channel which the bot should join. Try to infer what channel the user is talking about. If the user didn't specify a voice channel, respond with "none".
You should only respond with the name of the voice channel or none, no commentary or additional information should be included.
`;
            const guessState = {
                userMessage: message.content.text,
                voiceChannels: voiceChannels
                    .map((channel) => channel.name)
                    .join("\n"),
            };
            const context = composeContext({
                template: messageTemplate,
                state: guessState,
            });
            const _datestr = new Date().toUTCString().replace(/:/g, "-");
            const responseContent = await generateText({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
            });
            runtime.databaseAdapter.log({
                body: { message, context, response: responseContent },
                userId: message.userId,
                roomId: message.roomId,
                type: "joinvoice",
            });
            if (responseContent && responseContent.trim().length > 0) {
                // join the voice channel
                const channelName = responseContent.toLowerCase();
                const targetChannel = voiceChannels.find((channel) => {
                    const name = channel.name.toLowerCase();
                    // remove all non-alphanumeric characters (keep spaces between words)
                    const replacedName = name.replace(/[^a-z0-9 ]/g, "");
                    return (name.includes(channelName) ||
                        channelName.includes(name) ||
                        replacedName.includes(channelName) ||
                        channelName.includes(replacedName));
                });
                if (targetChannel) {
                    state.voiceManager.joinVoiceChannel({
                        channelId: targetChannel.id,
                        guildId: discordMessage.guild
                            ?.id,
                        adapterCreator: client.guilds.cache.get(id)
                            .voiceAdapterCreator,
                    });
                    return true;
                }
            }
            await discordMessage.reply("I couldn't figure out which channel you wanted me to join.");
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Hey, let's jump into the 'General' voice and chat",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sounds good",
                    action: "JOIN_VOICE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "{{user2}}, can you join the vc, I want to discuss our strat",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sure I'll join right now",
                    action: "JOIN_VOICE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "hey {{user2}}, we're having a team meeting in the 'conference' voice channel, plz join us",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "OK see you there",
                    action: "JOIN_VOICE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "{{user2}}, let's have a quick voice chat in the 'Lounge' channel.",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "kk be there in a sec",
                    action: "JOIN_VOICE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Hey {{user2}}, can you join me in the 'Music' voice channel",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sure",
                    action: "JOIN_VOICE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "join voice chat with us {{user2}}",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "coming",
                    action: "JOIN_VOICE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "hop in vc {{user2}}",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "joining now",
                    action: "JOIN_VOICE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "get in vc with us {{user2}}",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "im in",
                    action: "JOIN_VOICE",
                },
            },
        ],
    ],
};
//# sourceMappingURL=joinvoice.js.map