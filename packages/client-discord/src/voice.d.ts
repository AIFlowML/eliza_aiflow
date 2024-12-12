import { UUID } from "@ai16z/eliza";
import { AudioPlayer } from "@discordjs/voice";
import { BaseGuildVoiceChannel, Guild, VoiceState } from "discord.js";
import EventEmitter from "events";
import { Readable } from "stream";
import { DiscordClient } from "./index.ts";
export declare class AudioMonitor {
    private readable;
    private buffers;
    private maxSize;
    private lastFlagged;
    private ended;
    constructor(readable: Readable, maxSize: number, callback: (buffer: Buffer) => void);
    stop(): void;
    isFlagged(): boolean;
    getBufferFromFlag(): Buffer | null;
    getBufferFromStart(): Buffer;
    reset(): void;
    isEnded(): boolean;
}
export declare class VoiceManager extends EventEmitter {
    private userStates;
    private activeAudioPlayer;
    private client;
    private runtime;
    private streams;
    private connections;
    private activeMonitors;
    constructor(client: DiscordClient);
    handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState): Promise<void>;
    joinChannel(channel: BaseGuildVoiceChannel): Promise<void>;
    private monitorMember;
    leaveChannel(channel: BaseGuildVoiceChannel): void;
    stopMonitoringMember(memberId: string): void;
    handleGuildCreate(guild: Guild): Promise<void>;
    handleUserStream(userId: UUID, name: string, userName: string, channel: BaseGuildVoiceChannel, audioStream: Readable): Promise<void>;
    private processTranscription;
    private handleUserMessage;
    private convertOpusToWav;
    private _shouldRespond;
    private _generateResponse;
    private _shouldIgnore;
    scanGuild(guild: Guild): Promise<void>;
    playAudioStream(userId: UUID, audioStream: Readable): Promise<void>;
    cleanupAudioPlayer(audioPlayer: AudioPlayer): void;
    handleJoinChannelCommand(interaction: any): Promise<void>;
    handleLeaveChannelCommand(interaction: any): Promise<void>;
}
