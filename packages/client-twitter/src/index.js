import { TwitterPostClient } from "./post.ts";
import { TwitterInteractionClient } from "./interactions.ts";
import { elizaLogger } from "@ai16z/eliza";
import { validateTwitterConfig } from "./environment.ts";
import { ClientBase } from "./base.ts";
class TwitterManager {
    constructor(runtime) {
        this.client = new ClientBase(runtime);
        this.post = new TwitterPostClient(this.client, runtime);
        // this.search = new TwitterSearchClient(runtime); // don't start the search client by default
        // this searches topics from character file, but kind of violates consent of random users
        // burns your rate limit and can get your account banned
        // use at your own risk
        this.interaction = new TwitterInteractionClient(this.client, runtime);
    }
}
export const TwitterClientInterface = {
    async start(runtime) {
        await validateTwitterConfig(runtime);
        elizaLogger.log("Twitter client started");
        const manager = new TwitterManager(runtime);
        await manager.client.init();
        await manager.post.start();
        await manager.interaction.start();
        return manager;
    },
    async stop(_runtime) {
        elizaLogger.warn("Twitter client does not support stopping yet");
    },
};
export default TwitterClientInterface;
//# sourceMappingURL=index.js.map