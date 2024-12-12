import { Provider } from "@ai16z/eliza";
import { Action, Plugin } from "@ai16z/eliza";
interface ChargeRequest {
    name: string;
    description: string;
    pricing_type: string;
    local_price: {
        amount: string;
        currency: string;
    };
}
export declare function createCharge(apiKey: string, params: ChargeRequest): Promise<any>;
export declare function getAllCharges(apiKey: string): Promise<any>;
export declare function getChargeDetails(apiKey: string, chargeId: string): Promise<any>;
export declare const createCoinbaseChargeAction: Action;
export declare const getAllChargesAction: Action;
export declare const getChargeDetailsAction: Action;
export declare const chargeProvider: Provider;
export declare const coinbaseCommercePlugin: Plugin;
export {};
