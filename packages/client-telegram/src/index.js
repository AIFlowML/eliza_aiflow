import { elizaLogger } from "@ai16z/eliza";
import { TelegramClient } from "./telegramClient.ts";
import { validateTelegramConfig } from "./environment.ts";
export const TelegramClientInterface = {
    start: async (runtime) => {
        await validateTelegramConfig(runtime);
        const tg = new TelegramClient(runtime, runtime.getSetting("TELEGRAM_BOT_TOKEN"));
        await tg.start();
        elizaLogger.success(`✅ Telegram client successfully started for character ${runtime.character.name}`);
        return tg;
    },
    stop: async (_runtime) => {
        elizaLogger.warn("Telegram client does not support stopping yet");
    },
};
export default TelegramClientInterface;
//# sourceMappingURL=index.js.map