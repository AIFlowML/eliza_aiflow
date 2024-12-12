[@ai16z/eliza v0.1.5-alpha.3](../index.md) / IAgentRuntime

# Interface: IAgentRuntime

## Properties

### agentId

> **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Properties

#### Defined in

[packages/core/src/types.ts:997](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L997)

***

### serverUrl

> **serverUrl**: `string`

#### Defined in

[packages/core/src/types.ts:998](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L998)

***

### databaseAdapter

> **databaseAdapter**: [`IDatabaseAdapter`](IDatabaseAdapter.md)

#### Defined in

[packages/core/src/types.ts:999](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L999)

***

### token

> **token**: `string`

#### Defined in

[packages/core/src/types.ts:1000](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1000)

***

### modelProvider

> **modelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

#### Defined in

[packages/core/src/types.ts:1001](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1001)

***

### imageModelProvider

> **imageModelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

#### Defined in

[packages/core/src/types.ts:1002](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1002)

***

### character

> **character**: [`Character`](../type-aliases/Character.md)

#### Defined in

[packages/core/src/types.ts:1003](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1003)

***

### providers

> **providers**: [`Provider`](Provider.md)[]

#### Defined in

[packages/core/src/types.ts:1004](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1004)

***

### actions

> **actions**: [`Action`](Action.md)[]

#### Defined in

[packages/core/src/types.ts:1005](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1005)

***

### evaluators

> **evaluators**: [`Evaluator`](Evaluator.md)[]

#### Defined in

[packages/core/src/types.ts:1006](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1006)

***

### plugins

> **plugins**: [`Plugin`](../type-aliases/Plugin.md)[]

#### Defined in

[packages/core/src/types.ts:1007](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1007)

***

### messageManager

> **messageManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1009](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1009)

***

### descriptionManager

> **descriptionManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1010](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1010)

***

### documentsManager

> **documentsManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1011](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1011)

***

### knowledgeManager

> **knowledgeManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1012](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1012)

***

### loreManager

> **loreManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1013](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1013)

***

### cacheManager

> **cacheManager**: [`ICacheManager`](ICacheManager.md)

#### Defined in

[packages/core/src/types.ts:1015](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1015)

***

### services

> **services**: `Map`\<[`ServiceType`](../enumerations/ServiceType.md), [`Service`](../classes/Service.md)\>

#### Defined in

[packages/core/src/types.ts:1017](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1017)

## Methods

### initialize()

> **initialize**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1019](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1019)

***

### registerMemoryManager()

> **registerMemoryManager**(`manager`): `void`

#### Parameters

• **manager**: [`IMemoryManager`](IMemoryManager.md)

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:1021](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1021)

***

### getMemoryManager()

> **getMemoryManager**(`name`): [`IMemoryManager`](IMemoryManager.md)

#### Parameters

• **name**: `string`

#### Returns

[`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1023](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1023)

***

### getService()

> **getService**\<`T`\>(`service`): `T`

#### Type Parameters

• **T** *extends* [`Service`](../classes/Service.md)

#### Parameters

• **service**: [`ServiceType`](../enumerations/ServiceType.md)

#### Returns

`T`

#### Defined in

[packages/core/src/types.ts:1025](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1025)

***

### registerService()

> **registerService**(`service`): `void`

#### Parameters

• **service**: [`Service`](../classes/Service.md)

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:1027](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1027)

***

### getSetting()

> **getSetting**(`key`): `string`

#### Parameters

• **key**: `string`

#### Returns

`string`

#### Defined in

[packages/core/src/types.ts:1029](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1029)

***

### getConversationLength()

> **getConversationLength**(): `number`

Methods

#### Returns

`number`

#### Defined in

[packages/core/src/types.ts:1032](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1032)

***

### processActions()

> **processActions**(`message`, `responses`, `state`?, `callback`?): `Promise`\<`void`\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **responses**: [`Memory`](Memory.md)[]

• **state?**: [`State`](State.md)

• **callback?**: [`HandlerCallback`](../type-aliases/HandlerCallback.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1034](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1034)

***

### evaluate()

> **evaluate**(`message`, `state`?, `didRespond`?): `Promise`\<`string`[]\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **state?**: [`State`](State.md)

• **didRespond?**: `boolean`

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[packages/core/src/types.ts:1041](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1041)

***

### ensureParticipantExists()

> **ensureParticipantExists**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1047](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1047)

***

### ensureUserExists()

> **ensureUserExists**(`userId`, `userName`, `name`, `source`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userName**: `string`

• **name**: `string`

• **source**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1049](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1049)

***

### registerAction()

> **registerAction**(`action`): `void`

#### Parameters

• **action**: [`Action`](Action.md)

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:1056](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1056)

***

### ensureConnection()

> **ensureConnection**(`userId`, `roomId`, `userName`?, `userScreenName`?, `source`?): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userName?**: `string`

• **userScreenName?**: `string`

• **source?**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1058](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1058)

***

### ensureParticipantInRoom()

> **ensureParticipantInRoom**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1066](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1066)

***

### ensureRoomExists()

> **ensureRoomExists**(`roomId`): `Promise`\<`void`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1068](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1068)

***

### composeState()

> **composeState**(`message`, `additionalKeys`?): `Promise`\<[`State`](State.md)\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **additionalKeys?**

#### Returns

`Promise`\<[`State`](State.md)\>

#### Defined in

[packages/core/src/types.ts:1070](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1070)

***

### updateRecentMessageState()

> **updateRecentMessageState**(`state`): `Promise`\<[`State`](State.md)\>

#### Parameters

• **state**: [`State`](State.md)

#### Returns

`Promise`\<[`State`](State.md)\>

#### Defined in

[packages/core/src/types.ts:1075](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1075)
