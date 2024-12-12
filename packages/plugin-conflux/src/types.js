import { z } from "zod";
export const TransferSchema = z.object({
    to: z.string(),
    amount: z.number(), // use number ignoring decimals issue
});
export const isTransferContent = (object) => {
    if (TransferSchema.safeParse(object).success) {
        return true;
    }
    console.error("Invalid content: ", object);
    return false;
};
export const PumpCreateSchema = z.object({
    action: z.literal("CREATE_TOKEN"),
    params: z.object({
        symbol: z.string(),
        name: z.string(),
        description: z.string(),
    }),
});
export const PumpBuySchema = z.object({
    action: z.literal("BUY_TOKEN"),
    params: z.object({
        tokenAddress: z.string(),
        value: z.number(),
    }),
});
export const PumpSellSchema = z.object({
    action: z.literal("SELL_TOKEN"),
    params: z.object({
        tokenAddress: z.string(),
        value: z.number(),
    }),
});
export const PumpSchema = z.union([
    PumpCreateSchema,
    PumpBuySchema,
    PumpSellSchema,
]);
export function isPumpContent(object) {
    if (PumpSchema.safeParse(object).success) {
        return true;
    }
    console.error("Invalid content: ", object);
    return false;
}
export function isPumpCreateContent(object) {
    if (PumpCreateSchema.safeParse(object).success) {
        return true;
    }
    console.error("Invalid content: ", object);
    return false;
}
export function isPumpBuyContent(object) {
    if (PumpBuySchema.safeParse(object).success) {
        return true;
    }
    console.error("Invalid content: ", object);
    return false;
}
export function isPumpSellContent(object) {
    if (PumpSellSchema.safeParse(object).success) {
        return true;
    }
    console.error("Invalid content: ", object);
    return false;
}
//# sourceMappingURL=types.js.map