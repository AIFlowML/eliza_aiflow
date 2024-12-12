import { z } from "zod";
export declare const TransferSchema: z.ZodObject<{
    to: z.ZodString;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    amount: number;
    to: string;
}, {
    amount: number;
    to: string;
}>;
export interface TransferContent {
    to: string;
    amount: number;
}
export declare const isTransferContent: (object: any) => object is TransferContent;
export declare const PumpCreateSchema: z.ZodObject<{
    action: z.ZodLiteral<"CREATE_TOKEN">;
    params: z.ZodObject<{
        symbol: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        description: string;
        name: string;
    }, {
        symbol: string;
        description: string;
        name: string;
    }>;
}, "strip", z.ZodTypeAny, {
    action: "CREATE_TOKEN";
    params: {
        symbol: string;
        description: string;
        name: string;
    };
}, {
    action: "CREATE_TOKEN";
    params: {
        symbol: string;
        description: string;
        name: string;
    };
}>;
export declare const PumpBuySchema: z.ZodObject<{
    action: z.ZodLiteral<"BUY_TOKEN">;
    params: z.ZodObject<{
        tokenAddress: z.ZodString;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        tokenAddress: string;
    }, {
        value: number;
        tokenAddress: string;
    }>;
}, "strip", z.ZodTypeAny, {
    action: "BUY_TOKEN";
    params: {
        value: number;
        tokenAddress: string;
    };
}, {
    action: "BUY_TOKEN";
    params: {
        value: number;
        tokenAddress: string;
    };
}>;
export declare const PumpSellSchema: z.ZodObject<{
    action: z.ZodLiteral<"SELL_TOKEN">;
    params: z.ZodObject<{
        tokenAddress: z.ZodString;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        tokenAddress: string;
    }, {
        value: number;
        tokenAddress: string;
    }>;
}, "strip", z.ZodTypeAny, {
    action: "SELL_TOKEN";
    params: {
        value: number;
        tokenAddress: string;
    };
}, {
    action: "SELL_TOKEN";
    params: {
        value: number;
        tokenAddress: string;
    };
}>;
export declare const PumpSchema: z.ZodUnion<[z.ZodObject<{
    action: z.ZodLiteral<"CREATE_TOKEN">;
    params: z.ZodObject<{
        symbol: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        description: string;
        name: string;
    }, {
        symbol: string;
        description: string;
        name: string;
    }>;
}, "strip", z.ZodTypeAny, {
    action: "CREATE_TOKEN";
    params: {
        symbol: string;
        description: string;
        name: string;
    };
}, {
    action: "CREATE_TOKEN";
    params: {
        symbol: string;
        description: string;
        name: string;
    };
}>, z.ZodObject<{
    action: z.ZodLiteral<"BUY_TOKEN">;
    params: z.ZodObject<{
        tokenAddress: z.ZodString;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        tokenAddress: string;
    }, {
        value: number;
        tokenAddress: string;
    }>;
}, "strip", z.ZodTypeAny, {
    action: "BUY_TOKEN";
    params: {
        value: number;
        tokenAddress: string;
    };
}, {
    action: "BUY_TOKEN";
    params: {
        value: number;
        tokenAddress: string;
    };
}>, z.ZodObject<{
    action: z.ZodLiteral<"SELL_TOKEN">;
    params: z.ZodObject<{
        tokenAddress: z.ZodString;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        tokenAddress: string;
    }, {
        value: number;
        tokenAddress: string;
    }>;
}, "strip", z.ZodTypeAny, {
    action: "SELL_TOKEN";
    params: {
        value: number;
        tokenAddress: string;
    };
}, {
    action: "SELL_TOKEN";
    params: {
        value: number;
        tokenAddress: string;
    };
}>]>;
export type PumpContent = z.infer<typeof PumpSchema>;
export type PumpCreateContent = z.infer<typeof PumpCreateSchema>;
export type PumpBuyContent = z.infer<typeof PumpBuySchema>;
export type PumpSellContent = z.infer<typeof PumpSellSchema>;
export declare function isPumpContent(object: any): object is PumpContent;
export declare function isPumpCreateContent(object: any): object is PumpCreateContent;
export declare function isPumpBuyContent(object: any): object is PumpBuyContent;
export declare function isPumpSellContent(object: any): object is PumpSellContent;
