declare const MEMEABI: readonly [{
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "tokenImpl_";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "tokenImplV2_";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "feeRate_";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "feeReceiver_";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "dexLauncher_";
            readonly type: "address";
        }, {
            readonly internalType: "enum IConfiPumpTypes.DexThreshType";
            readonly name: "defaultDexThreshType_";
            readonly type: "uint8";
        }, {
            readonly internalType: "enum IConfiPumpTypes.CurveType";
            readonly name: "defaultCurveType_";
            readonly type: "uint8";
        }, {
            readonly internalType: "enum IConfiPumpTypes.TokenVersion";
            readonly name: "defaultTokenVersion_";
            readonly type: "uint8";
        }, {
            readonly internalType: "address";
            readonly name: "v2Factory_";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "v2InitCodeHash_";
            readonly type: "bytes32";
        }, {
            readonly internalType: "address";
            readonly name: "weth_";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "creation_fee_";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "lpEth_";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "lpEthTokenCreator_";
            readonly type: "uint256";
        }];
        readonly internalType: "struct ConfiPumpBase.ConfiPumpInitParams";
        readonly name: "params";
        readonly type: "tuple";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "actualAmount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount1";
        readonly type: "uint256";
    }];
    readonly name: "ActualAmountMustLTEAmount";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "AmountTooSmall";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "CallReverted";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "FeatureDisabled";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "GameNotLive";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "GameNotPaused";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "GameNotPending";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "GameNotStarted";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidDEXSupplyThreshold";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "threshold";
        readonly type: "uint256";
    }];
    readonly name: "InvalidDexThreshold";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "enum IConfiPumpTypes.DexThreshType";
        readonly name: "threshold";
        readonly type: "uint8";
    }];
    readonly name: "InvalidDexThresholdType";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidGameSupplyThreshold";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidLocks";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "expected";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "actual";
        readonly type: "uint256";
    }];
    readonly name: "InvalidPiggybackLength";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "InvalidRoundID";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "signer";
        readonly type: "address";
    }];
    readonly name: "InvalidSigner";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "InvalidTokenForBattle";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "enum IConfiPumpTypes.TokenMode";
        readonly name: "mode";
        readonly type: "uint8";
    }];
    readonly name: "InvalidTokenModeForGame";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "enum IConfiPumpTypes.TokenMode";
        readonly name: "from";
        readonly type: "uint8";
    }, {
        readonly internalType: "enum IConfiPumpTypes.TokenMode";
        readonly name: "to";
        readonly type: "uint8";
    }];
    readonly name: "InvalidTokenModeTransition";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LastRoundNotResolved";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "expected";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "actual";
        readonly type: "address";
    }];
    readonly name: "MismatchedAddressInProof";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "srcToken";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "dstToken";
        readonly type: "address";
    }];
    readonly name: "NoConversionPath";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "created";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "max";
        readonly type: "uint256";
    }];
    readonly name: "NoQuotaForCreator";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "collection";
        readonly type: "address";
    }];
    readonly name: "NonPositionNFTReceived";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NotImplemented";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NotRoller";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }];
    readonly name: "NotUniswapV3Pool";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "PermissionlessCreateDisabled";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint160";
        readonly name: "sqrtPriceA";
        readonly type: "uint160";
    }, {
        readonly internalType: "uint160";
        readonly name: "sqrtPriceB";
        readonly type: "uint160";
    }];
    readonly name: "PriceAMustLTPriceB";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ProtocolDisabled";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "requiredToken";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "reserveToken";
        readonly type: "uint256";
    }];
    readonly name: "RequiredTokenMustLTE";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "RoundNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "tokenA";
        readonly type: "address";
    }];
    readonly name: "SameToken";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "seq";
        readonly type: "uint256";
    }];
    readonly name: "SeqNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "actualAmount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "minAmount";
        readonly type: "uint256";
    }];
    readonly name: "SlippageTooHigh";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "StakingDisabled";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "newSupply";
        readonly type: "uint256";
    }];
    readonly name: "SupplyExceedsTotalSupply";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "TokenAlreadyDEXed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "TokenAlreadyInGame";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "TokenInDuel";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "TokenKilled";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "TokenNotDEXed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "TokenNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "TokenNotKilled";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "TokenNotTradable";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "TradeDisabled";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "pool";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "liquidity";
        readonly type: "uint256";
    }];
    readonly name: "UniswapV2PoolNotZero";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "UniswapV3Slot0Failed";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "next";
        readonly type: "uint256";
    }];
    readonly name: "cannotCheckInUntil";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "oldFlags";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "newFlags";
        readonly type: "uint256";
    }];
    readonly name: "BitFlagsChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "user";
        readonly type: "address";
    }];
    readonly name: "CheckedIn";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "newSupply";
        readonly type: "uint256";
    }];
    readonly name: "FlapTokenCirculatingSupplyChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint8";
        readonly name: "version";
        readonly type: "uint8";
    }];
    readonly name: "Initialized";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "pool";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "eth";
        readonly type: "uint256";
    }];
    readonly name: "LaunchedToDEX";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "previousAdminRole";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "newAdminRole";
        readonly type: "bytes32";
    }];
    readonly name: "RoleAdminChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }];
    readonly name: "RoleGranted";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }];
    readonly name: "RoleRevoked";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "ts";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "buyer";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "eth";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "fee";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "postPrice";
        readonly type: "uint256";
    }];
    readonly name: "TokenBought";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "ts";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "creator";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "nonce";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "symbol";
        readonly type: "string";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "meta";
        readonly type: "string";
    }];
    readonly name: "TokenCreated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "curve";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "curveParameter";
        readonly type: "uint256";
    }];
    readonly name: "TokenCurveSet";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "dexSupplyThresh";
        readonly type: "uint256";
    }];
    readonly name: "TokenDexSupplyThreshSet";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "ts";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "srcToken";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "dstToken";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "srcAmount";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "dstAmount";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "who";
        readonly type: "address";
    }];
    readonly name: "TokenRedeemed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "ts";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "seller";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "eth";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "fee";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "postPrice";
        readonly type: "uint256";
    }];
    readonly name: "TokenSold";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "enum IConfiPumpTypes.TokenVersion";
        readonly name: "version";
        readonly type: "uint8";
    }];
    readonly name: "TokenVersionSet";
    readonly type: "event";
}, {
    readonly stateMutability: "nonpayable";
    readonly type: "fallback";
}, {
    readonly inputs: readonly [];
    readonly name: "DEFAULT_ADMIN_ROLE";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "recipient";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "minAmount";
        readonly type: "uint256";
    }, {
        readonly internalType: "bool";
        readonly name: "isCreator";
        readonly type: "bool";
    }];
    readonly name: "buy";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "checkIn";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }];
    readonly name: "getRoleAdmin";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "getToken";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "enum IConfiPumpTypes.TokenStatus";
            readonly name: "status";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint256";
            readonly name: "reserve";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "circulatingSupply";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "price";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "inGame";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "seqInGame";
            readonly type: "uint256";
        }];
        readonly internalType: "struct IConfiPumpTypes.TokenState";
        readonly name: "";
        readonly type: "tuple";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "getTokenEx";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "enum IConfiPumpTypes.TokenStatus";
            readonly name: "status";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint256";
            readonly name: "reserve";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "circulatingSupply";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "price";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "inGame";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "seqInGame";
            readonly type: "uint256";
        }, {
            readonly internalType: "enum IConfiPumpTypes.TokenMode";
            readonly name: "mode";
            readonly type: "uint8";
        }];
        readonly internalType: "struct IConfiPumpTypes.TokenStateEx";
        readonly name: "";
        readonly type: "tuple";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "getTokenV2";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "enum IConfiPumpTypes.TokenStatus";
            readonly name: "status";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint256";
            readonly name: "reserve";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "circulatingSupply";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "price";
            readonly type: "uint256";
        }, {
            readonly internalType: "enum IConfiPumpTypes.TokenVersion";
            readonly name: "tokenVersion";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint256";
            readonly name: "r";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "dexSupplyThresh";
            readonly type: "uint256";
        }];
        readonly internalType: "struct IConfiPumpTypes.TokenStateV2";
        readonly name: "state";
        readonly type: "tuple";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "grantRole";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "hasRole";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "admin";
        readonly type: "address";
    }];
    readonly name: "initialize";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "lastCheckIn";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "symbol";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "meta";
        readonly type: "string";
    }];
    readonly name: "newToken";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "symbol";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "meta";
        readonly type: "string";
    }];
    readonly name: "newTokenNoDuel";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "symbol";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "meta";
        readonly type: "string";
    }, {
        readonly internalType: "enum IConfiPumpTypes.DexThreshType";
        readonly name: "dexTreshType";
        readonly type: "uint8";
    }];
    readonly name: "newTokenWithDexSupplyThresh";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "nonce";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "eth";
        readonly type: "uint256";
    }];
    readonly name: "previewBuy";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "srcToken";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "dstToken";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "srcAmount";
        readonly type: "uint256";
    }];
    readonly name: "previewRedeem";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "dstAmount";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "previewSell";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "eth";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "srcToken";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "dstToken";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "srcAmount";
        readonly type: "uint256";
    }];
    readonly name: "redeem";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "dstAmount";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "renounceRole";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "revokeRole";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "minEth";
        readonly type: "uint256";
    }];
    readonly name: "sell";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "flags";
        readonly type: "uint256";
    }];
    readonly name: "setBitFlags";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "interfaceId";
        readonly type: "bytes4";
    }];
    readonly name: "supportsInterface";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly name: "tokenCreators";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly name: "tokenCreatorsFeeBalance";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
export default MEMEABI;
