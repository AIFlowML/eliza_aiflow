export class AutoClient {
    constructor(runtime) {
        this.runtime = runtime;
        // start a loop that runs every x seconds
        this.interval = setInterval(async () => {
            console.log("running auto client...");
        }, 60 * 60 * 1000); // 1 hour in milliseconds
    }
}
export const AutoClientInterface = {
    start: async (runtime) => {
        const client = new AutoClient(runtime);
        return client;
    },
    stop: async (_runtime) => {
        console.warn("Direct client does not support stopping yet");
    },
};
export default AutoClientInterface;
//# sourceMappingURL=index.js.map