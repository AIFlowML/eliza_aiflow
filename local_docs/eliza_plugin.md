# Eliza Plugin Documentation

## Essential Structure for Akash Plugin

### Core Components

```typescript
/**
 * ESSENTIAL: Base Plugin Structure
 * This is the minimum structure needed for the Akash plugin
 */
export const akashPlugin: Plugin = {
    name: "akashPlugin",
    description: "Enables Akash network operations",
    actions: [/* actions go here */],
    providers: [/* providers go here */]
};

/**
 * ESSENTIAL: Action Interface
 * Required for implementing Akash network operations
 */
interface Action {
    name: string;           // Name of the action (e.g., "DEPLOY_INSTANCE")
    description: string;    // Description of what the action does
    validate: (runtime: IAgentRuntime) => Promise<boolean>;  // Validate API keys/config
    handler: (runtime, message, state, options, callback) => Promise<void>;  // Main logic
    similes: string[];     // Alternative names/commands for the action
    examples: any[];       // Example usage scenarios
}

/**
 * ESSENTIAL: Provider Interface
 * For fetching Akash network state/data
 */
interface Provider {
    get: (runtime: IAgentRuntime, message: Memory) => Promise<any>;
}
```

### Key Implementation Patterns

```typescript
/**
 * ESSENTIAL: API Client Setup
 * Pattern for initializing Akash client
 */
function initializeClient(runtime: IAgentRuntime) {
    return new AkashClient(
        runtime.getSetting("AKASH_API_KEY"),
        runtime.getSetting("AKASH_API_URL")
    );
}

/**
 * ESSENTIAL: Action Handler Pattern
 * Template for implementing Akash operations
 */
const actionHandler = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: any,
    callback: HandlerCallback
) => {
    // 1. Initialize client
    const client = initializeClient(runtime);

    // 2. Generate operation details
    const operationDetails = await generateObjectV2({
        runtime,
        context: composeContext({ state, template }),
        modelClass: ModelClass.LARGE,
        schema: OperationSchema,
    });

    // 3. Execute operation
    try {
        const result = await client.executeOperation(operationDetails);
        callback({ text: "Operation successful", ...result }, []);
    } catch (error) {
        callback({ text: "Operation failed: " + error.message }, []);
    }
};
```

### Essential Types and Schemas

```typescript
/**
 * ESSENTIAL: Operation Schema
 * Define the structure of Akash operations
 */
export const OperationSchema = {
    type: "object",
    properties: {
        operationType: { type: "string" },
        parameters: { type: "object" },
        // Add other required properties
    },
    required: ["operationType", "parameters"]
};

/**
 * ESSENTIAL: Response Types
 * Standard response structure
 */
interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}
```

## Non-Essential Components
The following sections from the original plugin can be ignored for the Akash implementation:

- Advanced error handling patterns
- Complex state management
- Webhook handling
- Commerce-specific features
- Payment processing
- Portfolio management
- Market data handling

## Implementation Focus for Akash

1. Core Operations:
   - Deployment management
   - Network capacity queries
   - Provider listing
   - Transaction handling

2. Essential Features:
   - API authentication
   - Request/response handling
   - Basic error management
   - Operation status tracking

3. Required Configurations:
   - API endpoints
   - Authentication keys
   - Network parameters

## Reference Implementation

```typescript
/**
 * Example Akash Action Implementation
 */
export const deployInstanceAction: Action = {
    name: "DEPLOY_INSTANCE",
    description: "Deploy an instance on Akash network",
    validate: async (runtime) => {
        return !!(runtime.getSetting("AKASH_API_KEY"));
    },
    handler: async (runtime, message, state, options, callback) => {
        const client = initializeClient(runtime);
        // Implementation details...
    },
    examples: [
        // Usage examples...
    ]
};

/**
 * Example Akash Provider Implementation
 */
export const akashProvider: Provider = {
    get: async (runtime, message) => {
        const client = initializeClient(runtime);
        return {
            networkCapacity: await client.getNetworkCapacity(),
            providers: await client.getProviders()
        };
    }
};
```

## Testing Considerations

1. Essential Tests:
   - API connectivity
   - Operation execution
   - Response handling
   - Error scenarios

2. Mock Implementations:
   - Network responses
   - Provider data
   - Transaction results

## Documentation Requirements

1. Core Documentation:
   - API endpoints
   - Operation parameters
   - Response formats
   - Error codes

2. Usage Examples:
   - Basic operations
   - Common scenarios
   - Error handling



---
File: /advanced-sdk-ts/src/rest/types/accounts-types.ts
---

import { Account } from './common-types';

// Get Account
export type GetAccountRequest = {
  // Path Params
  accountUuid: string;
};

export type GetAccountResponse = {
  account?: Account;
};

// List Accounts
export type ListAccountsRequest = {
  // Query Params
  limit?: number;
  cursor?: string;
  retailPortfolioId?: string;
};

export type ListAccountsResponse = {
  accounts?: Account[];
  has_next: boolean;
  cursor?: string;
  size?: number;
};



---
File: /advanced-sdk-ts/src/rest/types/common-types.ts
---

// ----- ENUMS -----
export enum ProductType {
  UNKNOWN = 'UNKNOWN_PRODUCT_TYPE',
  SPOT = 'SPOT',
  FUTURE = 'FUTURE',
}

export enum ContractExpiryType {
  UNKNOWN = 'UNKNOWN_CONTRACT_EXPIRY_TYPE',
  EXPIRING = 'EXPIRING',
  PERPETUAL = 'PERPETUAL',
}

export enum ExpiringContractStatus {
  UNKNOWN = 'UNKNOWN_EXPIRING_CONTRACT_STATUS',
  UNEXPIRED = 'STATUS_UNEXPIRED',
  EXPIRED = 'STATUS_EXPIRED',
  ALL = 'STATUS_ALL',
}

export enum PortfolioType {
  UNDEFINED = 'UNDEFINED',
  DEFAULT = 'DEFAULT',
  CONSUMER = 'CONSUMER',
  INTX = 'INTX',
}

export enum MarginType {
  CROSS = 'CROSS',
  ISOLATED = 'ISOLATED',
}

export enum OrderPlacementSource {
  UNKNOWN = 'UNKNOWN_PLACEMENT_SOURCE',
  RETAIL_SIMPLE = 'RETAIL_SIMPLE',
  RETAIL_ADVANCED = 'RETAIL_ADVANCED',
}

export enum SortBy {
  UNKNOWN = 'UNKNOWN_SORT_BY',
  LIMIT_PRICE = 'LIMIT_PRICE',
  LAST_FILL_TIME = 'LAST_FILL_TIME',
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum StopDirection {
  UP = 'STOP_DIRECTION_STOP_UP',
  DOWN = 'STOP_DIRECTION_STOP_DOWN',
}

export enum Granularity {
  UNKNOWN = 'UNKNOWN_GRANULARITY',
  ONE_MINUTE = 'ONE_MINUTE',
  FIVE_MINUTE = 'FIVE_MINUTE',
  FIFTEEN_MINUTE = 'FIFTEEN_MINUTE',
  THIRTY_MINUTE = 'THIRTY_MINUTE',
  ONE_HOUR = 'ONE_HOUR',
  TWO_HOUR = 'TWO_HOUR',
  SIX_HOUR = 'SIX_HOUR',
  ONE_DAY = 'ONE_DAY',
}

export enum ProductVenue {
  UNKNOWN = 'UNKNOWN_VENUE_TYPE',
  CBE = 'CBE',
  FCM = 'FCM',
  INTX = 'INTX',
}

export enum IntradayMarginSetting {
  UNSPECIFIED = 'INTRADAY_MARGIN_SETTING_UNSPECIFIED',
  STANDARD = 'INTRADAY_MARGIN_SETTING_STANDARD',
  INTRADAY = 'INTRADAY_MARGIN_SETTING_INTRADAY',
}

// ----- TYPES -----
export type Account = {
  uuid?: string;
  name?: string;
  currency?: string;
  available_balance?: Record<string, any>;
  default?: boolean;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  type?: Record<string, any>;
  ready?: boolean;
  hold?: Record<string, any>;
  retail_portfolio_id?: string;
};

export type TradeIncentiveMetadata = {
  userIncentiveId?: string;
  codeVal?: string;
};

export type OrderConfiguration =
  | { market_market_ioc: MarketMarketIoc }
  | { sor_limit_ioc: SorLimitIoc }
  | { limit_limit_gtc: LimitLimitGtc }
  | { limit_limit_gtd: LimitLimitGtd }
  | { limit_limit_fok: LimitLimitFok }
  | { stop_limit_stop_limit_gtc: StopLimitStopLimitGtc }
  | { stop_limit_stop_limit_gtd: StopLimitStopLimitGtd }
  | { trigger_bracket_gtc: TriggerBracketGtc }
  | { trigger_bracket_gtd: TriggerBracketGtd };

export type MarketMarketIoc = { quote_size: string } | { base_size: string };

export type SorLimitIoc = {
  baseSize: string;
  limitPrice: string;
};

export type LimitLimitGtc = {
  baseSize: string;
  limitPrice: string;
  postOnly: boolean;
};

export type LimitLimitGtd = {
  baseSize: string;
  limitPrice: string;
  endTime: string;
  postOnly: boolean;
};

export type LimitLimitFok = {
  baseSize: string;
  limitPrice: string;
};

export type StopLimitStopLimitGtc = {
  baseSize: string;
  limitPrice: string;
  stopPrice: string;
  stopDirection: StopDirection;
};

export type StopLimitStopLimitGtd = {
  baseSize: string;
  limitPrice: string;
  stopPrice: string;
  endTime: string;
  stopDirection: StopDirection;
};

export type TriggerBracketGtc = {
  baseSize: string;
  limitPrice: string;
  stopTriggerPrice: string;
};

export type TriggerBracketGtd = {
  baseSize: string;
  limitPrice: string;
  stopTriggerPrice: string;
  endTime: string;
};

export type RatConvertTrade = {
  id?: string;
  status?: Record<string, any>;
  user_entered_amount?: Record<string, any>;
  amount?: Record<string, any>;
  subtotal?: Record<string, any>;
  total?: Record<string, any>;
  fees?: Record<string, any>;
  total_fee?: Record<string, any>;
  source?: Record<string, any>;
  target?: Record<string, any>;
  unit_price?: Record<string, any>;
  user_warnings?: Record<string, any>;
  user_reference?: string;
  source_curency?: string;
  cancellation_reason?: Record<string, any>;
  source_id?: string;
  target_id?: string;
  subscription_info?: Record<string, any>;
  exchange_rate?: Record<string, any>;
  tax_details?: Record<string, any>;
  trade_incentive_info?: Record<string, any>;
  total_fee_without_tax?: Record<string, any>;
  fiat_denoted_total?: Record<string, any>;
};

export type FCMBalanceSummary = {
  futures_buying_power?: Record<string, any>;
  total_usd_balance?: Record<string, any>;
  cbi_usd_balance?: Record<string, any>;
  cfm_usd_balance?: Record<string, any>;
  total_open_orders_hold_amount?: Record<string, any>;
  unrealized_pnl?: Record<string, any>;
  daily_realized_pnl?: Record<string, any>;
  initial_margin?: Record<string, any>;
  available_margin?: Record<string, any>;
  liquidation_threshold?: Record<string, any>;
  liquidation_buffer_amount?: Record<string, any>;
  liquidation_buffer_percentage?: string;
  intraday_margin_window_measure?: Record<string, any>;
  overnight_margin_window_measure?: Record<string, any>;
};

export type FCMPosition = {
  product_id?: string;
  expiration_time?: Record<string, any>;
  side?: Record<string, any>;
  number_of_contracts?: string;
  current_price?: string;
  avg_entry_price?: string;
  unrealized_pnl?: string;
  daily_realized_pnl?: string;
};

export type FCMSweep = {
  id: string;
  requested_amount: Record<string, any>;
  should_sweep_all: boolean;
  status: Record<string, any>;
  schedule_time: Record<string, any>;
};

export type CancelOrderObject = {
  success: boolean;
  failure_reason: Record<string, any>;
  order_id: string;
};

export type Order = {
  order_id: string;
  product_id: string;
  user_id: string;
  order_configuration: OrderConfiguration;
  side: OrderSide;
  client_order_id: string;
  status: Record<string, any>;
  time_in_force?: Record<string, any>;
  created_time: Record<string, any>;
  completion_percentage: string;
  filled_size?: string;
  average_filled_price: string;
  fee?: string;
  number_of_fills: string;
  filled_value?: string;
  pending_cancel: boolean;
  size_in_quote: boolean;
  total_fees: string;
  size_inclusive_of_fees: boolean;
  total_value_after_fees: string;
  trigger_status?: Record<string, any>;
  order_type?: Record<string, any>;
  reject_reason?: Record<string, any>;
  settled?: boolean;
  product_type?: ProductType;
  reject_message?: string;
  cancel_message?: string;
  order_placement_source?: OrderPlacementSource;
  outstanding_hold_amount?: string;
  is_liquidation?: boolean;
  last_fill_time?: Record<string, any>;
  edit_history?: Record<string, any>[];
  leverage?: string;
  margin_type?: MarginType;
  retail_portfolio_id?: string;
  originating_order_id?: string;
  attached_order_id?: string;
};

export type PaymentMethod = {
  id?: string;
  type?: string;
  name?: string;
  currency?: string;
  verified?: boolean;
  allow_buy?: boolean;
  allow_sell?: boolean;
  allow_deposit?: boolean;
  allow_withdraw?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PerpetualPortfolio = {
  portfolio_uuid?: string;
  collateral?: string;
  position_notional?: string;
  open_position_notional?: string;
  pending_fees?: string;
  borrow?: string;
  accrued_interest?: string;
  rolling_debt?: string;
  portfolio_initial_margin?: string;
  portfolio_im_notional?: Record<string, any>;
  liquidation_percentage?: string;
  liquidation_buffer?: string;
  margin_type?: Record<string, any>;
  margin_flags?: Record<string, any>;
  liquidation_status?: Record<string, any>;
  unrealized_pnl?: Record<string, any>;
  total_balance?: Record<string, any>;
};

export type PortfolioSummary = {
  unrealized_pnl?: Record<string, any>;
  buying_power?: Record<string, any>;
  total_balance?: Record<string, any>;
  max_withdrawal_amount?: Record<string, any>;
};

export type PositionSummary = {
  aggregated_pnl?: Record<string, any>;
};

export type Position = {
  product_id?: string;
  product_uuid?: string;
  portfolio_uuid?: string;
  symbol?: string;
  vwap?: Record<string, any>;
  entry_vwap?: Record<string, any>;
  position_side?: Record<string, any>;
  margin_type?: Record<string, any>;
  net_size?: string;
  buy_order_size?: string;
  sell_order_size?: string;
  im_contribution?: string;
  unrealized_pnl?: Record<string, any>;
  mark_price?: Record<string, any>;
  liquidation_price?: Record<string, any>;
  leverage?: string;
  im_notional?: Record<string, any>;
  mm_notional?: Record<string, any>;
  position_notional?: Record<string, any>;
  aggregated_pnl?: Record<string, any>;
};

export type Balance = {
  asset: Record<string, any>;
  quantity: string;
  hold: string;
  transfer_hold: string;
  collateral_value: string;
  collateral_weight: string;
  max_withdraw_amount: string;
  loan: string;
  loan_collateral_requirement_usd: string;
  pledged_quantity: string;
};

export type Portfolio = {
  name?: string;
  uuid?: string;
  type?: string;
};

export type PortfolioBreakdown = {
  portfolio?: Portfolio;
  portfolio_balances?: Record<string, any>;
  spot_positions?: Record<string, any>[];
  perp_positions?: Record<string, any>[];
  futures_positions?: Record<string, any>[];
};

export type PriceBook = {
  product_id: string;
  bids: Record<string, any>[];
  asks: Record<string, any>[];
  time?: Record<string, any>;
};

export type Products = {
  products?: Product[];
  num_products?: number;
};

export type Product = {
  product_id: string;
  price: string;
  price_percentage_change_24h: string;
  volume_24h: string;
  volume_percentage_change_24h: string;
  base_increment: string;
  quote_increment: string;
  quote_min_size: string;
  quote_max_size: string;
  base_min_size: string;
  base_max_size: string;
  base_name: string;
  quote_name: string;
  watched: boolean;
  is_disabled: boolean;
  new: boolean;
  status: string;
  cancel_only: boolean;
  limit_only: boolean;
  post_only: boolean;
  trading_disabled: boolean;
  auction_mode: boolean;
  product_type?: ProductType;
  quote_currency_id?: string;
  base_currency_id?: string;
  fcm_trading_session_details?: Record<string, any>;
  mid_market_price?: string;
  alias?: string;
  alias_to?: string[];
  base_display_symbol: string;
  quote_display_symbol?: string;
  view_only?: boolean;
  price_increment?: string;
  display_name?: string;
  product_venue?: ProductVenue;
  approximate_quote_24h_volume?: string;
  future_product_details?: Record<string, any>;
};

export type Candles = {
  candles?: Candle[];
};

export type Candle = {
  start?: string;
  low?: string;
  high?: string;
  open?: string;
  close?: string;
  volume?: string;
};

export type HistoricalMarketTrade = {
  trade_id?: string;
  product_id?: string;
  price?: string;
  size?: string;
  time?: string;
  side?: OrderSide;
};

export type PortfolioBalance = {
  portfolio_uuid?: string;
  balances?: Balance[];
  is_margin_limit_reached?: boolean;
};



---
File: /advanced-sdk-ts/src/rest/types/converts-types.ts
---

// Create Convert Quote
import { RatConvertTrade, TradeIncentiveMetadata } from './common-types';

export type CreateConvertQuoteRequest = {
  // Body Params
  fromAccount: string;
  toAccount: string;
  amount: string;
  tradeIncentiveMetadata?: TradeIncentiveMetadata;
};

export type CreateConvertQuoteResponse = {
  trade?: RatConvertTrade;
};

// Get Convert Trade
export type GetConvertTradeRequest = {
  // Path Params
  tradeId: string;

  //Query Params
  fromAccount: string;
  toAccount: string;
};

export type GetConvertTradeResponse = {
  trade?: RatConvertTrade;
};

// Commit Convert Trade
export type CommitConvertTradeRequest = {
  // Path Params
  tradeId: string;

  // Body Params
  fromAccount: string;
  toAccount: string;
};

export type CommitConvertTradeResponse = {
  trade?: RatConvertTrade;
};



---
File: /advanced-sdk-ts/src/rest/types/dataAPI-types.ts
---

import { PortfolioType } from './common-types';

// Get API Key Permissions
export type GetAPIKeyPermissionsResponse = {
  can_view?: boolean;
  can_trade?: boolean;
  can_transfer?: boolean;
  portfolio_uuid?: string;
  portfolio_type?: PortfolioType;
};



---
File: /advanced-sdk-ts/src/rest/types/fees-types.ts
---

import { ContractExpiryType, ProductType, ProductVenue } from './common-types';

// Get Transactions Summary
export type GetTransactionsSummaryRequest = {
  // Query Params
  productType?: ProductType;
  contractExpiryType?: ContractExpiryType;
  productVenue?: ProductVenue;
};

export type GetTransactionsSummaryResponse = {
  total_volume: number;
  total_fees: number;
  fee_tier: Record<string, any>;
  margin_rate?: Record<string, any>;
  goods_and_services_tax?: Record<string, any>;
  advanced_trade_only_volumes?: number;
  advanced_trade_only_fees?: number;
  coinbase_pro_volume?: number; // deprecated
  coinbase_pro_fees?: number; // deprecated
  total_balance?: string;
  has_promo_fee?: boolean;
};



---
File: /advanced-sdk-ts/src/rest/types/futures-types.ts
---

import {
  FCMBalanceSummary,
  FCMPosition,
  FCMSweep,
  IntradayMarginSetting,
} from './common-types';

// Get Futures Balance Summary
export type GetFuturesBalanceSummaryResponse = {
  balance_summary?: FCMBalanceSummary;
};

// Get Intraday Margin Setting
export type GetIntradayMarginSettingResponse = {
  setting?: IntradayMarginSetting;
};

// Set Intraday Margin Setting
export type SetIntradayMarginSettingRequest = {
  // Body Params
  setting?: IntradayMarginSetting;
};

export type SetIntradayMarginSettingResponse = Record<string, never>;

// Get Current Margin Window
export type GetCurrentMarginWindowRequest = {
  // Query Params
  marginProfileType?: string;
};

export type GetCurrentMarginWindowResponse = {
  margin_window?: Record<string, any>;
  is_intraday_margin_killswitch_enabled?: boolean;
  is_intraday_margin_enrollment_killswitch_enabled?: boolean;
};

// List Futures Positions
export type ListFuturesPositionsResponse = {
  positions?: FCMPosition[];
};

// Get Futures Position
export type GetFuturesPositionRequest = {
  // Path Params
  productId: string;
};

export type GetFuturesPositionResponse = {
  position?: FCMPosition;
};

// Schedule Futures Sweep
export type ScheduleFuturesSweepRequest = {
  // Body Params
  usdAmount?: string;
};

export type ScheduleFuturesSweepResponse = {
  success?: boolean;
};

// List Futures Sweeps
export type ListFuturesSweepsResponse = {
  sweeps: FCMSweep[];
};

// Cancel Pending Futures Sweep = {
export type CancelPendingFuturesSweep = {
  success?: boolean;
};



---
File: /advanced-sdk-ts/src/rest/types/orders-types.ts
---

import {
  CancelOrderObject,
  ContractExpiryType,
  MarginType,
  Order,
  OrderConfiguration,
  OrderPlacementSource,
  OrderSide,
  ProductType,
  SortBy,
} from './common-types';

// Create Order
export type CreateOrderRequest = {
  // Body Params
  clientOrderId: string;
  productId: string;
  side: OrderSide;
  orderConfiguration: OrderConfiguration;
  selfTradePreventionId?: string;
  leverage?: string;
  marginType?: MarginType;
  retailPortfolioId?: string;
};

export type CreateOrderResponse = {
  success: boolean;
  failure_reason?: Record<string, any>; // deprecated
  order_id?: string; // deprecated
  response?:
    | { success_response: Record<string, any> }
    | { error_response: Record<string, any> };
  order_configuration?: OrderConfiguration;
};

// Cancel Orders
export type CancelOrdersRequest = {
  // Body Params
  orderIds: string[];
};

export type CancelOrdersResponse = {
  results?: CancelOrderObject[];
};

// Edit Order
export type EditOrderRequest = {
  // Body Params
  orderId: string;
  price?: string;
  size?: string;
};

export type EditOrderResponse = {
  success: boolean;
  response?:
    | { success_response: Record<string, any> } // deprecated
    | { error_response: Record<string, any> }; // deprecated
  errors?: Record<string, any>[];
};

// Edit Order Preview
export type EditOrderPreviewRequest = {
  // Body Params
  orderId: string;
  price?: string;
  size?: string;
};

export type EditOrderPreviewResponse = {
  errors: Record<string, any>[];
  slippage?: string;
  order_total?: string;
  commission_total?: string;
  quote_size?: string;
  base_size?: string;
  best_bid?: string;
  average_filled_price?: string;
};

// List Orders
export type ListOrdersRequest = {
  // Query Params
  orderIds?: string[];
  productIds?: string[];
  orderStatus?: string[];
  limit?: number;
  startDate?: string;
  endDate?: string;
  orderType?: string;
  orderSide?: OrderSide;
  cursor?: string;
  productType?: ProductType;
  orderPlacementSource?: OrderPlacementSource;
  contractExpiryType?: ContractExpiryType;
  assetFilters?: string[];
  retailPortfolioId?: string;
  timeInForces?: string;
  sortBy?: SortBy;
};

export type ListOrdersResponse = {
  orders: Order[];
  sequence?: number; // deprecated
  has_next: boolean;
  cursor?: string;
};

// List Fills
export type ListFillsRequest = {
  // Query Params
  orderIds?: string[];
  tradeIds?: string[];
  productIds?: string[];
  startSequenceTimestamp?: string;
  endSequenceTimestamp?: string;
  retailPortfolioId?: string;
  limit?: number;
  cursor?: string;
  sortBy?: SortBy;
};

export type ListFillsResponse = {
  fills?: Record<string, any>[];
  cursor?: string;
};

// Get Order
export type GetOrderRequest = {
  // Path Params
  orderId: string;
};

export type GetOrderResponse = {
  order?: Order;
};

// Preview Order
export type PreviewOrderRequest = {
  // Body Params
  productId: string;
  side: OrderSide;
  orderConfiguration: OrderConfiguration;
  leverage?: string;
  marginType?: MarginType;
  retailPortfolioId?: string;
};

export type PreviewOrderResponse = {
  order_total: string;
  commission_total: string;
  errs: Record<string, any>[];
  warning: Record<string, any>[];
  quote_size: string;
  base_size: string;
  best_bid: string;
  best_ask: string;
  is_max: boolean;
  order_margin_total?: string;
  leverage?: string;
  long_leverage?: string;
  short_leverage?: string;
  slippage?: string;
  preview_id?: string;
  current_liquidation_buffer?: string;
  projected_liquidation_buffer?: string;
  max_leverage?: string;
  pnl_configuration?: Record<string, any>;
};

// Close Position
export type ClosePositionRequest = {
  // Body Params
  clientOrderId: string;
  productId: string;
  size?: string;
};

export type ClosePositionResponse = {
  success: boolean;
  response?:
    | { success_response: Record<string, any> }
    | { error_response: Record<string, any> };
  order_configuration?: OrderConfiguration;
};



---
File: /advanced-sdk-ts/src/rest/types/payments-types.ts
---

import { PaymentMethod } from './common-types';

// List Payment Methods
export type ListPaymentMethodsResponse = {
  paymentMethods?: PaymentMethod;
};

// Get Payment Method
export type GetPaymentMethodRequest = {
  // Path Params
  paymentMethodId: string;
};

export type GetPaymentMethodResponse = {
  paymentMethod?: PaymentMethod;
};



---
File: /advanced-sdk-ts/src/rest/types/perpetuals-types.ts
---

import {
  PerpetualPortfolio,
  PortfolioBalance,
  PortfolioSummary,
  Position,
  PositionSummary,
} from './common-types';

// Allocate Portfolio
export type AllocatePortfolioRequest = {
  // Body Params
  portfolioUuid: string;
  symbol: string;
  amount: string;
  currency: string;
};

export type AllocatePortfolioResponse = Record<string, never>;

// Get Perpetuals Portfolio Summary
export type GetPerpetualsPortfolioSummaryRequest = {
  // Path Params
  portfolioUuid: string;
};

export type GetPerpetualsPortfolioSummaryResponse = {
  portfolios?: PerpetualPortfolio[];
  summary?: PortfolioSummary;
};

// List Perpetuals Positions
export type ListPerpetualsPositionsRequest = {
  // Path Params
  portfolioUuid: string;
};

export type ListPerpetualsPositionsResponse = {
  positions?: Position[];
  summary?: PositionSummary;
};

// Get Perpetuals Position
export type GetPerpetualsPositionRequest = {
  // Path Params
  portfolioUuid: string;
  symbol: string;
};

export type GetPerpetualsPositionResponse = {
  position?: Position;
};

// Get Portfolio Balances
export type GetPortfolioBalancesRequest = {
  // Path Params
  portfolioUuid: string;
};

export type GetPortfolioBalancesResponse = {
  portfolio_balancces?: PortfolioBalance[];
};

// Opt In or Out of Multi Asset Collateral
export type OptInOutMultiAssetCollateralRequest = {
  // Body Params
  portfolioUuid?: string;
  multiAssetCollateralEnabled?: boolean;
};

export type OptInOutMultiAssetCollateralResponse = {
  cross_collateral_enabled?: boolean;
};



---
File: /advanced-sdk-ts/src/rest/types/portfolios-types.ts
---

import { Portfolio, PortfolioBreakdown, PortfolioType } from './common-types';

// List Portfolios
export type ListPortfoliosRequest = {
  // Query Params
  portfolioType?: PortfolioType;
};

export type ListPortfoliosResponse = {
  portfolios?: Portfolio[];
};

// Create Portfolio
export type CreatePortfolioRequest = {
  // Body Params
  name: string;
};

export type CreatePortfolioResponse = {
  portfolio?: Portfolio;
};

// Move Portfolio Funds
export type MovePortfolioFundsRequest = {
  // Body Params
  funds: Record<string, any>;
  sourcePortfolioUuid: string;
  targetPortfolioUuid: string;
};

export type MovePortfolioFundsResponse = {
  source_portfolio_uuid?: string;
  target_portfolio_uuid?: string;
};

// Get Portfolio Breakdown
export type GetPortfolioBreakdownRequest = {
  // Path Params
  portfolioUuid: string;

  // Query Params
  currency?: string;
};

export type GetPortfolioBreakdownResponse = {
  breakdown?: PortfolioBreakdown;
};

// Delete Portfolio
export type DeletePortfolioRequest = {
  // Path Params
  portfolioUuid: string;
};

export type DeletePortfolioResponse = Record<string, never>;

// Edit Portfolio
export type EditPortfolioRequest = {
  // Path Params
  portfolioUuid: string;

  // Body Params
  name: string;
};

export type EditPortfolioResponse = {
  portfolio?: Portfolio;
};



---
File: /advanced-sdk-ts/src/rest/types/products-types.ts
---

import {
  Candles,
  ContractExpiryType,
  ExpiringContractStatus,
  Granularity,
  HistoricalMarketTrade,
  PriceBook,
  Product,
  Products,
  ProductType,
} from './common-types';

// Get Best Bid Ask
export type GetBestBidAskRequest = {
  // Query Params
  productIds?: string[];
};

export type GetBestBidAskResponse = {
  pricebooks: PriceBook[];
};

// Get Product Book
export type GetProductBookRequest = {
  // Query Params
  productId: string;
  limit?: number;
  aggregationPriceIncrement?: number;
};

export type GetProductBookResponse = {
  pricebook: PriceBook;
};

// List Products
export type ListProductsRequest = {
  // Query Params
  limit?: number;
  offset?: number;
  productType?: ProductType;
  productIds?: string[];
  contractExpiryType?: ContractExpiryType;
  expiringContractStatus?: ExpiringContractStatus;
  getTradabilityStatus?: boolean;
  getAllProducts?: boolean;
};

export type ListProductsResponse = {
  body?: Products;
};

// Get Product
export type GetProductRequest = {
  // Path Params
  productId: string;

  // Query Params
  getTradabilityStatus?: boolean;
};

export type GetProductResponse = {
  body?: Product;
};

// Get Product Candles
export type GetProductCandlesRequest = {
  // Path Params
  productId: string;

  // Query Params
  start: string;
  end: string;
  granularity: Granularity;
  limit?: number;
};

export type GetProductCandlesResponse = {
  body?: Candles;
};

// Get Market Trades
export type GetMarketTradesRequest = {
  // Path Params
  productId: string;

  // Query Params
  limit: number;
  start?: string;
  end?: string;
};

export type GetMarketTradesResponse = {
  trades?: HistoricalMarketTrade[];
  best_bid?: string;
  best_ask?: string;
};



---
File: /advanced-sdk-ts/src/rest/types/public-types.ts
---

import {
  Candles,
  ContractExpiryType,
  ExpiringContractStatus,
  HistoricalMarketTrade,
  PriceBook,
  Product,
  Products,
  ProductType,
} from './common-types';

// Get Server Time
export type GetServerTimeResponse = {
  iso?: string;
  epochSeconds?: number;
  epochMillis?: number;
};

// Get Public Product Book
export type GetPublicProductBookRequest = {
  // Query Params
  productId: string;
  limit?: number;
  aggregationPriceIncrement?: number;
};

export type GetPublicProductBookResponse = {
  pricebook: PriceBook;
};

// List Public Products
export type ListPublicProductsRequest = {
  // Query Params
  limit?: number;
  offset?: number;
  productType?: ProductType;
  productIds?: string[];
  contractExpiryType?: ContractExpiryType;
  expiringContractStatus?: ExpiringContractStatus;
  getAllProducts?: boolean;
};

export type ListPublicProductsResponse = {
  body?: Products;
};

// Get Public Product
export type GetPublicProductRequest = {
  // Path Params
  productId: string;
};

export type GetPublicProductResponse = {
  body?: Product;
};

//Get Public Product Candles
export type GetPublicProductCandlesRequest = {
  // Path Params
  productId: string;

  // Query Params
  start: string;
  end: string;
  granularity: string;
  limit?: number;
};

export type GetPublicProductCandlesResponse = {
  body?: Candles;
};

// Get Public Market Trades
export type GetPublicMarketTradesRequest = {
  // Path Params
  productId: string;

  // Query Params
  limit: number;
  start?: string;
  end?: string;
};

export type GetPublicMarketTradesResponse = {
  trades?: HistoricalMarketTrade[];
  best_bid?: string;
  best_ask?: string;
};



---
File: /advanced-sdk-ts/src/rest/types/request-types.ts
---

export enum method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface RequestOptions {
  method: method;
  endpoint: string;
  queryParams?: Record<string, any>;
  bodyParams?: Record<string, any>;
  isPublic: boolean;
}



---
File: /advanced-sdk-ts/src/rest/accounts.ts
---

import { API_PREFIX } from '../constants';
import { RESTBase } from './rest-base';
import {
  GetAccountRequest,
  GetAccountResponse,
  ListAccountsRequest,
  ListAccountsResponse,
} from './types/accounts-types';
import { method } from './types/request-types';

// [GET] Get Account
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccount
export function getAccount(
  this: RESTBase,
  { accountUuid }: GetAccountRequest
): Promise<GetAccountResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/accounts/${accountUuid}`,
    isPublic: false,
  });
}

// [GET] List Accounts
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccounts
export function listAccounts(
  this: RESTBase,
  requestParams: ListAccountsRequest
): Promise<ListAccountsResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/accounts`,
    queryParams: requestParams,
    isPublic: false,
  });
}



---
File: /advanced-sdk-ts/src/rest/converts.ts
---

import { API_PREFIX } from '../constants';
import { RESTBase } from './rest-base';
import {
  CommitConvertTradeRequest,
  CommitConvertTradeResponse,
  CreateConvertQuoteRequest,
  CreateConvertQuoteResponse,
  GetConvertTradeRequest,
  GetConvertTradeResponse,
} from './types/converts-types';
import { method } from './types/request-types';

// [POST] Create Convert Quote
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_createconvertquote
export function createConvertQuote(
  this: RESTBase,
  requestParams: CreateConvertQuoteRequest
): Promise<CreateConvertQuoteResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/convert/quote`,
    bodyParams: requestParams,
    isPublic: false,
  });
}

// [GET] Get Convert Trade
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getconverttrade
export function getConvertTrade(
  this: RESTBase,
  { tradeId, ...requestParams }: GetConvertTradeRequest
): Promise<GetConvertTradeResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/convert/trade/${tradeId}`,
    queryParams: requestParams,
    isPublic: false,
  });
}

// [POST] Commit Connvert Trade
// https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_commitconverttrade
export function commitConvertTrade(
  this: RESTBase,
  { tradeId, ...requestParams }: CommitConvertTradeRequest
): Promise<CommitConvertTradeResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/convert/trade/${tradeId}`,
    bodyParams: requestParams,
    isPublic: false,
  });
}



---
File: /advanced-sdk-ts/src/rest/dataAPI.ts
---

import { API_PREFIX } from '../constants';
import { RESTBase } from './rest-base';

import { method } from './types/request-types';
import { GetAPIKeyPermissionsResponse } from './types/dataAPI-types';

// [GET] Get API Key Permissions
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getapikeypermissions
export function getAPIKeyPermissions(
  this: RESTBase
): Promise<GetAPIKeyPermissionsResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/key_permissions`,
    isPublic: false,
  });
}



---
File: /advanced-sdk-ts/src/rest/errors.ts
---

import { Response } from 'node-fetch';

class CoinbaseError extends Error {
  statusCode: number;
  response: Response;

  constructor(message: string, statusCode: number, response: Response) {
    super(message);
    this.name = 'CoinbaseError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export function handleException(
  response: Response,
  responseText: string,
  reason: string
) {
  let message: string | undefined;

  if (
    (400 <= response.status && response.status <= 499) ||
    (500 <= response.status && response.status <= 599)
  ) {
    if (
      response.status == 403 &&
      responseText.includes('"error_details":"Missing required scopes"')
    ) {
      message = `${response.status} Coinbase Error: Missing Required Scopes. Please verify your API keys include the necessary permissions.`;
    } else
      message = `${response.status} Coinbase Error: ${reason} ${responseText}`;

    throw new CoinbaseError(message, response.status, response);
  }
}



---
File: /advanced-sdk-ts/src/rest/fees.ts
---

import { API_PREFIX } from '../constants';
import { RESTBase } from './rest-base';
import {
  GetTransactionsSummaryRequest,
  GetTransactionsSummaryResponse,
} from './types/fees-types';
import { method } from './types/request-types';

// [GET] Get Transaction Summary
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_commitconverttrade
export function getTransactionSummary(
  this: RESTBase,
  requestParams: GetTransactionsSummaryRequest
): Promise<GetTransactionsSummaryResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/transaction_summary`,
    queryParams: requestParams,
    isPublic: false,
  });
}



---
File: /advanced-sdk-ts/src/rest/futures.ts
---

import { API_PREFIX } from '../constants';
import { RESTBase } from './rest-base';
import {
  CancelPendingFuturesSweep,
  GetCurrentMarginWindowRequest,
  GetCurrentMarginWindowResponse,
  GetFuturesBalanceSummaryResponse,
  GetFuturesPositionRequest,
  GetFuturesPositionResponse,
  GetIntradayMarginSettingResponse,
  ListFuturesPositionsResponse,
  ListFuturesSweepsResponse,
  ScheduleFuturesSweepRequest,
  ScheduleFuturesSweepResponse,
  SetIntradayMarginSettingRequest,
  SetIntradayMarginSettingResponse,
} from './types/futures-types';
import { method } from './types/request-types';

// [GET] Get Futures Balance Summary
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmbalancesummary
export function getFuturesBalanceSummary(
  this: RESTBase
): Promise<GetFuturesBalanceSummaryResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/cfm/balance_summary`,
    isPublic: false,
  });
}

// [GET] Get Intraday Margin Setting
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintradaymarginsetting
export function getIntradayMarginSetting(
  this: RESTBase
): Promise<GetIntradayMarginSettingResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/cfm/intraday/margin_setting`,
    isPublic: false,
  });
}

// [POST] Set Intraday Margin Setting
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_setintradaymarginsetting
export function setIntradayMarginSetting(
  this: RESTBase,
  requestParams: SetIntradayMarginSettingRequest
): Promise<SetIntradayMarginSettingResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/cfm/intraday/margin_setting`,
    bodyParams: requestParams,
    isPublic: false,
  });
}

// [GET] Get Current Margin Window
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getcurrentmarginwindow
export function getCurrentMarginWindow(
  this: RESTBase,
  requestParams: GetCurrentMarginWindowRequest
): Promise<GetCurrentMarginWindowResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/cfm/intraday/current_margin_window`,
    queryParams: requestParams,
    isPublic: false,
  });
}

// [GET] List Futures Positions
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmpositions
export function listFuturesPositions(
  this: RESTBase
): Promise<ListFuturesPositionsResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/cfm/positions`,
    isPublic: false,
  });
}

// [GET] Get Futures Position
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmposition
export function getFuturesPosition(
  this: RESTBase,
  { productId }: GetFuturesPositionRequest
): Promise<GetFuturesPositionResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/cfm/positions/${productId}`,
    isPublic: false,
  });
}

// [POST] Schedule Futures Sweep
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_schedulefcmsweep
export function scheduleFuturesSweep(
  this: RESTBase,
  requestParams: ScheduleFuturesSweepRequest
): Promise<ScheduleFuturesSweepResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/cfm/sweeps/schedule`,
    bodyParams: requestParams,
    isPublic: false,
  });
}

// [GET] List Futures Sweeps
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfcmsweeps
export function listFuturesSweeps(
  this: RESTBase
): Promise<ListFuturesSweepsResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/cfm/sweeps`,
    isPublic: false,
  });
}

// [DELETE] Cancel Pending Futures Sweep
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_cancelfcmsweep
export function cancelPendingFuturesSweep(
  this: RESTBase
): Promise<CancelPendingFuturesSweep> {
  return this.request({
    method: method.DELETE,
    endpoint: `${API_PREFIX}/cfm/sweeps`,
    isPublic: false,
  });
}



---
File: /advanced-sdk-ts/src/rest/index.ts
---

import { RESTBase } from './rest-base';
import * as Accounts from './accounts';
import * as Converts from './converts';
import * as DataAPI from './dataAPI';
import * as Fees from './fees';
import * as Futures from './futures';
import * as Orders from './orders';
import * as Payments from './payments';
import * as Perpetuals from './perpetuals';
import * as Portfolios from './portfolios';
import * as Products from './products';
import * as Public from './public';

export class RESTClient extends RESTBase {
  constructor(key?: string | undefined, secret?: string | undefined) {
    super(key, secret);
  }

  // =============== ACCOUNTS endpoints ===============
  public getAccount = Accounts.getAccount.bind(this);
  public listAccounts = Accounts.listAccounts.bind(this);

  // =============== CONVERTS endpoints ===============
  public createConvertQuote = Converts.createConvertQuote.bind(this);
  public commitConvertTrade = Converts.commitConvertTrade.bind(this);
  public getConvertTrade = Converts.getConvertTrade.bind(this);

  // =============== DATA API endpoints ===============
  public getAPIKeyPermissions = DataAPI.getAPIKeyPermissions.bind(this);

  // =============== FEES endpoints ===============
  public getTransactionSummary = Fees.getTransactionSummary.bind(this);

  // =============== FUTURES endpoints ===============
  public getFuturesBalanceSummary = Futures.getFuturesBalanceSummary.bind(this);
  public getIntradayMarginSetting = Futures.getIntradayMarginSetting.bind(this);
  public setIntradayMarginSetting = Futures.setIntradayMarginSetting.bind(this);
  public getCurrentMarginWindow = Futures.getCurrentMarginWindow.bind(this);
  public listFuturesPositions = Futures.listFuturesPositions.bind(this);
  public getFuturesPosition = Futures.getFuturesPosition.bind(this);
  public scheduleFuturesSweep = Futures.scheduleFuturesSweep.bind(this);
  public listFuturesSweeps = Futures.listFuturesSweeps.bind(this);
  public cancelPendingFuturesSweep =
    Futures.cancelPendingFuturesSweep.bind(this);

  // =============== ORDERS endpoints ===============
  public createOrder = Orders.createOrder.bind(this);
  public cancelOrders = Orders.cancelOrders.bind(this);
  public editOrder = Orders.editOrder.bind(this);
  public editOrderPreview = Orders.editOrderPreview.bind(this);
  public listOrders = Orders.listOrders.bind(this);
  public listFills = Orders.listFills.bind(this);
  public getOrder = Orders.getOrder.bind(this);
  public previewOrder = Orders.previewOrder.bind(this);
  public closePosition = Orders.closePosition.bind(this);

  // =============== PAYMENTS endpoints ===============
  public listPaymentMethods = Payments.listPaymentMethods.bind(this);
  public getPaymentMethod = Payments.getPaymentMethod.bind(this);

  // =============== PERPETUALS endpoints ===============
  public allocatePortfolio = Perpetuals.allocatePortfolio.bind(this);
  public getPerpetualsPortfolioSummary =
    Perpetuals.getPerpetualsPortfolioSummary.bind(this);
  public listPerpetualsPositions =
    Perpetuals.listPerpetualsPositions.bind(this);
  public getPerpetualsPosition = Perpetuals.getPerpertualsPosition.bind(this);
  public getPortfolioBalances = Perpetuals.getPortfolioBalances.bind(this);
  public optInOutMultiAssetCollateral =
    Perpetuals.optInOutMultiAssetCollateral.bind(this);

  // =============== PORTFOLIOS endpoints ===============
  public listPortfolios = Portfolios.listPortfolios.bind(this);
  public createPortfolio = Portfolios.createPortfolio.bind(this);
  public deletePortfolio = Portfolios.deletePortfolio.bind(this);
  public editPortfolio = Portfolios.editPortfolio.bind(this);
  public movePortfolioFunds = Portfolios.movePortfolioFunds.bind(this);
  public getPortfolioBreakdown = Portfolios.getPortfolioBreakdown.bind(this);

  // =============== PRODUCTS endpoints ===============
  public getBestBidAsk = Products.getBestBidAsk.bind(this);
  public getProductBook = Products.getProductBook.bind(this);
  public listProducts = Products.listProducts.bind(this);
  public getProduct = Products.getProduct.bind(this);
  public getProductCandles = Products.getProductCandles.bind(this);
  public getMarketTrades = Products.getMarketTrades.bind(this);

  // =============== PUBLIC endpoints ===============
  public getServerTime = Public.getServerTime.bind(this);
  public getPublicProductBook = Public.getPublicProductBook.bind(this);
  public listPublicProducts = Public.listPublicProducts.bind(this);
  public getPublicProduct = Public.getPublicProduct.bind(this);
  public getPublicProductCandles = Public.getPublicProductCandles.bind(this);
  public getPublicMarketTrades = Public.getPublicMarketTrades.bind(this);
}



---
File: /advanced-sdk-ts/src/rest/orders.ts
---

import { API_PREFIX } from '../constants';
import { RESTBase } from './rest-base';
import {
  CancelOrdersRequest,
  CancelOrdersResponse,
  ClosePositionRequest,
  ClosePositionResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  EditOrderPreviewRequest,
  EditOrderPreviewResponse,
  EditOrderRequest,
  EditOrderResponse,
  GetOrderRequest,
  GetOrderResponse,
  ListFillsRequest,
  ListFillsResponse,
  ListOrdersRequest,
  ListOrdersResponse,
  PreviewOrderRequest,
  PreviewOrderResponse,
} from './types/orders-types';
import { method } from './types/request-types';

// [POST] Create Order
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_postorder
export function createOrder(
  this: RESTBase,
  requestParams: CreateOrderRequest
): Promise<CreateOrderResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/orders`,
    bodyParams: requestParams,
    isPublic: false,
  });
}

// [POST] Cancel Orders
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_cancelorders
export function cancelOrders(
  this: RESTBase,
  requestParams: CancelOrdersRequest
): Promise<CancelOrdersResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/orders/batch_cancel`,
    bodyParams: requestParams,
    isPublic: false,
  });
}

// [POST] Edit Order
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_editorder
export function editOrder(
  this: RESTBase,
  requestParams: EditOrderRequest
): Promise<EditOrderResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/orders/edit`,
    bodyParams: requestParams,
    isPublic: false,
  });
}

// [POST] Edit Order Preview
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_previeweditorder
export function editOrderPreview(
  this: RESTBase,
  requestParams: EditOrderPreviewRequest
): Promise<EditOrderPreviewResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/orders/edit_preview`,
    bodyParams: requestParams,
    isPublic: false,
  });
}

// [GET] List Orders
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gethistoricalorders
export function listOrders(
  this: RESTBase,
  requestParams: ListOrdersRequest
): Promise<ListOrdersResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/orders/historical/batch`,
    queryParams: requestParams,
    isPublic: false,
  });
}

// [GET] List Fills
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getfills
export function listFills(
  this: RESTBase,
  requestParams: ListFillsRequest
): Promise<ListFillsResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/orders/historical/fills`,
    queryParams: requestParams,
    isPublic: false,
  });
}

// [GET] Get Order
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_gethistoricalorder
export function getOrder(
  this: RESTBase,
  { orderId }: GetOrderRequest
): Promise<GetOrderResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/orders/historical/${orderId}`,
    isPublic: false,
  });
}

// [POST] Preview Order
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_previeworder
export function previewOrder(
  this: RESTBase,
  requestParams: PreviewOrderRequest
): Promise<PreviewOrderResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/orders/preview`,
    bodyParams: requestParams,
    isPublic: false,
  });
}

// [POST] Close Position
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_closeposition
export function closePosition(
  this: RESTBase,
  requestParams: ClosePositionRequest
): Promise<ClosePositionResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/orders/close_position`,
    queryParams: undefined,
    bodyParams: requestParams,
    isPublic: false,
  });
}



---
File: /advanced-sdk-ts/src/rest/payments.ts
---

import { API_PREFIX } from '../constants';
import { RESTBase } from './rest-base';
import {
  GetPaymentMethodRequest,
  GetPaymentMethodResponse,
  ListPaymentMethodsResponse,
} from './types/payments-types';
import { method } from './types/request-types';

// [GET] List Payment Methods
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpaymentmethods
export function listPaymentMethods(
  this: RESTBase
): Promise<ListPaymentMethodsResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/payment_methods`,
    isPublic: false,
  });
}

// [GET] Get Payment Method
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpaymentmethod
export function getPaymentMethod(
  this: RESTBase,
  { paymentMethodId }: GetPaymentMethodRequest
): Promise<GetPaymentMethodResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/payment_methods/${paymentMethodId}`,
    isPublic: false,
  });
}



---
File: /advanced-sdk-ts/src/rest/perpetuals.ts
---

import { API_PREFIX } from '../constants';
import { RESTBase } from './rest-base';
import {
  AllocatePortfolioRequest,
  AllocatePortfolioResponse,
  GetPerpetualsPortfolioSummaryRequest,
  GetPerpetualsPortfolioSummaryResponse,
  GetPerpetualsPositionRequest,
  GetPerpetualsPositionResponse,
  GetPortfolioBalancesRequest,
  GetPortfolioBalancesResponse,
  ListPerpetualsPositionsRequest,
  ListPerpetualsPositionsResponse,
  OptInOutMultiAssetCollateralRequest,
  OptInOutMultiAssetCollateralResponse,
} from './types/perpetuals-types';
import { method } from './types/request-types';

// [POST] Allocate Portfolio
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_allocateportfolio
export function allocatePortfolio(
  this: RESTBase,
  requestParams: AllocatePortfolioRequest
): Promise<AllocatePortfolioResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/intx/allocate`,
    bodyParams: requestParams,
    isPublic: false,
  });
}

// [GET] Get Perpetuals Portfolio Summary
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxportfoliosummary
export function getPerpetualsPortfolioSummary(
  this: RESTBase,
  { portfolioUuid }: GetPerpetualsPortfolioSummaryRequest
): Promise<GetPerpetualsPortfolioSummaryResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/intx/portfolio/${portfolioUuid}`,
    isPublic: false,
  });
}

// [GET] List Perpetuals Positions
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxpositions
export function listPerpetualsPositions(
  this: RESTBase,
  { portfolioUuid }: ListPerpetualsPositionsRequest
): Promise<ListPerpetualsPositionsResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/intx/positions/${portfolioUuid}`,
    isPublic: false,
  });
}

// [GET] Get Perpetuals Position
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxposition
export function getPerpetualsPosition(
  this: RESTBase,
  { portfolioUuid, symbol }: GetPerpetualsPositionRequest
): Promise<GetPerpetualsPositionResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/intx/positions/${portfolioUuid}/${symbol}`,
    isPublic: false,
  });
}

// [GET] Get Portfolio Balances
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getintxbalances
export function getPortfolioBalances(
  this: RESTBase,
  { portfolioUuid }: GetPortfolioBalancesRequest
): Promise<GetPortfolioBalancesResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/intx/balances/${portfolioUuid}`,
    isPublic: false,
  });
}

// [POST] Opt In or Out of Multi Asset Collateral
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_intxmultiassetcollateral
export function optInOutMultiAssetCollateral(
  this: RESTBase,
  requestParams: OptInOutMultiAssetCollateralRequest
): Promise<OptInOutMultiAssetCollateralResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/intx/multi_asset_collateral`,
    bodyParams: requestParams,
    isPublic: false,
  });
}



---
File: /advanced-sdk-ts/src/rest/portfolios.ts
---

import { API_PREFIX } from '../constants';
import { RESTBase } from './rest-base';
import {
  CreatePortfolioRequest,
  CreatePortfolioResponse,
  DeletePortfolioRequest,
  DeletePortfolioResponse,
  EditPortfolioRequest,
  EditPortfolioResponse,
  GetPortfolioBreakdownRequest,
  GetPortfolioBreakdownResponse,
  ListPortfoliosRequest,
  ListPortfoliosResponse,
  MovePortfolioFundsRequest,
  MovePortfolioFundsResponse,
} from './types/portfolios-types';
import { method } from './types/request-types';

// [GET] List Portfolios
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getportfolios
export function listPortfolios(
  this: RESTBase,
  requestParams: ListPortfoliosRequest
): Promise<ListPortfoliosResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/portfolios`,
    queryParams: requestParams,
    isPublic: false,
  });
}

// [POST] Create Portfolio
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_createportfolio
export function createPortfolio(
  this: RESTBase,
  requestParams: CreatePortfolioRequest
): Promise<CreatePortfolioResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/portfolios`,
    bodyParams: requestParams,
    isPublic: false,
  });
}

// [POST] Move Portfolio Funds
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_moveportfoliofunds
export function movePortfolioFunds(
  this: RESTBase,
  requestParams: MovePortfolioFundsRequest
): Promise<MovePortfolioFundsResponse> {
  return this.request({
    method: method.POST,
    endpoint: `${API_PREFIX}/portfolios/move_funds`,
    bodyParams: requestParams,
    isPublic: false,
  });
}

// [GET] Get Portfolio Breakdown
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getportfoliobreakdown
export function getPortfolioBreakdown(
  this: RESTBase,
  { portfolioUuid, ...requestParams }: GetPortfolioBreakdownRequest
): Promise<GetPortfolioBreakdownResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/portfolios/${portfolioUuid}`,
    queryParams: requestParams,
    isPublic: false,
  });
}

// [DELETE] Delete Portfolio
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_deleteportfolio
export function deletePortfolio(
  this: RESTBase,
  { portfolioUuid }: DeletePortfolioRequest
): Promise<DeletePortfolioResponse> {
  return this.request({
    method: method.DELETE,
    endpoint: `${API_PREFIX}/portfolios/${portfolioUuid}`,
    isPublic: false,
  });
}

// [PUT] Edit Portfolio
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_editportfolio
export function editPortfolio(
  this: RESTBase,
  { portfolioUuid, ...requestParams }: EditPortfolioRequest
): Promise<EditPortfolioResponse> {
  return this.request({
    method: method.PUT,
    endpoint: `${API_PREFIX}/portfolios/${portfolioUuid}`,
    bodyParams: requestParams,
    isPublic: false,
  });
}



---
File: /advanced-sdk-ts/src/rest/products.ts
---

import { API_PREFIX } from '../constants';
import { RESTBase } from './rest-base';
import {
  GetBestBidAskRequest,
  GetBestBidAskResponse,
  GetMarketTradesRequest,
  GetMarketTradesResponse,
  GetProductBookRequest,
  GetProductBookResponse,
  GetProductCandlesRequest,
  GetProductCandlesResponse,
  GetProductRequest,
  GetProductResponse,
  ListProductsRequest,
  ListProductsResponse,
} from './types/products-types';
import { method } from './types/request-types';

// [GET] Get Best Bid Ask
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getbestbidask
export function getBestBidAsk(
  this: RESTBase,
  requestParams: GetBestBidAskRequest
): Promise<GetBestBidAskResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/best_bid_ask`,
    queryParams: requestParams,
    isPublic: false,
  });
}

// [GET] Get Product Book
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getproductbook
export function getProductBook(
  this: RESTBase,
  requestParams: GetProductBookRequest
): Promise<GetProductBookResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/product_book`,
    queryParams: requestParams,
    isPublic: false,
  });
}

// [GET] List Products
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getproducts
export function listProducts(
  this: RESTBase,
  requestParams: ListProductsRequest
): Promise<ListProductsResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/products`,
    queryParams: requestParams,
    isPublic: false,
  });
}

// [GET] Get Product
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getproduct
export function getProduct(
  this: RESTBase,
  { productId, ...requestParams }: GetProductRequest
): Promise<GetProductResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/products/${productId}`,
    queryParams: requestParams,
    isPublic: false,
  });
}

// [GET] Get Product Candles
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getcandles
export function getProductCandles(
  this: RESTBase,
  { productId, ...requestParams }: GetProductCandlesRequest
): Promise<GetProductCandlesResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/products/${productId}/candles`,
    queryParams: requestParams,
    isPublic: false,
  });
}

// [GET] Get Market Trades
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getmarkettrades
export function getMarketTrades(
  this: RESTBase,
  { productId, ...requestParams }: GetMarketTradesRequest
): Promise<GetMarketTradesResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/products/${productId}/ticker`,
    queryParams: requestParams,
    isPublic: false,
  });
}



---
File: /advanced-sdk-ts/src/rest/public.ts
---

import { API_PREFIX } from '../constants';
import { RESTBase } from './rest-base';
import {
  GetPublicMarketTradesRequest,
  GetPublicMarketTradesResponse,
  GetPublicProductBookRequest,
  GetPublicProductBookResponse,
  GetPublicProductCandlesRequest,
  GetPublicProductCandlesResponse,
  GetPublicProductRequest,
  GetPublicProductResponse,
  GetServerTimeResponse,
  ListPublicProductsRequest,
  ListPublicProductsResponse,
} from './types/public-types';
import { method } from './types/request-types';

// [GET] Get Server Time
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getservertime
export function getServerTime(this: RESTBase): Promise<GetServerTimeResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/time`,
    isPublic: true,
  });
}

// [GET] Get Public Product Book
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpublicproductbook
export function getPublicProductBook(
  this: RESTBase,
  requestParams: GetPublicProductBookRequest
): Promise<GetPublicProductBookResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/market/product_book`,
    queryParams: requestParams,
    isPublic: true,
  });
}

// [GET] List Public Products
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpublicproducts
export function listPublicProducts(
  this: RESTBase,
  requestParams: ListPublicProductsRequest
): Promise<ListPublicProductsResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/market/products`,
    queryParams: requestParams,
    isPublic: true,
  });
}

// [GET] Get Public Product
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpublicproduct
export function getPublicProduct(
  this: RESTBase,
  { productId }: GetPublicProductRequest
): Promise<GetPublicProductResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/market/products/${productId}`,
    isPublic: true,
  });
}

// [GET] Get Public Product Candles
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpubliccandles
export function getPublicProductCandles(
  this: RESTBase,
  { productId, ...requestParams }: GetPublicProductCandlesRequest
): Promise<GetPublicProductCandlesResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/market/products/${productId}/candles`,
    queryParams: requestParams,
    isPublic: true,
  });
}

// [GET] Get Public Market Trades
// Official Documentation: https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getpublicmarkettrades
export function getPublicMarketTrades(
  this: RESTBase,
  { productId, ...requestParams }: GetPublicMarketTradesRequest
): Promise<GetPublicMarketTradesResponse> {
  return this.request({
    method: method.GET,
    endpoint: `${API_PREFIX}/products/${productId}/ticker`,
    queryParams: requestParams,
    isPublic: true,
  });
}



---
File: /advanced-sdk-ts/src/rest/rest-base.ts
---

import { generateToken } from '../jwt-generator';
import fetch, { Headers, RequestInit, Response } from 'node-fetch';
import { BASE_URL, USER_AGENT } from '../constants';
import { RequestOptions } from './types/request-types';
import { handleException } from './errors';

export class RESTBase {
  private apiKey: string | undefined;
  private apiSecret: string | undefined;

  constructor(key?: string, secret?: string) {
    if (!key || !secret) {
      console.log('Could not authenticate. Only public endpoints accessible.');
    }
    this.apiKey = key;
    this.apiSecret = secret;
  }

  request(options: RequestOptions): Promise<any> {
    const { method, endpoint, isPublic } = options;
    let { queryParams, bodyParams } = options;

    queryParams = queryParams ? this.filterParams(queryParams) : {};

    if (bodyParams !== undefined)
      bodyParams = bodyParams ? this.filterParams(bodyParams) : {};

    return this.prepareRequest(
      method,
      endpoint,
      queryParams,
      bodyParams,
      isPublic
    );
  }

  prepareRequest(
    httpMethod: string,
    urlPath: string,
    queryParams?: Record<string, any>,
    bodyParams?: Record<string, any>,
    isPublic?: boolean
  ) {
    const headers: Headers = this.setHeaders(httpMethod, urlPath, isPublic);

    const requestOptions: RequestInit = {
      method: httpMethod,
      headers: headers,
      body: JSON.stringify(bodyParams),
    };

    const queryString = this.buildQueryString(queryParams);
    const url = `https://${BASE_URL}${urlPath}${queryString}`;

    return this.sendRequest(headers, requestOptions, url);
  }

  async sendRequest(
    headers: Headers,
    requestOptions: RequestInit,
    url: string
  ) {
    const response: Response = await fetch(url, requestOptions);
    const responseText = await response.text();
    handleException(response, responseText, response.statusText);

    return responseText;
  }

  setHeaders(httpMethod: string, urlPath: string, isPublic?: boolean) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('User-Agent', USER_AGENT);
    if (this.apiKey !== undefined && this.apiSecret !== undefined)
      headers.append(
        'Authorization',
        `Bearer ${generateToken(
          httpMethod,
          urlPath,
          this.apiKey,
          this.apiSecret
        )}`
      );
    else if (isPublic == undefined || isPublic == false)
      throw new Error(
        'Attempting to access authenticated endpoint with invalid API_KEY or API_SECRET.'
      );

    return headers;
  }

  filterParams(data: Record<string, any>) {
    const filteredParams: Record<string, any> = {};

    for (const key in data) {
      if (data[key] !== undefined) {
        filteredParams[key] = data[key];
      }
    }

    return filteredParams;
  }

  buildQueryString(queryParams?: Record<string, any>): string {
    if (!queryParams || Object.keys(queryParams).length === 0) {
      return '';
    }

    const queryString = Object.entries(queryParams)
      .flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(
            (item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`
          );
        } else {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
      })
      .join('&');

    return `?${queryString}`;
  }
}



---
File: /advanced-sdk-ts/src/constants.ts
---

export const BASE_URL = 'api.coinbase.com';
export const API_PREFIX = '/api/v3/brokerage';
export const ALGORITHM = 'ES256';
export const VERSION = '0.1.0';
export const USER_AGENT = `coinbase-advanced-ts/${VERSION}`;
export const JWT_ISSUER = 'cdp';



---
File: /advanced-sdk-ts/src/jwt-generator.ts
---

import jwt from 'jsonwebtoken';
import { BASE_URL, ALGORITHM, JWT_ISSUER } from './constants';
import crypto from 'crypto';

export function generateToken(
  requestMethod: string,
  requestPath: string,
  apiKey: string,
  apiSecret: string
): string {
  const uri = `${requestMethod} ${BASE_URL}${requestPath}`;
  const payload = {
    iss: JWT_ISSUER,
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 120,
    sub: apiKey,
    uri,
  };

  const header = {
    alg: ALGORITHM,
    kid: apiKey,
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const options: jwt.SignOptions = {
    algorithm: ALGORITHM as jwt.Algorithm,
    header: header,
  };

  return jwt.sign(payload, apiSecret as string, options);
}



---
File: /advanced-sdk-ts/.eslintrc.js
---

/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  ignorePatterns: ['**/dist/**', '**/node_modules/**', '**/*.md'],
  env: {
    node: true, // Add this line to recognize Node.js globals
    es2021: true, // Optionally include modern JavaScript features
  },
};



---
File: /advanced-sdk-ts/CHANGELOG.md
---

# Changelog

## [0.1.0] - 2024-SEP-06

### Added

- Support for all Coinbase Advanced API REST endpoints via central client
- Custom Request and Response objects for endpoints
- Custom error types



---
File: /advanced-sdk-ts/package.json
---

{
  "name": "@coinbase-samples/advanced-sdk-ts",
  "version": "0.1.0",
  "main": "dist/main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "tsc",
    "lint": "eslint . --ext .js,.ts",
    "format": "prettier --write \"**/*.{js,ts,tsx,json,css,md}\""
  },
  "files": [
    "dist/"
  ],
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "jsonwebtoken": "^9.0.2",
    "node-fetch": "^2.6.1"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node-fetch": "^2.6.11",
    "@typescript-eslint/eslint-plugin": "^5.59.0",
    "@typescript-eslint/parser": "^5.59.0",
    "dotenv": "^16.4.5",
    "eslint": "^8.35.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "^4.2.1",
    "prettier": "^2.8.8",
    "typescript": "^5.5.4"
  }
}



---
File: /advanced-sdk-ts/README.md
---

# Coinbase Advanced API TypeScript SDK

Welcome to the Coinbase Advanced API TypeScript SDK. This TypeScript project was created to allow developers to easily plug into the [Coinbase Advanced API](https://docs.cdp.coinbase.com/advanced-trade/docs/welcome).

Coinbase Advanced Trade offers a comprehensive API for traders, providing access to real-time market data, order management, and execution. Elevate your trading strategies and develop sophisticated solutions using our powerful tools and features.

For more information on all the available REST endpoints, see the [API Reference](https://docs.cdp.coinbase.com/advanced-trade/reference/).

---

## Installation

```bash
npm install
```

---

## Build and Use

To build the project, run the following command:

```bash
npm run build
```

_Note: To avoid potential issues, do not forget to build your project again after making any changes to it._

After building the project, each `.ts` file will have its `.js` counterpart generated.

To run a file, use the following command:

```
node dist/{INSERT-FILENAME}.js
```

For example, a `main.ts` file would be run like:

```bash
node dist/main.js
```

---

## Coinbase Developer Platform (CDP) API Keys

This SDK uses Cloud Developer Platform (CDP) API keys. To use this SDK, you will need to create a CDP API key and secret by following the instructions [here](https://docs.cdp.coinbase.com/advanced-trade/docs/getting-started).
Make sure to save your API key and secret in a safe place. You will not be able to retrieve your secret again.

---

## Importing the RESTClient

All the REST endpoints are available directly from the client, therefore it's all you need to import.

```
import { RESTClient } from './rest';
```

---

## Authentication

Authentication of CDP API Keys is handled automatically by the SDK when making a REST request.

After creating your CDP API keys, store them using your desired method and simply pass them into the client during initialization like:

```
const client = new RESTClient(API_KEY, API_SECRET);
```

---

## Making Requests

Here are a few examples requests:

**[List Accounts](https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getaccounts)**

```
client
    .listAccounts({})
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error.message);
    });
```

**[Get Product](https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_getproduct)**

```
client
    .getProduct({productId: "BTC-USD"})
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error.message);
    });
```

**[Create Order](https://docs.cdp.coinbase.com/advanced-trade/reference/retailbrokerageapi_postorder)**

_$10 Market Buy on BTC-USD_

```
client
    .createOrder({
        clientOrderId: "00000001",
        productId: "BTC-USD",
        side: OrderSide.BUY,
        orderConfiguration:{
            market_market_ioc: {
                quote_size: "10"
            }
        }
    })
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error.message);
    });
```



---
File: /src/plugins/advancedTrade.ts
---

import { RESTClient } from '../../advanced-sdk-ts/src/rest';
import {
    Action,
    Plugin,
    elizaLogger,
    IAgentRuntime,
    Memory,
    HandlerCallback,
    State,
    composeContext,
    generateObjectV2,
    ModelClass,
    Provider,
} from "@ai16z/eliza";
import { advancedTradeTemplate } from "../templates";
import { isAdvancedTradeContent, AdvancedTradeSchema } from "../types";
import { readFile } from "fs/promises";
import { parse } from "csv-parse/sync";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createArrayCsvWriter } from "csv-writer";
import { OrderSide, OrderConfiguration } from '../../advanced-sdk-ts/src/rest/types/common-types';
import { CreateOrderResponse } from '../../advanced-sdk-ts/src/rest/types/orders-types';

// File path setup remains the same
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, "../../plugin-coinbase/src/plugins");
const tradeCsvFilePath = path.join(baseDir, "advanced_trades.csv");

const tradeProvider: Provider = {
    get: async (runtime: IAgentRuntime, _message: Memory) => {
        try {
            const client = new RESTClient(
                runtime.getSetting("COINBASE_API_KEY") ?? process.env.COINBASE_API_KEY,
                runtime.getSetting("COINBASE_PRIVATE_KEY") ?? process.env.COINBASE_PRIVATE_KEY
            );

            // Get accounts and products information
            let accounts, products;
            try {
                accounts = await client.listAccounts({});
            } catch (error) {
                elizaLogger.error("Error fetching accounts:", error);
                return [];
            }

            try {
                products = await client.listProducts({});
            } catch (error) {
                elizaLogger.error("Error fetching products:", error);
                return [];
            }

            // Read CSV file logic remains the same
            if (!fs.existsSync(tradeCsvFilePath)) {
                const csvWriter = createArrayCsvWriter({
                    path: tradeCsvFilePath,
                    header: [
                        "Order ID",
                        "Success",
                        "Order Configuration",
                        "Response",
                    ],
                });
                await csvWriter.writeRecords([]);
            }

            let csvData, records;
            try {
                csvData = await readFile(tradeCsvFilePath, "utf-8");
            } catch (error) {
                elizaLogger.error("Error reading CSV file:", error);
                return [];
            }

            try {
                records = parse(csvData, {
                    columns: true,
                    skip_empty_lines: true,
                });
            } catch (error) {
                elizaLogger.error("Error parsing CSV data:", error);
                return [];
            }

            return {
                accounts: accounts.accounts,
                products: products.products,
                trades: records
            };
        } catch (error) {
            elizaLogger.error("Error in tradeProvider:", error);
            return [];
        }
    },
};

export async function appendTradeToCsv(tradeResult: any) {
    try {
        const csvWriter = createArrayCsvWriter({
            path: tradeCsvFilePath,
            header: [
                "Order ID",
                "Success",
                "Order Configuration",
                "Response",
            ],
            append: true,
        });
        elizaLogger.info("Trade result:", tradeResult);


        // Format trade data based on success/failure
        const formattedTrade = [
            tradeResult.success_response?.order_id || tradeResult.failure_response?.order_id || '',
            tradeResult.success,
            // JSON.stringify(tradeResult.order_configuration || {}),
            // JSON.stringify(tradeResult.success_response || tradeResult.failure_response || {})
        ];

        elizaLogger.info("Formatted trade for CSV:", formattedTrade);
        await csvWriter.writeRecords([formattedTrade]);
        elizaLogger.info("Trade written to CSV successfully");
    } catch (error) {
        elizaLogger.error("Error writing trade to CSV:", error);
        // Log the actual error for debugging
        if (error instanceof Error) {
            elizaLogger.error("Error details:", error.message);
        }
    }
}

async function hasEnoughBalance(client: RESTClient, currency: string, amount: number, side: string): Promise<boolean> {
    try {
        const response = await client.listAccounts({});
        const accounts = JSON.parse(response);
        elizaLogger.info("Accounts:", accounts);
        const checkCurrency = side === "BUY" ? "USD" : currency;
        elizaLogger.info(`Checking balance for ${side} order of ${amount} ${checkCurrency}`);

        // Find account with exact currency match
        const account = accounts?.accounts.find(acc =>
            acc.currency === checkCurrency &&
            (checkCurrency === "USD" ? acc.type === "ACCOUNT_TYPE_FIAT" : acc.type === "ACCOUNT_TYPE_CRYPTO")
        );

        if (!account) {
            elizaLogger.error(`No ${checkCurrency} account found`);
            return false;
        }

        const available = parseFloat(account.available_balance.value);
        // Add buffer for fees only on USD purchases
        const requiredAmount = side === "BUY" ? amount * 1.01 : amount;
        elizaLogger.info(`Required amount (including buffer): ${requiredAmount} ${checkCurrency}`);

        const hasBalance = available >= requiredAmount;
        elizaLogger.info(`Has sufficient balance: ${hasBalance}`);

        return hasBalance;
    } catch (error) {
        elizaLogger.error("Balance check failed with error:", {
            error: error instanceof Error ? error.message : 'Unknown error',
            currency,
            amount,
            side
        });
        return false;
    }
}

export const executeAdvancedTradeAction: Action = {
    name: "EXECUTE_ADVANCED_TRADE",
    description: "Execute a trade using Coinbase Advanced Trading API",
    validate: async (runtime: IAgentRuntime) => {
        return !!(runtime.getSetting("COINBASE_API_KEY") || process.env.COINBASE_API_KEY) &&
               !!(runtime.getSetting("COINBASE_PRIVATE_KEY") || process.env.COINBASE_PRIVATE_KEY);
    },
    similes: [
        "EXECUTE_ADVANCED_TRADE",
        "ADVANCED_MARKET_ORDER",
        "ADVANCED_LIMIT_ORDER",
        "COINBASE_PRO_TRADE",
        "PROFESSIONAL_TRADE"
    ],
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        let client: RESTClient;

        // Initialize client
        try {
            client = new RESTClient(
                runtime.getSetting("COINBASE_API_KEY") ?? process.env.COINBASE_API_KEY,
                runtime.getSetting("COINBASE_PRIVATE_KEY") ?? process.env.COINBASE_PRIVATE_KEY
            );
            elizaLogger.info("Advanced trade client initialized");
        } catch (error) {
            elizaLogger.error("Client initialization failed:", error);
            callback({
                text: "Failed to initialize trading client. Please check your API credentials."
            }, []);
            return;
        }

        // Generate trade details
        let tradeDetails;
        try {
            tradeDetails = await generateObjectV2({
                runtime,
                context: composeContext({ state, template: advancedTradeTemplate }),
                modelClass: ModelClass.LARGE,
                schema: AdvancedTradeSchema,
            });
            elizaLogger.info("Trade details generated:", tradeDetails.object);
        } catch (error) {
            elizaLogger.error("Trade details generation failed:", error);
            callback({
                text: "Failed to generate trade details. Please provide valid trading parameters."
            }, []);
            return;
        }

        // Validate trade content
        if (!isAdvancedTradeContent(tradeDetails.object)) {
            elizaLogger.error("Invalid trade content:", tradeDetails.object);
            callback({
                text: "Invalid trade details. Please check your input parameters."
            }, []);
            return;
        }

        const { productId, amount, side, orderType, limitPrice } = tradeDetails.object;

        // Configure order
        let orderConfiguration: OrderConfiguration;
        try {
            if (orderType === "MARKET") {
                orderConfiguration = side === "BUY" ? {
                    market_market_ioc: {
                        quote_size: amount.toString()
                    }
                } : {
                    market_market_ioc: {
                        base_size: amount.toString()
                    }
                };
            } else {
                if (!limitPrice) {
                    throw new Error("Limit price is required for limit orders");
                }
                orderConfiguration = {
                    limit_limit_gtc: {
                        baseSize: amount.toString(),
                        limitPrice: limitPrice.toString(),
                        postOnly: false
                    }
                };
            }
            elizaLogger.info("Order configuration created:", orderConfiguration);
        } catch (error) {
            elizaLogger.error("Order configuration failed:", error);
            callback({
                text: error instanceof Error ? error.message : "Failed to configure order parameters."
            }, []);
            return;
        }

        // Execute trade
        let order: CreateOrderResponse;
        try {
            if (!(await hasEnoughBalance(client, productId.split('-')[0], amount, side))) {
                callback({
                    text: `Insufficient ${side === "BUY" ? "USD" : productId.split('-')[0]} balance to execute this trade`
                }, []);
                return;
            }

            order = await client.createOrder({
                clientOrderId:  crypto.randomUUID(),
                productId,
                side: side === "BUY" ? OrderSide.BUY : OrderSide.SELL,
                orderConfiguration
            });

            elizaLogger.info("Trade executed successfully:", order);
        } catch (error) {
            elizaLogger.error("Trade execution failed:", error?.message);
            callback({
                text: `Failed to execute trade: ${error instanceof Error ? error.message : "Unknown error occurred"}`
            }, []);
            return;
        }
            // Log trade to CSV
            try {
                // await appendTradeToCsv(order);
                elizaLogger.info("Trade logged to CSV");
            } catch (csvError) {
                elizaLogger.warn("Failed to log trade to CSV:", csvError);
                // Continue execution as this is non-critical
            }

            callback({
                text: `Advanced Trade executed successfully:
- Product: ${productId}
- Type: ${orderType} Order
- Side: ${side}
- Amount: ${amount}
- ${orderType === "LIMIT" ? `- Limit Price: ${limitPrice}\n` : ""}- Order ID: ${order.order_id}
- Status: ${order.success}
- Order Id:  ${order.order_id}
- Response: ${JSON.stringify(order.response)}
- Order Configuration: ${JSON.stringify(order.order_configuration)}`
            }, []);
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Place an advanced market order to buy $1 worth of BTC" }
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Advanced Trade executed successfully:
- Product: BTC-USD
- Type: Market Order
- Side: BUY
- Amount: 1000
- Order ID: CB-ADV-12345
- Success: true
- Response: {"success_response":{}}
- Order Configuration: {"market_market_ioc":{"quote_size":"1000"}}`
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Set a limit order to sell 0.5 ETH at $2000" }
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Advanced Trade executed successfully:
- Product: ETH-USD
- Type: Limit Order
- Side: SELL
- Amount: 0.5
- Limit Price: 2000
- Order ID: CB-ADV-67890
- Success: true
- Response: {"success_response":{}}
- Order Configuration: {"limit_limit_gtc":{"baseSize":"0.5","limitPrice":"2000","postOnly":false}}`
                }
            }
        ]
    ]
};

export const advancedTradePlugin: Plugin = {
    name: "advancedTradePlugin",
    description: "Enables advanced trading using Coinbase Advanced Trading API",
    actions: [executeAdvancedTradeAction],
    providers: [tradeProvider],
};


---
File: /src/plugins/commerce.ts
---

import {
    composeContext,
    elizaLogger,
    generateObjectV2,
    ModelClass,
    Provider,
} from "@ai16z/eliza";
import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    Plugin,
    State,
} from "@ai16z/eliza";
import { ChargeContent, ChargeSchema, isChargeContent } from "../types";
import { chargeTemplate, getChargeTemplate } from "../templates";
import { getWalletDetails } from "../utils";
import { Coinbase } from "@coinbase/coinbase-sdk";

const url = "https://api.commerce.coinbase.com/charges";
interface ChargeRequest {
    name: string;
    description: string;
    pricing_type: string;
    local_price: {
        amount: string;
        currency: string;
    };
}

export async function createCharge(apiKey: string, params: ChargeRequest) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CC-Api-Key": apiKey,
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error(`Failed to create charge: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error creating charge:", error);
        throw error;
    }
}

// Function to fetch all charges
export async function getAllCharges(apiKey: string) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CC-Api-Key": apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch all charges: ${response.statusText}`
            );
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching charges:", error);
        throw error;
    }
}

// Function to fetch details of a specific charge
export async function getChargeDetails(apiKey: string, chargeId: string) {
    const getUrl = `${url}${chargeId}`;

    try {
        const response = await fetch(getUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CC-Api-Key": apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch charge details: ${response.statusText}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(
            `Error fetching charge details for ID ${chargeId}:`,
            error
        );
        throw error;
    }
}

export const createCoinbaseChargeAction: Action = {
    name: "CREATE_CHARGE",
    similes: [
        "MAKE_CHARGE",
        "INITIATE_CHARGE",
        "GENERATE_CHARGE",
        "CREATE_TRANSACTION",
        "COINBASE_CHARGE",
        "GENERATE_INVOICE",
        "CREATE_PAYMENT",
        "SETUP_BILLING",
        "REQUEST_PAYMENT",
        "CREATE_CHECKOUT",
        "GET_CHARGE_STATUS",
        "LIST_CHARGES",
    ],
    description: "Create and manage payment charges using Coinbase Commerce. Supports fixed and dynamic pricing, multiple currencies (USD, EUR, USDC), and provides charge status tracking and management features.",
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        const coinbaseCommerceKeyOk = !!runtime.getSetting(
            "COINBASE_COMMERCE_KEY"
        );

        // Ensure Coinbase Commerce API key is available
        return coinbaseCommerceKeyOk;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Composing state for message:", message);
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        const context = composeContext({
            state,
            template: chargeTemplate,
        });

        const chargeDetails = await generateObjectV2({
            runtime,
            context,
            modelClass: ModelClass.LARGE,
            schema: ChargeSchema,
        });
        if (!isChargeContent(chargeDetails.object)) {
            throw new Error("Invalid content");
        }
        const charge = chargeDetails.object as ChargeContent;
        if (!charge || !charge.price || !charge.type) {
            callback(
                {
                    text: "Invalid charge details provided.",
                },
                []
            );
            return;
        }

        elizaLogger.log("Charge details received:", chargeDetails);

        // Initialize Coinbase Commerce client

        try {
            // Create a charge
            const chargeResponse = await createCharge(
                runtime.getSetting("COINBASE_COMMERCE_KEY"),
                {
                    local_price: {
                        amount: charge.price.toString(),
                        currency: charge.currency,
                    },
                    pricing_type: charge.type,
                    name: charge.name,
                    description: charge.description,
                }
            );

            elizaLogger.log(
                "Coinbase Commerce charge created:",
                chargeResponse
            );

            callback(
                {
                    text: `Charge created successfully: ${chargeResponse.hosted_url}`,
                    attachments: [
                        {
                            id: crypto.randomUUID(),
                            url: chargeResponse.id,
                            title: "Coinbase Commerce Charge",
                            description: `Charge ID: ${chargeResponse.id}`,
                            text: `Pay here: ${chargeResponse.hosted_url}`,
                            source: "coinbase",
                        },
                    ],
                },
                []
            );
        } catch (error) {
            elizaLogger.error(
                "Error creating Coinbase Commerce charge:",
                error
            );
            callback(
                {
                    text: "Failed to create a charge. Please try again.",
                },
                []
            );
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create a charge for $100 USD for Digital Art NFT with description 'Exclusive digital artwork collection'",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Charge created successfully:\n- Amount: $100 USD\n- Name: Digital Art NFT\n- Description: Exclusive digital artwork collection\n- Type: fixed_price\n- Charge URL: https://commerce.coinbase.com/charges/...",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Set up a dynamic price charge for Premium Membership named 'VIP Access Pass'",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Charge created successfully:\n- Type: dynamic_price\n- Name: VIP Access Pass\n- Description: Premium Membership\n- Charge URL: https://commerce.coinbase.com/charges/...",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Generate a payment request for 50 EUR for Workshop Registration",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Charge created successfully:\n- Amount: 50 EUR\n- Name: Workshop Registration\n- Type: fixed_price\n- Charge URL: https://commerce.coinbase.com/charges/...",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create an invoice for 1000 USDC for Consulting Services",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Charge created successfully:\n- Amount: 1000 USDC\n- Name: Consulting Services\n- Type: fixed_price\n- Charge URL: https://commerce.coinbase.com/charges/...",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Check the status of charge abc-123-def",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Charge details retrieved:\n- ID: abc-123-def\n- Status: COMPLETED\n- Amount: 100 USD\n- Created: 2024-01-20T10:00:00Z\n- Expires: 2024-01-21T10:00:00Z",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "List all active charges",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Active charges retrieved:\n1. ID: abc-123 - $100 USD - Digital Art NFT\n2. ID: def-456 - 50 EUR - Workshop\n3. ID: ghi-789 - 1000 USDC - Consulting\n\nTotal active charges: 3",
                },
            },
        ],
    ],
} as Action;

export const getAllChargesAction: Action = {
    name: "GET_ALL_CHARGES",
    similes: ["FETCH_ALL_CHARGES", "RETRIEVE_ALL_CHARGES", "LIST_ALL_CHARGES"],
    description: "Fetch all charges using Coinbase Commerce.",
    validate: async (runtime: IAgentRuntime) => {
        const coinbaseCommerceKeyOk = !!runtime.getSetting(
            "COINBASE_COMMERCE_KEY"
        );

        // Ensure Coinbase Commerce API key is available
        return coinbaseCommerceKeyOk;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        try {
            elizaLogger.log("Composing state for message:", message);
            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }
            const charges = await getAllCharges(
                runtime.getSetting("COINBASE_COMMERCE_KEY")
            );

            elizaLogger.log("Fetched all charges:", charges);

            callback(
                {
                    text: `Successfully fetched all charges. Total charges: ${charges.length}`,
                },
                []
            );
        } catch (error) {
            elizaLogger.error("Error fetching all charges:", error);
            callback(
                {
                    text: "Failed to fetch all charges. Please try again.",
                },
                []
            );
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Fetch all charges" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Successfully fetched all charges.",
                    action: "GET_ALL_CHARGES",
                },
            },
        ],
    ],
} as Action;

export const getChargeDetailsAction: Action = {
    name: "GET_CHARGE_DETAILS",
    similes: ["FETCH_CHARGE_DETAILS", "RETRIEVE_CHARGE_DETAILS", "GET_CHARGE"],
    description: "Fetch details of a specific charge using Coinbase Commerce.",
    validate: async (runtime: IAgentRuntime) => {
        const coinbaseCommerceKeyOk = !!runtime.getSetting(
            "COINBASE_COMMERCE_KEY"
        );

        // Ensure Coinbase Commerce API key is available
        return coinbaseCommerceKeyOk;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Composing state for message:", message);
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        const context = composeContext({
            state,
            template: getChargeTemplate,
        });
        const chargeDetails = await generateObjectV2({
            runtime,
            context,
            modelClass: ModelClass.LARGE,
            schema: ChargeSchema,
        });
        if (!isChargeContent(chargeDetails.object)) {
            throw new Error("Invalid content");
        }
        const charge = chargeDetails.object as ChargeContent;
        if (!charge.id) {
            callback(
                {
                    text: "Missing charge ID. Please provide a valid charge ID.",
                },
                []
            );
            return;
        }

        try {
            const chargeDetails = await getChargeDetails(
                runtime.getSetting("COINBASE_COMMERCE_KEY"),
                charge.id
            );

            elizaLogger.log("Fetched charge details:", chargeDetails);

            callback(
                {
                    text: `Successfully fetched charge details for ID: ${charge.id}`,
                    attachments: [
                        {
                            id: crypto.randomUUID(),
                            url: chargeDetails.hosted_url,
                            title: `Charge Details for ${charge.id}`,
                            description: `Details: ${JSON.stringify(chargeDetails, null, 2)}`,
                            source: "coinbase",
                            text: "",
                        },
                    ],
                },
                []
            );
        } catch (error) {
            elizaLogger.error(
                `Error fetching details for charge ID ${charge.id}:`,
                error
            );
            callback(
                {
                    text: `Failed to fetch details for charge ID: ${charge.id}. Please try again.`,
                },
                []
            );
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Fetch details of charge ID: 123456",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Successfully fetched charge details. {{charge.id}} for {{charge.amount}} {{charge.currency}} to {{charge.name}} for {{charge.description}}",
                    action: "GET_CHARGE_DETAILS",
                },
            },
        ],
    ],
};

export const chargeProvider: Provider = {
    get: async (runtime: IAgentRuntime, _message: Memory) => {
        const charges = await getAllCharges(
            runtime.getSetting("COINBASE_COMMERCE_KEY")
        );
        // Ensure API key is available
        const coinbaseAPIKey =
            runtime.getSetting("COINBASE_API_KEY") ??
            process.env.COINBASE_API_KEY;
        const coinbasePrivateKey =
            runtime.getSetting("COINBASE_PRIVATE_KEY") ??
            process.env.COINBASE_PRIVATE_KEY;
        const balances = [];
        const transactions = [];
        if (coinbaseAPIKey && coinbasePrivateKey) {
            Coinbase.configure({
                apiKeyName: coinbaseAPIKey,
                privateKey: coinbasePrivateKey,
            });
            const { balances, transactions } = await getWalletDetails(runtime);
            elizaLogger.log("Current Balances:", balances);
            elizaLogger.log("Last Transactions:", transactions);
        }
        const formattedCharges = charges.map(charge => ({
            id: charge.id,
            name: charge.name,
            description: charge.description,
            pricing: charge.pricing,
        }));
        elizaLogger.log("Charges:", formattedCharges);
        return { charges: formattedCharges, balances, transactions };
    },
};

export const coinbaseCommercePlugin: Plugin = {
    name: "coinbaseCommerce",
    description:
        "Integration with Coinbase Commerce for creating and managing charges.",
    actions: [
        createCoinbaseChargeAction,
        getAllChargesAction,
        getChargeDetailsAction,
    ],
    evaluators: [],
    providers: [chargeProvider],
};



---
File: /src/plugins/massPayments.ts
---

import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import {
    composeContext,
    elizaLogger,
    generateObjectV2,
    ModelClass,
    Action,
    IAgentRuntime,
    Memory,
    Provider,
    State,
    HandlerCallback,
    Plugin,
} from "@ai16z/eliza";
import {
    TransferSchema,
    isTransferContent,
    TransferContent,
    Transaction,
} from "../types";
import { transferTemplate } from "../templates";
import { readFile } from "fs/promises";
import { parse } from "csv-parse/sync";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createArrayCsvWriter } from "csv-writer";
import {
    appendTransactionsToCsv,
    executeTransfer,
    getCharityAddress,
    getWalletDetails,
    initializeWallet,
} from "../utils";

// Dynamically resolve the file path to the src/plugins directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, "../../plugin-coinbase/src/plugins");
const csvFilePath = path.join(baseDir, "transactions.csv");

export const massPayoutProvider: Provider = {
    get: async (runtime: IAgentRuntime, _message: Memory) => {
        try {
            Coinbase.configure({
                apiKeyName:
                    runtime.getSetting("COINBASE_API_KEY") ??
                    process.env.COINBASE_API_KEY,
                privateKey:
                    runtime.getSetting("COINBASE_PRIVATE_KEY") ??
                    process.env.COINBASE_PRIVATE_KEY,
            });
            elizaLogger.log("Reading CSV file from:", csvFilePath);

            // Ensure the CSV file exists
            if (!fs.existsSync(csvFilePath)) {
                elizaLogger.warn("CSV file not found. Creating a new one.");
                const csvWriter = createArrayCsvWriter({
                    path: csvFilePath,
                    header: [
                        "Address",
                        "Amount",
                        "Status",
                        "Error Code",
                        "Transaction URL",
                    ],
                });
                await csvWriter.writeRecords([]); // Create an empty file with headers
                elizaLogger.log("New CSV file created with headers.");
            }

            // Read and parse the CSV file
            const csvData = await readFile(csvFilePath, "utf-8");
            const records = parse(csvData, {
                columns: true,
                skip_empty_lines: true,
            });

            const { balances, transactions } = await getWalletDetails(runtime);

            elizaLogger.log("Parsed CSV records:", records);
            elizaLogger.log("Current Balances:", balances);
            elizaLogger.log("Last Transactions:", transactions);

            return {
                currentTransactions: records.map((record: any) => ({
                    address: record["Address"] || undefined,
                    amount: parseFloat(record["Amount"]) || undefined,
                    status: record["Status"] || undefined,
                    errorCode: record["Error Code"] || "",
                    transactionUrl: record["Transaction URL"] || "",
                })),
                balances,
                transactionHistory: transactions,
            };
        } catch (error) {
            elizaLogger.error("Error in massPayoutProvider:", error);
            return { csvRecords: [], balances: [], transactions: [] };
        }
    },
};

async function executeMassPayout(
    runtime: IAgentRuntime,
    networkId: string,
    receivingAddresses: string[],
    transferAmount: number,
    assetId: string
): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    const assetIdLowercase = assetId.toLowerCase();
    let sendingWallet: Wallet;
    try {
        sendingWallet = await initializeWallet(runtime, networkId);
    } catch (error) {
        elizaLogger.error("Error initializing sending wallet:", error);
        throw error;
    }
    for (const address of receivingAddresses) {
        elizaLogger.log("Processing payout for address:", address);
            if (address) {
                try {
                    // Check balance before initiating transfer

                    const walletBalance =
                        await sendingWallet.getBalance(assetIdLowercase);

                    elizaLogger.log("Wallet balance for asset:", {
                        assetId,
                        walletBalance,
                    });

                    if (walletBalance.lessThan(transferAmount)) {
                        const insufficientFunds = `Insufficient funds for address ${sendingWallet.getDefaultAddress()} to send to ${address}. Required: ${transferAmount}, Available: ${walletBalance}`;
                        elizaLogger.error(insufficientFunds);

                        transactions.push({
                            address,
                            amount: transferAmount,
                            status: "Failed",
                            errorCode: insufficientFunds,
                            transactionUrl: null,
                        });
                        continue;
                    }

                    // Execute the transfer
                    const transfer = await executeTransfer(
                        sendingWallet,
                        transferAmount,
                        assetIdLowercase,
                        address
                    );

                    transactions.push({
                        address,
                        amount: transfer.getAmount().toNumber(),
                        status: "Success",
                        errorCode: null,
                        transactionUrl: transfer.getTransactionLink(),
                    });
                } catch (error) {
                    elizaLogger.error(
                        "Error during transfer for address:",
                        address,
                        error
                    );
                    transactions.push({
                        address,
                        amount: transferAmount,
                        status: "Failed",
                        errorCode: error?.code || "Unknown Error",
                        transactionUrl: null,
                    });
                }
            } else {
                elizaLogger.log("Skipping invalid or empty address.");
                transactions.push({
                    address: "Invalid or Empty",
                    amount: transferAmount,
                    status: "Failed",
                    errorCode: "Invalid Address",
                    transactionUrl: null,
                });
            }
        }
        // Send 1% to charity
        const charityAddress = getCharityAddress(networkId);

        try {
            const charityTransfer = await executeTransfer(sendingWallet, transferAmount * 0.01, assetId, charityAddress);

            transactions.push({
            address: charityAddress,
            amount: charityTransfer.getAmount().toNumber(),
            status: "Success",
            errorCode: null,
                transactionUrl: charityTransfer.getTransactionLink(),
            });
        } catch (error) {
            elizaLogger.error("Error during charity transfer:", error);
            transactions.push({
                address: charityAddress,
                amount: transferAmount * 0.01,
                status: "Failed",
                errorCode: error?.message || "Unknown Error",
                transactionUrl: null,
            });
        }
        await appendTransactionsToCsv(transactions);
        elizaLogger.log("Finished processing mass payouts.");
    return transactions;
}

// Action for sending mass payouts
export const sendMassPayoutAction: Action = {
    name: "SEND_MASS_PAYOUT",
    similes: ["BULK_TRANSFER", "DISTRIBUTE_FUNDS", "SEND_PAYMENTS"],
    description:
        "Sends mass payouts to a list of receiving addresses using a predefined sending wallet and logs all transactions to a CSV file.",
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.log("Validating runtime and message...");
        return (
            !!(
                runtime.character.settings.secrets?.COINBASE_API_KEY ||
                process.env.COINBASE_API_KEY
            ) &&
            !!(
                runtime.character.settings.secrets?.COINBASE_PRIVATE_KEY ||
                process.env.COINBASE_PRIVATE_KEY
            )
        );
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Starting SEND_MASS_PAYOUT handler...");
        try {
            Coinbase.configure({
                apiKeyName:
                    runtime.getSetting("COINBASE_API_KEY") ??
                    process.env.COINBASE_API_KEY,
                privateKey:
                    runtime.getSetting("COINBASE_PRIVATE_KEY") ??
                    process.env.COINBASE_PRIVATE_KEY,
            });
            if (!state) {
                state = (await runtime.composeState(message, {
                    providers: [massPayoutProvider],
                })) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }

            const context = composeContext({
                state,
                template: transferTemplate,
            });

            const transferDetails = await generateObjectV2({
                runtime,
                context,
                modelClass: ModelClass.LARGE,
                schema: TransferSchema,
            });

            elizaLogger.log(
                "Transfer details generated:",
                transferDetails.object
            );

            if (!isTransferContent(transferDetails.object)) {
                callback(
                    {
                        text: "Invalid transfer details. Please check the inputs.",
                    },
                    []
                );
                return;
            }

            const { receivingAddresses, transferAmount, assetId, network } =
                transferDetails.object as TransferContent;

            const allowedNetworks = Object.values(Coinbase.networks);

            if (
                !network ||
                !allowedNetworks.includes(network.toLowerCase() as any) ||
                !receivingAddresses?.length ||
                transferAmount <= 0 ||
                !assetId
            ) {
                elizaLogger.error("Missing or invalid input parameters:", {
                    network,
                    receivingAddresses,
                    transferAmount,
                    assetId,
                });
                callback(
                    {
                        text: `Invalid input parameters. Please ensure:
- Network is one of: ${allowedNetworks.join(", ")}.
- Receiving addresses are provided.
- Transfer amount is greater than zero.
- Asset ID is valid.`,
                    },
                    []
                );
                return;
            }

            elizaLogger.log("◎ Starting mass payout...");
            const transactions = await executeMassPayout(
                runtime,
                network,
                receivingAddresses,
                transferAmount,
                assetId
            );

            const successTransactions = transactions.filter(
                (tx) => tx.status === "Success"
            );
            const failedTransactions = transactions.filter(
                (tx) => tx.status === "Failed"
            );
            const successDetails = successTransactions
                .map(
                    (tx) =>
                        `Address: ${tx.address}, Amount: ${tx.amount}, Transaction URL: ${
                            tx.transactionUrl || "N/A"
                        }`
                )
                .join("\n");
            const failedDetails = failedTransactions
                .map(
                    (tx) =>
                        `Address: ${tx.address}, Amount: ${tx.amount}, Error Code: ${
                            tx.errorCode || "Unknown Error"
                        }`
                )
                .join("\n");
            const charityTransactions = transactions.filter(
                (tx) => tx.address === getCharityAddress(network)
            );
            const charityDetails = charityTransactions
                .map(
                    (tx) =>
                        `Address: ${tx.address}, Amount: ${tx.amount}, Transaction URL: ${
                            tx.transactionUrl || "N/A"
                        }`
                )
                .join("\n");
            callback(
                {
                    text: `Mass payouts completed successfully.
- Successful Transactions: ${successTransactions.length}
- Failed Transactions: ${failedTransactions.length}

Details:
${successTransactions.length > 0 ? `✅ Successful Transactions:\n${successDetails}` : "No successful transactions."}
${failedTransactions.length > 0 ? `❌ Failed Transactions:\n${failedDetails}` : "No failed transactions."}
${charityTransactions.length > 0 ? `✅ Charity Transactions:\n${charityDetails}` : "No charity transactions."}

Check the CSV file for full details.`,
                },
                []
            );
        } catch (error) {
            elizaLogger.error("Error during mass payouts:", error);
            callback(
                { text: "Failed to complete payouts. Please try again." },
                []
            );
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Distribute 0.0001 ETH on base to 0xA0ba2ACB5846A54834173fB0DD9444F756810f06 and 0xF14F2c49aa90BaFA223EE074C1C33b59891826bF",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Mass payouts completed successfully.
- Successful Transactions: {{2}}
- Failed Transactions: {{1}}

Details:
✅ Successful Transactions:
Address: 0xABC123..., Amount: 0.005, Transaction URL: https://etherscan.io/tx/...
Address: 0xDEF456..., Amount: 0.005, Transaction URL: https://etherscan.io/tx/...

❌ Failed Transactions:
Address: 0xGHI789..., Amount: 0.005, Error Code: Insufficient Funds

Check the CSV file for full details.`,
                    action: "SEND_MASS_PAYOUT",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Airdrop 10 USDC to these community members: 0x789..., 0x101... on base network",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Mass payout completed successfully:\n- Airdropped 10 USDC to 2 addresses on base network\n- Successful Transactions: 2\n- Failed Transactions: 0\nCheck the CSV file for transaction details.",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Multi-send 0.25 ETH to team wallets: 0x222..., 0x333... on Ethereum",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Mass payout completed successfully:\n- Multi-sent 0.25 ETH to 2 addresses on Ethereum network\n- Successful Transactions: 2\n- Failed Transactions: 0\nCheck the CSV file for transaction details.",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Distribute rewards of 5 SOL each to contest winners: winner1.sol, winner2.sol on Solana",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Mass payout completed successfully:\n- Distributed 5 SOL to 2 addresses on Solana network\n- Successful Transactions: 2\n- Failed Transactions: 0\nCheck the CSV file for transaction details.",
                },
            },
        ],
    ],
};

export const coinbaseMassPaymentsPlugin: Plugin = {
    name: "automatedPayments",
    description:
        "Processes mass payouts using Coinbase SDK and logs all transactions (success and failure) to a CSV file. Provides dynamic transaction data through a provider.",
    actions: [sendMassPayoutAction],
    providers: [massPayoutProvider],
};



---
File: /src/plugins/tokenContract.ts
---

import { Coinbase, readContract, SmartContract } from "@coinbase/coinbase-sdk";
import {
    Action,
    Plugin,
    elizaLogger,
    IAgentRuntime,
    Memory,
    HandlerCallback,
    State,
    composeContext,
    generateObjectV2,
    ModelClass,
} from "@ai16z/eliza";
import { initializeWallet } from "../utils";
import {
    contractInvocationTemplate,
    tokenContractTemplate,
    readContractTemplate,
} from "../templates";
import {
    ContractInvocationSchema,
    TokenContractSchema,
    isContractInvocationContent,
    isTokenContractContent,
    ReadContractSchema,
    isReadContractContent,
} from "../types";
import path from "path";
import { fileURLToPath } from "url";
import { createArrayCsvWriter } from "csv-writer";
import fs from "fs";
import { ABI } from "../constants";

// Dynamically resolve the file path to the src/plugins directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, "../../plugin-coinbase/src/plugins");
const contractsCsvFilePath = path.join(baseDir, "contracts.csv");

// Add this helper at the top level
const serializeBigInt = (value: any): any => {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    if (Array.isArray(value)) {
        return value.map(serializeBigInt);
    }
    if (typeof value === 'object' && value !== null) {
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, serializeBigInt(v)])
        );
    }
    return value;
};

export const deployTokenContractAction: Action = {
    name: "DEPLOY_TOKEN_CONTRACT",
    description:
        "Deploy an ERC20, ERC721, or ERC1155 token contract using the Coinbase SDK",
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.log("Validating runtime for DEPLOY_TOKEN_CONTRACT...");
        return (
            !!(
                runtime.character.settings.secrets?.COINBASE_API_KEY ||
                process.env.COINBASE_API_KEY
            ) &&
            !!(
                runtime.character.settings.secrets?.COINBASE_PRIVATE_KEY ||
                process.env.COINBASE_PRIVATE_KEY
            )
        );
    },
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Starting DEPLOY_TOKEN_CONTRACT handler...");

        try {
            Coinbase.configure({
                apiKeyName:
                    runtime.getSetting("COINBASE_API_KEY") ??
                    process.env.COINBASE_API_KEY,
                privateKey:
                    runtime.getSetting("COINBASE_PRIVATE_KEY") ??
                    process.env.COINBASE_PRIVATE_KEY,
            });

            // Ensure CSV file exists
            if (!fs.existsSync(contractsCsvFilePath)) {
                const csvWriter = createArrayCsvWriter({
                    path: contractsCsvFilePath,
                    header: [
                        "Contract Type",
                        "Name",
                        "Symbol",
                        "Network",
                        "Contract Address",
                        "Transaction URL",
                        "Base URI",
                        "Total Supply",
                    ],
                });
                await csvWriter.writeRecords([]);
            }

            const context = composeContext({
                state,
                template: tokenContractTemplate,
            });

            const contractDetails = await generateObjectV2({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
                schema: TokenContractSchema,
            });
            elizaLogger.log("Contract details:", contractDetails.object);

            if (!isTokenContractContent(contractDetails.object)) {
                callback(
                    {
                        text: "Invalid contract details. Please check the inputs.",
                    },
                    []
                );
                return;
            }

            const {
                contractType,
                name,
                symbol,
                network,
                baseURI,
                totalSupply,
            } = contractDetails.object;
            elizaLogger.log("Contract details:", contractDetails.object);
            const wallet = await initializeWallet(runtime, network);
            let contract: SmartContract;
            let deploymentDetails;

            switch (contractType.toLowerCase()) {
                case "erc20":
                    contract = await wallet.deployToken({
                        name,
                        symbol,
                        totalSupply: totalSupply || 1000000,
                    });
                    deploymentDetails = {
                        contractType: "ERC20",
                        totalSupply,
                        baseURI: "N/A",
                    };
                    break;

                case "erc721":
                    contract = await wallet.deployNFT({
                        name,
                        symbol,
                        baseURI: baseURI || "",
                    });
                    deploymentDetails = {
                        contractType: "ERC721",
                        totalSupply: "N/A",
                        baseURI,
                    };
                    break;
                default:
                    throw new Error(
                        `Unsupported contract type: ${contractType}`
                    );
            }

            // Wait for deployment to complete
            await contract.wait();
            elizaLogger.log("Deployment details:", deploymentDetails);
            elizaLogger.log("Contract deployed successfully:", contract);
            // Log deployment to CSV
            const csvWriter = createArrayCsvWriter({
                path: contractsCsvFilePath,
                header: [
                    "Contract Type",
                    "Name",
                    "Symbol",
                    "Network",
                    "Contract Address",
                    "Transaction URL",
                    "Base URI",
                    "Total Supply",
                ],
                append: true,
            });
            const transaction =
                contract.getTransaction()?.getTransactionLink() || "";
            const contractAddress = contract.getContractAddress();
            await csvWriter.writeRecords([
                [
                    deploymentDetails.contractType,
                    name,
                    symbol,
                    network,
                    contractAddress,
                    transaction,
                    deploymentDetails.baseURI,
                    deploymentDetails.totalSupply || "",
                ],
            ]);

            callback(
                {
                    text: `Token contract deployed successfully:
- Type: ${deploymentDetails.contractType}
- Name: ${name}
- Symbol: ${symbol}
- Network: ${network}
- Contract Address: ${contractAddress}
- Transaction URL: ${transaction}
${deploymentDetails.baseURI !== "N/A" ? `- Base URI: ${deploymentDetails.baseURI}` : ""}
${deploymentDetails.totalSupply !== "N/A" ? `- Total Supply: ${deploymentDetails.totalSupply}` : ""}

Contract deployment has been logged to the CSV file.`,
                },
                []
            );
        } catch (error) {
            elizaLogger.error("Error deploying token contract:", error);
            callback(
                {
                    text: "Failed to deploy token contract. Please check the logs for more details.",
                },
                []
            );
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Deploy an ERC721 token named 'MyNFT' with symbol 'MNFT' on base network with URI 'https://pbs.twimg.com/profile_images/1848823420336934913/oI0-xNGe_400x400.jpg'",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Token contract deployed successfully:
- Type: ERC20
- Name: MyToken
- Symbol: MTK
- Network: base
- Contract Address: 0x...
- Transaction URL: https://basescan.org/tx/...
- Total Supply: 1000000`,
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "Deploy an ERC721 token named 'MyNFT' with symbol 'MNFT' on the base network",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Token contract deployed successfully:
- Type: ERC721
- Name: MyNFT
- Symbol: MNFT
- Network: base
- Contract Address: 0x...
- Transaction URL: https://basescan.org/tx/...
- URI: https://pbs.twimg.com/profile_images/1848823420336934913/oI0-xNGe_400x400.jpg`,
                },
            },
        ],
    ],
    similes: ["DEPLOY_CONTRACT", "CREATE_TOKEN", "MINT_TOKEN", "CREATE_NFT"],
};

// Add to tokenContract.ts
export const invokeContractAction: Action = {
    name: "INVOKE_CONTRACT",
    description:
        "Invoke a method on a deployed smart contract using the Coinbase SDK",
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.log("Validating runtime for INVOKE_CONTRACT...");
        return (
            !!(
                runtime.character.settings.secrets?.COINBASE_API_KEY ||
                process.env.COINBASE_API_KEY
            ) &&
            !!(
                runtime.character.settings.secrets?.COINBASE_PRIVATE_KEY ||
                process.env.COINBASE_PRIVATE_KEY
            )
        );
    },
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Starting INVOKE_CONTRACT handler...");

        try {
            Coinbase.configure({
                apiKeyName:
                    runtime.getSetting("COINBASE_API_KEY") ??
                    process.env.COINBASE_API_KEY,
                privateKey:
                    runtime.getSetting("COINBASE_PRIVATE_KEY") ??
                    process.env.COINBASE_PRIVATE_KEY,
            });

            const context = composeContext({
                state,
                template: contractInvocationTemplate,
            });

            const invocationDetails = await generateObjectV2({
                runtime,
                context,
                modelClass: ModelClass.LARGE,
                schema: ContractInvocationSchema,
            });
            elizaLogger.log("Invocation details:", invocationDetails.object);
            if (!isContractInvocationContent(invocationDetails.object)) {
                callback(
                    {
                        text: "Invalid contract invocation details. Please check the inputs.",
                    },
                    []
                );
                return;
            }

            const { contractAddress, method, args, amount, assetId, networkId } =
                invocationDetails.object;
            const wallet = await initializeWallet(runtime, networkId);

            // Prepare invocation options
            const invocationOptions = {
                contractAddress,
                method,
                abi: ABI,
                args: {
                    ...args,
                    amount: args.amount || amount // Ensure amount is passed in args
                },
                networkId,
                assetId
            };
            elizaLogger.log("Invocation options:", invocationOptions);
            // Invoke the contract
            const invocation = await wallet.invokeContract(invocationOptions);

            // Wait for the transaction to be mined
            await invocation.wait();

            // Log the invocation to CSV
            const csvWriter = createArrayCsvWriter({
                path: contractsCsvFilePath,
                header: [
                    "Contract Address",
                    "Method",
                    "Network",
                    "Status",
                    "Transaction URL",
                    "Amount",
                    "Asset ID",
                ],
                append: true,
            });

            await csvWriter.writeRecords([
                [
                    contractAddress,
                    method,
                    networkId,
                    invocation.getStatus(),
                    invocation.getTransactionLink() || "",
                    amount || "",
                    assetId || "",
                ],
            ]);

            callback(
                {
                    text: `Contract method invoked successfully:
- Contract Address: ${contractAddress}
- Method: ${method}
- Network: ${networkId}
- Status: ${invocation.getStatus()}
- Transaction URL: ${invocation.getTransactionLink() || "N/A"}
${amount ? `- Amount: ${amount}` : ""}
${assetId ? `- Asset ID: ${assetId}` : ""}

Contract invocation has been logged to the CSV file.`,
                },
                []
            );
        } catch (error) {
            elizaLogger.error("Error invoking contract method:", error);
            callback(
                {
                    text: "Failed to invoke contract method. Please check the logs for more details.",
                },
                []
            );
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Call the 'transfer' method on my ERC20 token contract at 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 with amount 100 to recepient 0xbcF7C64B880FA89a015970dC104E848d485f99A3",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Contract method invoked successfully:
- Contract Address: 0x123...
- Method: transfer
- Network: base
- Status: SUCCESS
- Transaction URL: https://basescan.org/tx/...
- Amount: 100
- Asset ID: wei

Contract invocation has been logged to the CSV file.`,
                },
            },
        ],
    ],
    similes: ["CALL_CONTRACT", "EXECUTE_CONTRACT", "INTERACT_WITH_CONTRACT"],
};

export const readContractAction: Action = {
    name: "READ_CONTRACT",
    description: "Read data from a deployed smart contract using the Coinbase SDK",
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.log("Validating runtime for READ_CONTRACT...");
        return !!(
            runtime.character.settings.secrets?.COINBASE_API_KEY ||
            process.env.COINBASE_API_KEY
        ) && !!(
            runtime.character.settings.secrets?.COINBASE_PRIVATE_KEY ||
            process.env.COINBASE_PRIVATE_KEY
        );
    },
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Starting READ_CONTRACT handler...");

        try {
            Coinbase.configure({
                apiKeyName: runtime.getSetting("COINBASE_API_KEY") ?? process.env.COINBASE_API_KEY,
                privateKey: runtime.getSetting("COINBASE_PRIVATE_KEY") ?? process.env.COINBASE_PRIVATE_KEY,
            });

            const context = composeContext({
                state,
                template: readContractTemplate,
            });

            const readDetails = await generateObjectV2({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
                schema: ReadContractSchema,
            });

            if (!isReadContractContent(readDetails.object)) {
                callback(
                    {
                        text: "Invalid contract read details. Please check the inputs.",
                    },
                    []
                );
                return;
            }

            const { contractAddress, method, args, networkId, abi } = readDetails.object;
            elizaLogger.log("Reading contract:", { contractAddress, method, args, networkId, abi });

            const result = await readContract({
                networkId,
                contractAddress,
                method,
                args,
                abi: ABI as any,
            });

            // Serialize the result before using it
            const serializedResult = serializeBigInt(result);

            elizaLogger.info("Contract read result:", serializedResult);

            callback({
                text: `Contract read successful:
- Contract Address: ${contractAddress}
- Method: ${method}
- Network: ${networkId}
- Result: ${JSON.stringify(serializedResult, null, 2)}`
            }, []);

        } catch (error) {
            elizaLogger.error("Error reading contract:", error);
            callback({
                text: `Failed to read contract: ${error instanceof Error ? error.message : "Unknown error"}`
            }, []);
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Read the balance of address 0xbcF7C64B880FA89a015970dC104E848d485f99A3 from the ERC20 contract at 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 on eth",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Contract read successful:
- Contract Address: 0x37f2131ebbc8f97717edc3456879ef56b9f4b97b
- Method: balanceOf
- Network: eth
- Result: "1000000"`,
                },
            },
        ],
    ],
    similes: ["READ_CONTRACT", "GET_CONTRACT_DATA", "QUERY_CONTRACT"],
};

export const tokenContractPlugin: Plugin = {
    name: "tokenContract",
    description: "Enables deployment, invocation, and reading of ERC20, ERC721, and ERC1155 token contracts using the Coinbase SDK",
    actions: [deployTokenContractAction, invokeContractAction, readContractAction],
};



---
File: /src/plugins/trade.ts
---

import { Coinbase} from "@coinbase/coinbase-sdk";
import {
    Action,
    Plugin,
    elizaLogger,
    IAgentRuntime,
    Memory,
    HandlerCallback,
    State,
    composeContext,
    generateObjectV2,
    ModelClass,
    Provider,
} from "@ai16z/eliza";
import { executeTradeAndCharityTransfer, getWalletDetails } from "../utils";
import { tradeTemplate } from "../templates";
import { isTradeContent, TradeContent, TradeSchema } from "../types";
import { readFile } from "fs/promises";
import { parse } from "csv-parse/sync";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createArrayCsvWriter } from "csv-writer";

// Dynamically resolve the file path to the src/plugins directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, "../../plugin-coinbase/src/plugins");
const tradeCsvFilePath = path.join(baseDir, "trades.csv");

export const tradeProvider: Provider = {
    get: async (runtime: IAgentRuntime, _message: Memory) => {
        try {
            Coinbase.configure({
                apiKeyName:
                    runtime.getSetting("COINBASE_API_KEY") ??
                    process.env.COINBASE_API_KEY,
                privateKey:
                    runtime.getSetting("COINBASE_PRIVATE_KEY") ??
                    process.env.COINBASE_PRIVATE_KEY,
            });
            elizaLogger.log("Reading CSV file from:", tradeCsvFilePath);

            // Check if the file exists; if not, create it with headers
            if (!fs.existsSync(tradeCsvFilePath)) {
                elizaLogger.warn("CSV file not found. Creating a new one.");
                const csvWriter = createArrayCsvWriter({
                    path: tradeCsvFilePath,
                    header: [
                        "Network",
                        "From Amount",
                        "Source Asset",
                        "To Amount",
                        "Target Asset",
                        "Status",
                        "Transaction URL",
                    ],
                });
                await csvWriter.writeRecords([]); // Create an empty file with headers
                elizaLogger.log("New CSV file created with headers.");
            }

            // Read and parse the CSV file
            const csvData = await readFile(tradeCsvFilePath, "utf-8");
            const records = parse(csvData, {
                columns: true,
                skip_empty_lines: true,
            });

            elizaLogger.log("Parsed CSV records:", records);
            const { balances, transactions } = await getWalletDetails(runtime);
            elizaLogger.log("Current Balances:", balances);
            elizaLogger.log("Last Transactions:", transactions);
            return {
                currentTrades: records.map((record: any) => ({
                    network: record["Network"] || undefined,
                    amount: parseFloat(record["From Amount"]) || undefined,
                    sourceAsset: record["Source Asset"] || undefined,
                    toAmount: parseFloat(record["To Amount"]) || undefined,
                    targetAsset: record["Target Asset"] || undefined,
                    status: record["Status"] || undefined,
                    transactionUrl: record["Transaction URL"] || "",
                })),
                balances,
                transactions,
            };
        } catch (error) {
            elizaLogger.error("Error in tradeProvider:", error);
            return [];
        }
    },
};

export const executeTradeAction: Action = {
    name: "EXECUTE_TRADE",
    description:
        "Execute a trade between two assets using the Coinbase SDK and log the result.",
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.log("Validating runtime for EXECUTE_TRADE...");
        return (
            !!(
                runtime.character.settings.secrets?.COINBASE_API_KEY ||
                process.env.COINBASE_API_KEY
            ) &&
            !!(
                runtime.character.settings.secrets?.COINBASE_PRIVATE_KEY ||
                process.env.COINBASE_PRIVATE_KEY
            )
        );
    },
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Starting EXECUTE_TRADE handler...");

        try {
            Coinbase.configure({
                apiKeyName:
                    runtime.getSetting("COINBASE_API_KEY") ??
                    process.env.COINBASE_API_KEY,
                privateKey:
                    runtime.getSetting("COINBASE_PRIVATE_KEY") ??
                    process.env.COINBASE_PRIVATE_KEY,
            });

            const context = composeContext({
                state,
                template: tradeTemplate,
            });

            const tradeDetails = await generateObjectV2({
                runtime,
                context,
                modelClass: ModelClass.LARGE,
                schema: TradeSchema,
            });

            if (!isTradeContent(tradeDetails.object)) {
                callback(
                    {
                        text: "Invalid trade details. Ensure network, amount, source asset, and target asset are correctly specified.",
                    },
                    []
                );
                return;
            }

            const { network, amount, sourceAsset, targetAsset } =
                tradeDetails.object as TradeContent;

            const allowedNetworks = ["base", "sol", "eth", "arb", "pol"];
            if (!allowedNetworks.includes(network)) {
                callback(
                    {
                        text: `Invalid network. Supported networks are: ${allowedNetworks.join(
                            ", "
                        )}.`,
                    },
                    []
                );
                return;
            }

            const { trade, transfer } = await executeTradeAndCharityTransfer(runtime, network, amount, sourceAsset, targetAsset);

            let responseText = `Trade executed successfully:
- Network: ${network}
- Amount: ${trade.getFromAmount()}
- From: ${sourceAsset}
- To: ${targetAsset}
- Transaction URL: ${trade.getTransaction().getTransactionLink() || ""}
- Charity Transaction URL: ${transfer.getTransactionLink() || ""}`;

            if (transfer) {
                responseText += `\n- Charity Amount: ${transfer.getAmount()}`;
            } else {
                responseText += "\n(Note: Charity transfer was not completed)";
            }

            callback(
                { text: responseText },
                []
            );
        } catch (error) {
            elizaLogger.error("Error during trade execution:", error);
            callback(
                {
                    text: "Failed to execute the trade. Please check the logs for more details.",
                },
                []
            );
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Swap 1 ETH for USDC on base network",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Trade executed successfully:\n- Swapped 1 ETH for USDC on base network\n- Transaction URL: https://basescan.io/tx/...\n- Status: Completed",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Convert 1000 USDC to SOL on Solana",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Trade executed successfully:\n- Converted 1000 USDC to SOL on Solana network\n- Transaction URL: https://solscan.io/tx/...\n- Status: Completed",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Exchange 5 WETH for ETH on Arbitrum",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Trade executed successfully:\n- Exchanged 5 WETH for ETH on Arbitrum network\n- Transaction URL: https://arbiscan.io/tx/...\n- Status: Completed",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Trade 100 GWEI for USDC on Polygon",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Trade executed successfully:\n- Traded 100 GWEI for USDC on Polygon network\n- Transaction URL: https://polygonscan.com/tx/...\n- Status: Completed",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Market buy ETH with 500 USDC on base",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Trade executed successfully:\n- Bought ETH with 500 USDC on base network\n- Transaction URL: https://basescan.io/tx/...\n- Status: Completed",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Sell 2.5 SOL for USDC on Solana mainnet",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Trade executed successfully:\n- Sold 2.5 SOL for USDC on Solana network\n- Transaction URL: https://solscan.io/tx/...\n- Status: Completed",
                },
            },
        ],
    ],
    similes: [
        "EXECUTE_TRADE",         // Primary action name
        "SWAP_TOKENS",          // For token swaps
        "CONVERT_CURRENCY",     // For currency conversion
        "EXCHANGE_ASSETS",      // For asset exchange
        "MARKET_BUY",          // For buying assets
        "MARKET_SELL",         // For selling assets
        "TRADE_CRYPTO",        // Generic crypto trading
    ],
};

export const tradePlugin: Plugin = {
    name: "tradePlugin",
    description: "Enables asset trading using the Coinbase SDK.",
    actions: [executeTradeAction],
    providers: [tradeProvider],
};



---
File: /src/plugins/webhooks.ts
---

import { Coinbase, Webhook } from "@coinbase/coinbase-sdk";
import {
    Action,
    Plugin,
    elizaLogger,
    IAgentRuntime,
    Memory,
    HandlerCallback,
    State,
    composeContext,
    generateObjectV2,
    ModelClass,
    Provider,
} from "@ai16z/eliza";
import { WebhookSchema, isWebhookContent, WebhookContent } from "../types";
import { webhookTemplate } from "../templates";
import { appendWebhooksToCsv } from "../utils";

export const webhookProvider: Provider = {
    get: async (runtime: IAgentRuntime, _message: Memory) => {
        try {
            Coinbase.configure({
                apiKeyName:
                    runtime.getSetting("COINBASE_API_KEY") ??
                    process.env.COINBASE_API_KEY,
                privateKey:
                    runtime.getSetting("COINBASE_PRIVATE_KEY") ??
                    process.env.COINBASE_PRIVATE_KEY,
            });

            // List all webhooks
            const resp = await Webhook.list();
            elizaLogger.log("Listing all webhooks:", resp.data);

            return {
                webhooks: resp.data.map((webhook: Webhook) => ({
                    id: webhook.getId(),
                    networkId: webhook.getNetworkId(),
                    eventType: webhook.getEventType(),
                    eventFilters: webhook.getEventFilters(),
                    eventTypeFilter: webhook.getEventTypeFilter(),
                    notificationURI: webhook.getNotificationURI(),
                })),
            };
        } catch (error) {
            elizaLogger.error("Error in webhookProvider:", error);
            return [];
        }
    },
};

export const createWebhookAction: Action = {
    name: "CREATE_WEBHOOK",
    description: "Create a new webhook using the Coinbase SDK.",
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.log("Validating runtime for CREATE_WEBHOOK...");
        return (
            !!(
                runtime.character.settings.secrets?.COINBASE_API_KEY ||
                process.env.COINBASE_API_KEY
            ) &&
            !!(
                runtime.character.settings.secrets?.COINBASE_PRIVATE_KEY ||
                process.env.COINBASE_PRIVATE_KEY
            ) &&
            !!(
                runtime.character.settings.secrets?.COINBASE_NOTIFICATION_URI ||
                process.env.COINBASE_NOTIFICATION_URI
            )
        );
    },
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Starting CREATE_WEBHOOK handler...");

        try {
            Coinbase.configure({
                apiKeyName:
                    runtime.getSetting("COINBASE_API_KEY") ??
                    process.env.COINBASE_API_KEY,
                privateKey:
                    runtime.getSetting("COINBASE_PRIVATE_KEY") ??
                    process.env.COINBASE_PRIVATE_KEY,
            });

            const context = composeContext({
                state,
                template: webhookTemplate,
            });

            const webhookDetails = await generateObjectV2({
                runtime,
                context,
                modelClass: ModelClass.LARGE,
                schema: WebhookSchema,
            });

            if (!isWebhookContent(webhookDetails.object)) {
                callback(
                    {
                        text: "Invalid webhook details. Ensure network, URL, event type, and contract address are correctly specified.",
                    },
                    []
                );
                return;
            }

            const { networkId, eventType, eventFilters, eventTypeFilter } = webhookDetails.object as WebhookContent;
            const notificationUri = runtime.getSetting("COINBASE_NOTIFICATION_URI") ?? process.env.COINBASE_NOTIFICATION_URI;

            if (!notificationUri) {
                callback(
                    {
                        text: "Notification URI is not set in the environment variables.",
                    },
                    []
                );
                return;
            }
            elizaLogger.log("Creating webhook with details:", {networkId, notificationUri, eventType, eventTypeFilter, eventFilters});
            const webhook = await Webhook.create({networkId, notificationUri, eventType, eventFilters});
            elizaLogger.log("Webhook created successfully:", webhook.toString());
            callback(
                {
                    text: `Webhook created successfully: ${webhook.toString()}`,
                },
                []
            );
            await appendWebhooksToCsv([webhook]);
            elizaLogger.log("Webhook appended to CSV successfully");
        } catch (error) {
            elizaLogger.error("Error during webhook creation:", error);
            callback(
                {
                    text: "Failed to create the webhook. Please check the logs for more details.",
                },
                []
            );
        }
    },
    similes: ["WEBHOOK", "NOTIFICATION", "EVENT", "TRIGGER", "LISTENER"],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create a webhook on base for address 0xbcF7C64B880FA89a015970dC104E848d485f99A3 on the event type: transfers",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Webhook created successfully: Webhook ID: {{webhookId}}, Network ID: {{networkId}}, Notification URI: {{notificationUri}}, Event Type: {{eventType}}`,
                    action: "CREATE_WEBHOOK",
                },
            },
        ],
    ]
};

export const webhookPlugin: Plugin = {
    name: "webhookPlugin",
    description: "Manages webhooks using the Coinbase SDK.",
    actions: [createWebhookAction],
    providers: [webhookProvider],
};


---
File: /src/constants.ts
---

export const ABI = [
    {
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "string",
                internalType: "string"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                name: "spender",
                type: "address",
                internalType: "address"
            },
            {
                name: "amount",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        name: "approve",
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                name: "from",
                type: "address",
                internalType: "address"
            },
            {
                name: "to",
                type: "address",
                internalType: "address"
            },
            {
                name: "amount",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        name: "transferFrom",
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [
            {
                name: "",
                type: "uint8",
                internalType: "uint8"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                name: "account",
                type: "address",
                internalType: "address"
            }
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [
            {
                name: "",
                type: "string",
                internalType: "string"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                name: "to",
                type: "address",
                internalType: "address"
            },
            {
                name: "amount",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        name: "transfer",
        outputs: [
            {
                name: "",
                type: "bool",
                internalType: "bool"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                name: "owner",
                type: "address",
                internalType: "address"
            },
            {
                name: "spender",
                type: "address",
                internalType: "address"
            }
        ],
        name: "allowance",
        outputs: [
            {
                name: "",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                indexed: true,
                name: "owner",
                type: "address",
                internalType: "address"
            },
            {
                indexed: true,
                name: "spender",
                type: "address",
                internalType: "address"
            },
            {
                indexed: false,
                name: "value",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        name: "Approval",
        type: "event",
        anonymous: false
    },
    {
        inputs: [
            {
                indexed: true,
                name: "from",
                type: "address",
                internalType: "address"
            },
            {
                indexed: true,
                name: "to",
                type: "address",
                internalType: "address"
            },
            {
                indexed: false,
                name: "value",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        name: "Transfer",
        type: "event",
        anonymous: false
    }
];


---
File: /src/index.ts
---

import { coinbaseMassPaymentsPlugin } from "./plugins/massPayments";
import { coinbaseCommercePlugin } from "./plugins/commerce";
import { tradePlugin } from "./plugins/trade";
import { tokenContractPlugin } from "./plugins/tokenContract";
import { webhookPlugin } from "./plugins/webhooks";
import { advancedTradePlugin } from "./plugins/advancedTrade";

export const plugins = {
    coinbaseMassPaymentsPlugin,
    coinbaseCommercePlugin,
    tradePlugin,
    tokenContractPlugin,
    webhookPlugin,
    advancedTradePlugin,
};

export * from "./plugins/massPayments";
export * from "./plugins/commerce";
export * from "./plugins/trade";
export * from "./plugins/tokenContract";
export * from "./plugins/webhooks";
export * from "./plugins/advancedTrade";



---
File: /src/templates.ts
---

export const chargeTemplate = `
Extract the following details to create a Coinbase charge:
- **price** (number): The amount for the charge (e.g., 100.00).
- **currency** (string): The 3-letter ISO 4217 currency code (e.g., USD, EUR).
- **type** (string): The pricing type for the charge (e.g., fixed_price, dynamic_price). Assume price type is fixed unless otherwise stated
- **name** (string): A non-empty name for the charge (e.g., "The Human Fund").
- **description** (string): A non-empty description of the charge (e.g., "Money For People").

Provide the values in the following JSON format:

\`\`\`json
{
    "price": <number>,
    "currency": "<currency>",
    "type": "<type>",
    "name": "<name>",
    "description": "<description>"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const getChargeTemplate = `
Extract the details for a Coinbase charge using the provided charge ID:
- **charge_id** (string): The unique identifier of the charge (e.g., "2b364ef7-ad60-4fcd-958b-e550a3c47dc6").

Provide the charge details in the following JSON format after retrieving the charge details:

\`\`\`json
{
    "charge_id": "<charge_id>",
    "price": <number>,
    "currency": "<currency>",
    "type": "<type>",
    "name": "<name>",
    "description": "<description>",
    "status": "<status>",
    "created_at": "<ISO8601 timestamp>",
    "expires_at": "<ISO8601 timestamp>"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const transferTemplate = `
Extract the following details for processing a mass payout using the Coinbase SDK:
- **receivingAddresses** (array): A list of wallet addresses receiving the funds.
- **transferAmount** (number): The amount to transfer to each address.
- **assetId** (string): The asset ID to transfer (e.g., ETH, BTC).
- **network** (string): The blockchain network to use. Allowed values are:
    static networks: {
        readonly BaseSepolia: "base-sepolia";
        readonly BaseMainnet: "base-mainnet";
        readonly EthereumHolesky: "ethereum-holesky";
        readonly EthereumMainnet: "ethereum-mainnet";
        readonly PolygonMainnet: "polygon-mainnet";
        readonly SolanaDevnet: "solana-devnet";
        readonly SolanaMainnet: "solana-mainnet";
        readonly ArbitrumMainnet: "arbitrum-mainnet";
    };

Provide the details in the following JSON format:

\`\`\`json
{
    "receivingAddresses": ["<receiving_address_1>", "<receiving_address_2>"],
    "transferAmount": <amount>,
    "assetId": "<asset_id>",
    "network": "<network>"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const tradeTemplate = `
Extract the following details for processing a trade using the Coinbase SDK:
- **network** (string): The blockchain network to use (e.g., base, sol, eth, arb, pol).
- **amount** (number): The amount to trade.
- **sourceAsset** (string): The asset ID to trade from (must be one of: ETH, SOL, USDC, WETH, GWEI, LAMPORT).
- **targetAsset** (string): The asset ID to trade to (must be one of: ETH, SOL, USDC, WETH, GWEI, LAMPORT).
- **side** (string): The side of the trade (must be either "BUY" or "SELL").

Ensure that:
1. **network** is one of the supported networks: "base", "sol", "eth", "arb", or "pol".
2. **sourceAsset** and **targetAsset** are valid assets from the provided list.
3. **amount** is a positive number.
4. **side** is either "BUY" or "SELL".

Provide the details in the following JSON format:

\`\`\`json
{
    "network": "<network>",
    "amount": <amount>,
    "sourceAsset": "<source_asset_id>",
    "targetAsset": "<target_asset_id>",
    "side": "<side>"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const advancedTradeTemplate = `
Extract the following details for processing an advanced trade using the Coinbase Advanced Trading API:
- **productId** (string): The trading pair ID (e.g., "BTC-USD", "ETH-USD", "SOL-USD")
- **side** (string): The side of the trade (must be either "BUY" or "SELL")
- **amount** (number): The amount to trade
- **orderType** (string): The type of order (must be either "MARKET" or "LIMIT")
- **limitPrice** (number, optional): The limit price for limit orders

Ensure that:
1. **productId** follows the format "ASSET-USD" (e.g., "BTC-USD")
2. **side** is either "BUY" or "SELL"
3. **amount** is a positive number
4. **orderType** is either "MARKET" or "LIMIT"
5. **limitPrice** is provided when orderType is "LIMIT"

Provide the details in the following JSON format:

\`\`\`json
{
    "productId": "<product_id>",
    "side": "<side>",
    "amount": <amount>,
    "orderType": "<order_type>",
    "limitPrice": <limit_price>
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;


export const tokenContractTemplate = `
Extract the following details for deploying a token contract using the Coinbase SDK:
- **contractType** (string): The type of token contract to deploy (ERC20, ERC721, or ERC1155)
- **name** (string): The name of the token
- **symbol** (string): The symbol of the token
- **network** (string): The blockchain network to deploy on (e.g., base, eth, arb, pol)
- **baseURI** (string, optional): The base URI for token metadata (required for ERC721 and ERC1155)
- **totalSupply** (number, optional): The total supply of tokens (only for ERC20)

Provide the details in the following JSON format:

\`\`\`json
{
    "contractType": "<contract_type>",
    "name": "<token_name>",
    "symbol": "<token_symbol>",
    "network": "<network>",
    "baseURI": "<base_uri>",
    "totalSupply": <total_supply>
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

// Add to templates.ts
export const contractInvocationTemplate = `
Extract the following details for invoking a smart contract using the Coinbase SDK:
- **contractAddress** (string): The address of the contract to invoke
- **method** (string): The method to invoke on the contract
- **abi** (array): The ABI of the contract
- **args** (object, optional): The arguments to pass to the contract method
- **amount** (string, optional): The amount of the asset to send (as string to handle large numbers)
- **assetId** (string, required): The ID of the asset to send (e.g., 'USDC')
- **networkId** (string, required): The network ID to use in format "chain-network".
 static networks: {
        readonly BaseSepolia: "base-sepolia";
        readonly BaseMainnet: "base-mainnet";
        readonly EthereumHolesky: "ethereum-holesky";
        readonly EthereumMainnet: "ethereum-mainnet";
        readonly PolygonMainnet: "polygon-mainnet";
        readonly SolanaDevnet: "solana-devnet";
        readonly SolanaMainnet: "solana-mainnet";
        readonly ArbitrumMainnet: "arbitrum-mainnet";
    };

Provide the details in the following JSON format:

\`\`\`json
{
    "contractAddress": "<contract_address>",
    "method": "<method_name>",
    "abi": [<contract_abi>],
    "args": {
        "<arg_name>": "<arg_value>"
    },
    "amount": "<amount_as_string>",
    "assetId": "<asset_id>",
    "networkId": "<network_id>"
}
\`\`\`

Example for invoking a transfer method on the USDC contract:

\`\`\`json
{
    "contractAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "method": "transfer",
    "abi": [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "to",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],
    "args": {
        "to": "0xbcF7C64B880FA89a015970dC104E848d485f99A3",
        "amount": "1000000" // 1 USDC (6 decimals)
    },
    "networkId": "ethereum-mainnet",
    "assetId": "USDC"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const webhookTemplate = `
Extract the following details for creating a webhook:
- **networkId** (string): The network ID for which the webhook is created.
Allowed values are:
    static networks: {
        readonly BaseSepolia: "base-sepolia";
        readonly BaseMainnet: "base-mainnet";
        readonly EthereumHolesky: "ethereum-holesky";
        readonly EthereumMainnet: "ethereum-mainnet";
        readonly PolygonMainnet: "polygon-mainnet";
        readonly SolanaDevnet: "solana-devnet";
        readonly SolanaMainnet: "solana-mainnet";
        readonly ArbitrumMainnet: "arbitrum-mainnet";
    };
- **eventType** (string): The type of event for the webhook.
export declare const WebhookEventType: {
    readonly Unspecified: "unspecified";
    readonly Erc20Transfer: "erc20_transfer";
    readonly Erc721Transfer: "erc721_transfer";
    readonly WalletActivity: "wallet_activity";
};
- **eventTypeFilter** (string, optional): Filter for wallet activity event type.
export interface WebhookEventTypeFilter {
    /**
     * A list of wallet addresses to filter on.
     * @type {Array<string>}
     * @memberof WebhookWalletActivityFilter
     */
    'addresses'?: Array<string>;
    /**
     * The ID of the wallet that owns the webhook.
     * @type {string}
     * @memberof WebhookWalletActivityFilter
     */
    'wallet_id'?: string;
}
- **eventFilters** (array, optional): Filters applied to the events that determine which specific events trigger the webhook.
export interface Array<WebhookEventFilter> {
    /**
     * The onchain contract address of the token for which the events should be tracked.
     * @type {string}
     * @memberof WebhookEventFilter
     */
    'contract_address'?: string;
    /**
     * The onchain address of the sender. Set this filter to track all transfer events originating from your address.
     * @type {string}
     * @memberof WebhookEventFilter
     */
    'from_address'?: string;
    /**
     * The onchain address of the receiver. Set this filter to track all transfer events sent to your address.
     * @type {string}
     * @memberof WebhookEventFilter
     */
    'to_address'?: string;
}
Provide the details in the following JSON format:
\`\`\`json
{
    "networkId": "<networkId>",
    "eventType": "<eventType>",
    "eventTypeFilter": "<eventTypeFilter>",
    "eventFilters": [<eventFilter1>, <eventFilter2>]
}
\`\`\`



Example for creating a webhook on the Sepolia testnet for ERC20 transfers originating from a specific wallet 0x1234567890123456789012345678901234567890 on transfers from 0xbcF7C64B880FA89a015970dC104E848d485f99A3

\`\`\`javascript

    networkId: 'base-sepolia', // Listening on sepolia testnet transactions
    eventType: 'erc20_transfer',
    eventTypeFilter: {
      addresses: ['0x1234567890123456789012345678901234567890']
    },
    eventFilters: [{
      from_address: '0xbcF7C64B880FA89a015970dC104E848d485f99A3',
    }],
});
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;

export const readContractTemplate = `
Extract the following details for reading from a smart contract using the Coinbase SDK:
- **contractAddress** (string): The address of the contract to read from (must start with 0x)
- **method** (string): The view/pure method to call on the contract
- **networkId** (string): The network ID based on networks configured in Coinbase SDK
Allowed values are:
    static networks: {
        readonly BaseSepolia: "base-sepolia";
        readonly BaseMainnet: "base-mainnet";
        readonly EthereumHolesky: "ethereum-holesky";
        readonly EthereumMainnet: "ethereum-mainnet";
        readonly PolygonMainnet: "polygon-mainnet";
        readonly SolanaDevnet: "solana-devnet";
        readonly SolanaMainnet: "solana-mainnet";
        readonly ArbitrumMainnet: "arbitrum-mainnet";
    };
- **args** (object): The arguments to pass to the contract method
- **abi** (array, optional): The contract ABI if needed for complex interactions

Provide the details in the following JSON format:

\`\`\`json
{
    "contractAddress": "<0x-prefixed-address>",
    "method": "<method_name>",
    "networkId": "<network_id>",
    "args": {
        "<arg_name>": "<arg_value>"
    },
    "abi": [
        // Optional ABI array
    ]
}
\`\`\`

Example for reading the balance of an ERC20 token:

\`\`\`json
{
    "contractAddress": "0x37f2131ebbc8f97717edc3456879ef56b9f4b97b",
    "method": "balanceOf",
    "networkId": "eth-mainnet",
    "args": {
        "account": "0xbcF7C64B880FA89a015970dC104E848d485f99A3"
    }
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;


---
File: /src/types.ts
---

import { Coinbase } from "@coinbase/coinbase-sdk";
import { z } from "zod";
import { WebhookEventType, WebhookEventFilter, WebhookEventTypeFilter } from "@coinbase/coinbase-sdk/dist/client";

export const ChargeSchema = z.object({
    id: z.string().nullable(),
    price: z.number(),
    type: z.string(),
    currency: z.string().min(3).max(3),
    name: z.string().min(1),
    description: z.string().min(1),
});

export interface ChargeContent {
    id: string | null;
    price: number;
    type: string;
    currency: string; // Currency code (e.g., USD)
    name: string; // Name of the charge
    description: string; // Description of the charge
}

export const isChargeContent = (object: any): object is ChargeContent => {
    if (ChargeSchema.safeParse(object).success) {
        return true;
    }
    console.error("Invalid content: ", object);
    return false;
};

export const TransferSchema = z.object({
    network: z.string().toLowerCase(),
    receivingAddresses: z.array(z.string()),
    transferAmount: z.number(),
    assetId: z.string().toLowerCase(),
});

export interface TransferContent {
    network: string;
    receivingAddresses: string[];
    transferAmount: number;
    assetId: string;
}

export const isTransferContent = (object: any): object is TransferContent => {
    return TransferSchema.safeParse(object).success;
};

export type Transaction = {
    address: string;
    amount: number;
    status: string;
    errorCode: string | null;
    transactionUrl: string | null;
};
const assetValues = Object.values(Coinbase.assets) as [string, ...string[]];
export const TradeSchema = z.object({
    network: z.string().toLowerCase(),
    amount: z.number(),
    sourceAsset: z.enum(assetValues),
    targetAsset: z.enum(assetValues),
    side: z.enum(["BUY", "SELL"]),
});

export interface TradeContent {
    network: string;
    amount: number;
    sourceAsset: string;
    targetAsset: string;
    side: "BUY" | "SELL";

}

export const isTradeContent = (object: any): object is TradeContent => {
    return TradeSchema.safeParse(object).success;
};

export type TradeTransaction = {
    network: string;
    amount: number;
    sourceAsset: string;
    targetAsset: string;
    status: string;
    errorCode: string | null;
    transactionUrl: string | null;
};

export interface TokenContractContent {
    contractType: "ERC20" | "ERC721" | "ERC1155";
    name: string;
    symbol: string;
    network: string;
    baseURI?: string;
    totalSupply?: number;
}

export const TokenContractSchema = z.object({
    contractType: z.enum(["ERC20", "ERC721", "ERC1155"]).describe("The type of token contract to deploy"),
    name: z.string().describe("The name of the token"),
    symbol: z.string().describe("The symbol of the token"),
    network: z.string().describe("The blockchain network to deploy on"),
    baseURI: z.string().optional().describe("The base URI for token metadata (required for ERC721 and ERC1155)"),
    totalSupply: z.number().optional().describe("The total supply of tokens (only for ERC20)"),
}).refine(data => {
    if (data.contractType === "ERC20") {
        return typeof data.totalSupply === "number" || data.totalSupply === undefined;
    }
    if (["ERC721", "ERC1155"].includes(data.contractType)) {
        return typeof data.baseURI === "string" || data.baseURI === undefined;
    }
    return true;
}, {
    message: "Invalid token contract content",
    path: ["contractType"],
});

export const isTokenContractContent = (obj: any): obj is TokenContractContent => {
    return TokenContractSchema.safeParse(obj).success;
};

// Add to types.ts
export interface ContractInvocationContent {
    contractAddress: string;
    method: string;
    abi: any[];
    args?: Record<string, any>;
    amount?: string;
    assetId: string;
    networkId: string;
}

export const ContractInvocationSchema = z.object({
    contractAddress: z.string().describe("The address of the contract to invoke"),
    method: z.string().describe("The method to invoke on the contract"),
    abi: z.array(z.any()).describe("The ABI of the contract"),
    args: z.record(z.string(), z.any()).optional().describe("The arguments to pass to the contract method"),
    amount: z.string().optional().describe("The amount of the asset to send (as string to handle large numbers)"),
    assetId: z.string().describe("The ID of the asset to send (e.g., 'USDC')"),
    networkId: z.string().describe("The network ID to use (e.g., 'ethereum-mainnet')")
});

export const isContractInvocationContent = (obj: any): obj is ContractInvocationContent => {
    return ContractInvocationSchema.safeParse(obj).success;
};


export const WebhookSchema = z.object({
    networkId: z.string(),
    eventType: z.nativeEnum(WebhookEventType),
    eventTypeFilter:z.custom<WebhookEventTypeFilter>().optional(),
    eventFilters: z.array(z.custom<WebhookEventFilter>()).optional()
});

export type WebhookContent = z.infer<typeof WebhookSchema>;

export const isWebhookContent = (object: any): object is WebhookContent => {
    return WebhookSchema.safeParse(object).success;
};

export const AdvancedTradeSchema = z.object({
    productId: z.string(),
    side: z.enum(["BUY", "SELL"]),
    amount: z.number(),
    orderType: z.enum(["MARKET", "LIMIT"]),
    limitPrice: z.number().optional(),
});

export interface AdvancedTradeContent {
    productId: string;
    side: "BUY" | "SELL";
    amount: number;
    orderType: "MARKET" | "LIMIT";
    limitPrice?: number;
}

export const isAdvancedTradeContent = (object: any): object is AdvancedTradeContent => {
    return AdvancedTradeSchema.safeParse(object).success;
};

export interface ReadContractContent {
    contractAddress: `0x${string}`;
    method: string;
    networkId: string;
    args: Record<string, any>;
    abi?: any[];
}

export const ReadContractSchema = z.object({
    contractAddress: z.string().describe("The address of the contract to read from"),
    method: z.string().describe("The view/pure method to call on the contract"),
    networkId: z.string().describe("The network ID to use"),
    args: z.record(z.string(), z.any()).describe("The arguments to pass to the contract method"),
    abi: z.array(z.any()).optional().describe("The contract ABI (optional)")
});

export const isReadContractContent = (obj: any): obj is ReadContractContent => {
    return ReadContractSchema.safeParse(obj).success;
};


---
File: /src/utils.ts
---

import { Coinbase, Trade, Transfer, Wallet, WalletData, Webhook } from "@coinbase/coinbase-sdk";
import { elizaLogger, IAgentRuntime } from "@ai16z/eliza";
import fs from "fs";
import path from "path";
import { EthereumTransaction } from "@coinbase/coinbase-sdk/dist/client";
import { fileURLToPath } from "url";
import { createArrayCsvWriter } from "csv-writer";
import { Transaction } from "./types";

// Dynamically resolve the file path to the src/plugins directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, "../../plugin-coinbase/src/plugins");
const tradeCsvFilePath = path.join(baseDir, "trades.csv");
const transactionCsvFilePath = path.join(baseDir, "transactions.csv");
const webhookCsvFilePath = path.join(baseDir, "webhooks.csv");

export async function initializeWallet(
    runtime: IAgentRuntime,
    networkId: string = Coinbase.networks.EthereumMainnet
) {
    let wallet: Wallet;
    const storedSeed =
        runtime.getSetting("COINBASE_GENERATED_WALLET_HEX_SEED") ??
        process.env.COINBASE_GENERATED_WALLET_HEX_SEED;

    const storedWalletId =
        runtime.getSetting("COINBASE_GENERATED_WALLET_ID") ??
        process.env.COINBASE_GENERATED_WALLET_ID;
    if (!storedSeed || !storedWalletId) {
        // No stored seed or wallet ID, creating a new wallet
        wallet = await Wallet.create({ networkId });

        // Export wallet data directly
        const walletData: WalletData = wallet.export();
        const walletAddress = await wallet.getDefaultAddress();
        try {
            const characterFilePath = `characters/${runtime.character.name.toLowerCase()}.character.json`;
            const walletIDSave = await updateCharacterSecrets(
                characterFilePath,
                "COINBASE_GENERATED_WALLET_ID",
                walletData.walletId
            );
            const seedSave = await updateCharacterSecrets(
                characterFilePath,
                "COINBASE_GENERATED_WALLET_HEX_SEED",
                walletData.seed
            );
            if (walletIDSave && seedSave) {
                elizaLogger.log("Successfully updated character secrets.");
            } else {
                const seedFilePath = `characters/${runtime.character.name.toLowerCase()}-seed.txt`;
                elizaLogger.error(
                    `Failed to update character secrets so adding gitignored ${seedFilePath} file please add it your env or character file and delete:`
                );
                // save it to gitignored file
                wallet.saveSeed(seedFilePath);
            }
            elizaLogger.log("Wallet created and stored new wallet:", walletAddress);
        } catch (error) {
            elizaLogger.error("Error updating character secrets:", error);
            throw error;
        }

        // Logging wallet creation
        elizaLogger.log("Created and stored new wallet:", walletAddress);
    } else {
        // Importing existing wallet using stored seed and wallet ID
        // Always defaults to base-mainnet we can't select the network here
        wallet = await Wallet.import({
            seed: storedSeed,
            walletId: storedWalletId,
        });
        const networkId = wallet.getNetworkId();
        elizaLogger.log("Imported existing wallet for network:", networkId);

        // Logging wallet import
        elizaLogger.log(
            "Imported existing wallet:",
            await wallet.getDefaultAddress()
        );
    }

    return wallet;
}

/**
 * Executes a trade and a charity transfer.
 * @param {IAgentRuntime} runtime - The runtime for wallet initialization.
 * @param {string} network - The network to use.
 * @param {number} amount - The amount to trade and transfer.
 * @param {string} sourceAsset - The source asset to trade.
 * @param {string} targetAsset - The target asset to trade.
 */
export async function executeTradeAndCharityTransfer(runtime: IAgentRuntime, network: string, amount: number, sourceAsset: string, targetAsset: string) {
    const wallet = await initializeWallet(runtime, network);

    elizaLogger.log("Wallet initialized:", {
        network,
        address: await wallet.getDefaultAddress(),
    });

    const charityAddress = getCharityAddress(network);
    const charityAmount = charityAddress ? amount * 0.01 : 0;
    const tradeAmount = charityAddress ? amount - charityAmount : amount;
    const assetIdLowercase = sourceAsset.toLowerCase();
    const tradeParams = {
        amount: tradeAmount,
        fromAssetId: assetIdLowercase,
        toAssetId: targetAsset.toLowerCase(),
    };

    let transfer: Transfer;
    if (charityAddress && charityAmount > 0) {
        transfer = await executeTransfer(wallet, charityAmount, assetIdLowercase, charityAddress);
        elizaLogger.log("Charity Transfer successful:", {
            address: charityAddress,
            transactionUrl: transfer.getTransactionLink(),
        });
        await appendTransactionsToCsv([{
            address: charityAddress,
            amount: charityAmount,
            status: "Success",
            errorCode: null,
            transactionUrl: transfer.getTransactionLink(),
        }]);
    }

    const trade: Trade = await wallet.createTrade(tradeParams);
    elizaLogger.log("Trade initiated:", trade.toString());
    await trade.wait();
    elizaLogger.log("Trade completed successfully:", trade.toString());
    await appendTradeToCsv(trade);
    return {
        trade,
        transfer,
    };
}

export async function appendTradeToCsv(trade: Trade) {
    try {
        const csvWriter = createArrayCsvWriter({
            path: tradeCsvFilePath,
            header: [
                "Network",
                "From Amount",
                "Source Asset",
                "To Amount",
                "Target Asset",
                "Status",
                "Transaction URL",
            ],
            append: true,
        });

        const formattedTrade = [
            trade.getNetworkId(),
            trade.getFromAmount(),
            trade.getFromAssetId(),
            trade.getToAmount(),
            trade.getToAssetId(),
            trade.getStatus(),
            trade.getTransaction().getTransactionLink() || "",
        ];

        elizaLogger.log("Writing trade to CSV:", formattedTrade);
        await csvWriter.writeRecords([formattedTrade]);
        elizaLogger.log("Trade written to CSV successfully.");
    } catch (error) {
        elizaLogger.error("Error writing trade to CSV:", error);
    }
}

export async function appendTransactionsToCsv(transactions: Transaction[]) {
    try {
        const csvWriter = createArrayCsvWriter({
            path: transactionCsvFilePath,
            header: [
                "Address",
                "Amount",
                "Status",
                "Error Code",
                "Transaction URL",
            ],
            append: true,
        });

        const formattedTransactions = transactions.map((transaction) => [
            transaction.address,
            transaction.amount.toString(),
            transaction.status,
            transaction.errorCode || "",
            transaction.transactionUrl || "",
        ]);

        elizaLogger.log("Writing transactions to CSV:", formattedTransactions);
        await csvWriter.writeRecords(formattedTransactions);
        elizaLogger.log("All transactions written to CSV successfully.");
    } catch (error) {
        elizaLogger.error("Error writing transactions to CSV:", error);
    }
}
// create a function to append webhooks to a csv
export async function appendWebhooksToCsv(webhooks: Webhook[]) {
    try {
        // Ensure the CSV file exists
        if (!fs.existsSync(webhookCsvFilePath)) {
            elizaLogger.warn("CSV file not found. Creating a new one.");
            const csvWriter = createArrayCsvWriter({
                path: webhookCsvFilePath,
                header: [
                    "Webhook ID",
                    "Network ID",
                    "Event Type",
                    "Event Filters",
                    "Event Type Filter",
                    "Notification URI",
                ],
            });
            await csvWriter.writeRecords([]); // Create an empty file with headers
            elizaLogger.log("New CSV file created with headers.");
                    }
        const csvWriter = createArrayCsvWriter({
            path: webhookCsvFilePath,
            header: [
                "Webhook ID",
                "Network ID",
                "Event Type",
                "Event Filters",
                "Event Type Filter",
                "Notification URI",
            ],
            append: true,
        });

        const formattedWebhooks = webhooks.map((webhook) => [
            webhook.getId(),
            webhook.getNetworkId(),
            webhook.getEventType(),
            JSON.stringify(webhook.getEventFilters()),
            JSON.stringify(webhook.getEventTypeFilter()),
            webhook.getNotificationURI(),
        ]);

        elizaLogger.log("Writing webhooks to CSV:", formattedWebhooks);
        await csvWriter.writeRecords(formattedWebhooks);
        elizaLogger.log("All webhooks written to CSV successfully.");
    } catch (error) {
        elizaLogger.error("Error writing webhooks to CSV:", error);
    }
}

/**
 * Updates a key-value pair in character.settings.secrets.
 * @param {string} characterfilePath - The file path to the character.
 * @param {string} key - The secret key to update or add.
 * @param {string} value - The new value for the secret key.
 */
export async function updateCharacterSecrets(
    characterfilePath: string,
    key: string,
    value: string
): Promise<boolean> {
    try {
        const characterFilePath = path.resolve(
            process.cwd(),
            characterfilePath
        );

        // Check if the character file exists
        if (!fs.existsSync(characterFilePath)) {
            elizaLogger.error("Character file not found:", characterFilePath);
            return false;
        }

        // Read the existing character file
        const characterData = JSON.parse(
            fs.readFileSync(characterFilePath, "utf-8")
        );

        // Ensure settings and secrets exist in the character file
        if (!characterData.settings) {
            characterData.settings = {};
        }
        if (!characterData.settings.secrets) {
            characterData.settings.secrets = {};
        }

        // Update or add the key-value pair
        characterData.settings.secrets[key] = value;

        // Write the updated data back to the file
        fs.writeFileSync(
            characterFilePath,
            JSON.stringify(characterData, null, 2),
            "utf-8"
        );

        console.log(
            `Updated ${key} in character.settings.secrets for ${characterFilePath}.`
        );
    } catch (error) {
        elizaLogger.error("Error updating character secrets:", error);
        return false;
    }
    return true;
}

export const getAssetType = (transaction: EthereumTransaction) => {
    // Check for ETH
    if (transaction.value && transaction.value !== "0") {
        return "ETH";
    }

    // Check for ERC-20 tokens
    if (transaction.token_transfers && transaction.token_transfers.length > 0) {
        return transaction.token_transfers
            .map((transfer) => {
                return transfer.token_id;
            })
            .join(", ");
    }

    return "N/A";
};

/**
 * Fetches and formats wallet balances and recent transactions.
 *
 * @param {IAgentRuntime} runtime - The runtime for wallet initialization.
 * @param {string} networkId - The network ID (optional, defaults to ETH mainnet).
 * @returns {Promise<{balances: Array<{asset: string, amount: string}>, transactions: Array<any>}>} - An object with formatted balances and transactions.
 */
export async function getWalletDetails(
    runtime: IAgentRuntime,
    networkId: string = Coinbase.networks.EthereumMainnet
): Promise<{
    balances: Array<{ asset: string; amount: string }>;
    transactions: Array<{
        timestamp: string;
        amount: string;
        asset: string; // Ensure getAssetType is implemented
        status: string;
        transactionUrl: string;
    }>;
}> {
    try {
        // Initialize the wallet, defaulting to the specified network or ETH mainnet
        const wallet = await initializeWallet(runtime, networkId);

        // Fetch balances
        const balances = await wallet.listBalances();
        const formattedBalances = Array.from(balances, (balance) => ({
            asset: balance[0],
            amount: balance[1].toString(),
        }));

        // Fetch the wallet's recent transactions

        const transactionsData = [];
        const formattedTransactions = transactionsData.map((transaction) => {
            const content = transaction.content();
            return {
                timestamp: content.block_timestamp || "N/A",
                amount: content.value || "N/A",
                asset: getAssetType(content) || "N/A", // Ensure getAssetType is implemented
                status: transaction.getStatus(),
                transactionUrl: transaction.getTransactionLink() || "N/A",
            };
        });

        // Return formatted data
        return {
            balances: formattedBalances,
            transactions: formattedTransactions,
        };
    } catch (error) {
        console.error("Error fetching wallet details:", error);
        throw new Error("Unable to retrieve wallet details.");
    }
}

/**
 * Executes a transfer.
 * @param {Wallet} wallet - The wallet to use.
 * @param {number} amount - The amount to transfer.
 * @param {string} sourceAsset - The source asset to transfer.
 * @param {string} targetAddress - The target address to transfer to.
 */
export async function executeTransferAndCharityTransfer(wallet: Wallet, amount: number, sourceAsset: string, targetAddress: string, network: string) {
    const charityAddress = getCharityAddress(network);
    const charityAmount = charityAddress ? amount * 0.01 : 0;
    const transferAmount = charityAddress ? amount - charityAmount : amount;
    const assetIdLowercase = sourceAsset.toLowerCase();

    let charityTransfer: Transfer;
    if (charityAddress && charityAmount > 0) {
        charityTransfer = await executeTransfer(wallet, charityAmount, assetIdLowercase, charityAddress);
        elizaLogger.log("Charity Transfer successful:", charityTransfer.toString());
    }

    const transferDetails = {
        amount: transferAmount,
        assetId: assetIdLowercase,
        destination: targetAddress,
        gasless: assetIdLowercase === "usdc" ? true : false,
    };
    elizaLogger.log("Initiating transfer:", transferDetails);
    const transfer = await wallet.createTransfer(transferDetails);
    elizaLogger.log("Transfer initiated:", transfer.toString());
    await transfer.wait();

    let responseText = `Transfer executed successfully:
- Amount: ${transfer.getAmount()}
- Asset: ${assetIdLowercase}
- Destination: ${targetAddress}
- Transaction URL: ${transfer.getTransactionLink() || ""}`;

    if (charityTransfer) {
        responseText += `
- Charity Amount: ${charityTransfer.getAmount()}
- Charity Transaction URL: ${charityTransfer.getTransactionLink() || ""}`;
    } else {
        responseText += "\n(Note: Charity transfer was not completed)";
    }

    elizaLogger.log(responseText);

    return {
        transfer,
        charityTransfer,
        responseText,
    }
}

/**
 * Executes a transfer.
 * @param {Wallet} wallet - The wallet to use.
 * @param {number} amount - The amount to transfer.
 * @param {string} sourceAsset - The source asset to transfer.
 * @param {string} targetAddress - The target address to transfer to.
 */
export async function executeTransfer(wallet: Wallet, amount: number, sourceAsset: string, targetAddress: string) {
    const assetIdLowercase = sourceAsset.toLowerCase();
    const transferDetails = {
        amount,
        assetId: assetIdLowercase,
        destination: targetAddress,
        gasless: assetIdLowercase === "usdc" ? true : false,
    };
    elizaLogger.log("Initiating transfer:", transferDetails);
    let transfer: Transfer | undefined;
    try {
        transfer = await wallet.createTransfer(transferDetails);
        elizaLogger.log("Transfer initiated:", transfer.toString());
        await transfer.wait({
        intervalSeconds: 1,
        timeoutSeconds: 20,
        });
    } catch (error) {
        elizaLogger.error("Error executing transfer:", error);
    }
    return transfer;
}

/**
 * Gets the charity address based on the network.
 * For now we are giving to the following charity, but will make this configurable in the future
 * https://www.givedirectly.org/crypto/?_gl=1*va5e6k*_gcl_au*MTM1NDUzNTk5Mi4xNzMzMDczNjA3*_ga*OTIwMDMwNTMwLjE3MzMwNzM2MDg.*_ga_GV8XF9FJ16*MTczMzA3MzYwNy4xLjEuMTczMzA3MzYyMi40NS4wLjA.
 * @param {string} network - The network to use.
 */
export function getCharityAddress(network: string): string | null {
    let charityAddress = null;
    if (network === "base") {
        charityAddress = "0x750EF1D7a0b4Ab1c97B7A623D7917CcEb5ea779C";
    } else if (network === "sol") {
        charityAddress = "pWvDXKu6CpbKKvKQkZvDA66hgsTB6X2AgFxksYogHLV";
    } else if (network === "eth") {
        charityAddress = "0x750EF1D7a0b4Ab1c97B7A623D7917CcEb5ea779C";
    } else {
        return null;
    }
    return charityAddress;
}



---
File: /package.json
---

{
    "name": "@ai16z/plugin-coinbase",
    "version": "0.1.5-alpha.5",
    "main": "dist/index.js",
    "type": "module",
    "types": "dist/index.d.ts",
    "dependencies": {
        "@ai16z/eliza": "workspace:*",
        "coinbase-api": "1.0.5",
        "coinbase-advanced-sdk": "file:../../packages/plugin-coinbase/advanced-sdk-ts",
        "jsonwebtoken": "^9.0.2",
        "@types/jsonwebtoken": "^9.0.7",
        "node-fetch": "^2.6.1"
    },
    "devDependencies": {
        "tsup": "8.3.5",
        "@types/node": "^20.0.0"
    },
    "scripts": {
        "build": "tsup --format esm --dts",
        "dev": "tsup --format esm --dts --watch",
        "lint": "eslint . --fix"
    }
}



---
File: /tsconfig.json
---

{
    "extends": "../core/tsconfig.json",
    "compilerOptions": {
        "outDir": "dist",
        "rootDir": ".",
        "rootDirs": [
            "src",
            "advanced-sdk-ts"
        ],
        "types": [
            "node"
        ]
    },
    "include": [
        "src/**/*.ts",
        "advanced-sdk-ts/src/**/*.ts",
    ]
}


---
File: /tsup.config.ts
---

import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    bundle: true,
    minify: false,
    external: [
        "@coinbase/coinbase-sdk",
        "form-data",
        "combined-stream",
        "axios",
        "util",
        "stream",
        "http",
        "https",
        "events",
        "crypto",
        "buffer",
        "url",
        "zlib",
        "querystring",
        "os",
        "@reflink/reflink",
        "@node-llama-cpp",
        "agentkeepalive",
        "fs/promises",
        "csv-writer",
        "csv-parse/sync",
        "dotenv",
        "coinbase-advanced-sdk",
        "advanced-sdk-ts",
        "jsonwebtoken",
        "whatwg-url"
    ],
    platform: 'node',
    target: 'node18',
    esbuildOptions(options) {
        options.bundle = true;
        options.platform = 'node';
        options.target = 'node18';
    }
});

