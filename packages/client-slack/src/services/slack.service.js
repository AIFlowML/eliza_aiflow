import { Service, ServiceType } from "@ai16z/eliza";
import { WebClient } from "@slack/web-api";
export class SlackService extends Service {
    static get serviceType() {
        return ServiceType.SLACK;
    }
    get serviceType() {
        return ServiceType.SLACK;
    }
    async initialize(runtime) {
        const token = runtime.getSetting("SLACK_BOT_TOKEN");
        if (!token) {
            throw new Error("SLACK_BOT_TOKEN is required");
        }
        this.client = new WebClient(token);
    }
}
//# sourceMappingURL=slack.service.js.map