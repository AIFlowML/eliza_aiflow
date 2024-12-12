import { Tweet } from "agent-twitter-client";
import { Content, Memory, UUID } from "@ai16z/eliza";
import { ClientBase } from "./base";
export declare const wait: (minTime?: number, maxTime?: number) => Promise<unknown>;
export declare const isValidTweet: (tweet: Tweet) => boolean;
export declare function buildConversationThread(tweet: Tweet, client: ClientBase, maxReplies?: number): Promise<Tweet[]>;
export declare function sendTweet(client: ClientBase, content: Content, roomId: UUID, twitterUsername: string, inReplyTo: string): Promise<Memory[]>;
