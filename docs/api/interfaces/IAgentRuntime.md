[@ai16z/eliza v0.1.5-alpha.5](../index.md) / IAgentRuntime

# Interface: IAgentRuntime

## Properties

### agentId

> **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Properties

#### Defined in

[packages/core/src/types.ts:981](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L981)

***

### serverUrl

> **serverUrl**: `string`

#### Defined in

[packages/core/src/types.ts:982](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L982)

***

### databaseAdapter

> **databaseAdapter**: [`IDatabaseAdapter`](IDatabaseAdapter.md)

#### Defined in

[packages/core/src/types.ts:983](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L983)

***

### token

> **token**: `string`

#### Defined in

[packages/core/src/types.ts:984](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L984)

***

### modelProvider

> **modelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

#### Defined in

[packages/core/src/types.ts:985](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L985)

***

### imageModelProvider

> **imageModelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

#### Defined in

[packages/core/src/types.ts:986](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L986)

***

### character

> **character**: [`Character`](../type-aliases/Character.md)

#### Defined in

[packages/core/src/types.ts:987](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L987)

***

### providers

> **providers**: [`Provider`](Provider.md)[]

#### Defined in

[packages/core/src/types.ts:988](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L988)

***

### actions

> **actions**: [`Action`](Action.md)[]

#### Defined in

[packages/core/src/types.ts:989](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L989)

***

### evaluators

> **evaluators**: [`Evaluator`](Evaluator.md)[]

#### Defined in

[packages/core/src/types.ts:990](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L990)

***

### plugins

> **plugins**: [`Plugin`](../type-aliases/Plugin.md)[]

#### Defined in

[packages/core/src/types.ts:991](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L991)

***

### messageManager

> **messageManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:993](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L993)

***

### descriptionManager

> **descriptionManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:994](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L994)

***

### documentsManager

> **documentsManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:995](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L995)

***

### knowledgeManager

> **knowledgeManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:996](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L996)

***

### loreManager

> **loreManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:997](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L997)

***

### cacheManager

> **cacheManager**: [`ICacheManager`](ICacheManager.md)

#### Defined in

[packages/core/src/types.ts:999](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L999)

***

### services

> **services**: `Map`\<[`ServiceType`](../enumerations/ServiceType.md), [`Service`](../classes/Service.md)\>

#### Defined in

[packages/core/src/types.ts:1001](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1001)

## Methods

### initialize()

> **initialize**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1003](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1003)

***

### registerMemoryManager()

> **registerMemoryManager**(`manager`): `void`

#### Parameters

• **manager**: [`IMemoryManager`](IMemoryManager.md)

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:1005](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1005)

***

### getMemoryManager()

> **getMemoryManager**(`name`): [`IMemoryManager`](IMemoryManager.md)

#### Parameters

• **name**: `string`

#### Returns

[`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1007](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1007)

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

[packages/core/src/types.ts:1009](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1009)

***

### registerService()

> **registerService**(`service`): `void`

#### Parameters

• **service**: [`Service`](../classes/Service.md)

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:1011](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1011)

***

### getSetting()

> **getSetting**(`key`): `string`

#### Parameters

• **key**: `string`

#### Returns

`string`

#### Defined in

[packages/core/src/types.ts:1013](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1013)

***

### getConversationLength()

> **getConversationLength**(): `number`

Methods

#### Returns

`number`

#### Defined in

[packages/core/src/types.ts:1016](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1016)

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

[packages/core/src/types.ts:1018](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1018)

***

### evaluate()

> **evaluate**(`message`, `state`?, `didRespond`?, `callback`?): `Promise`\<`string`[]\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **state?**: [`State`](State.md)

• **didRespond?**: `boolean`

• **callback?**: [`HandlerCallback`](../type-aliases/HandlerCallback.md)

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[packages/core/src/types.ts:1025](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1025)

***

### ensureParticipantExists()

> **ensureParticipantExists**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1032](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1032)

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

[packages/core/src/types.ts:1034](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1034)

***

### registerAction()

> **registerAction**(`action`): `void`

#### Parameters

• **action**: [`Action`](Action.md)

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:1041](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1041)

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

[packages/core/src/types.ts:1043](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1043)

***

### ensureParticipantInRoom()

> **ensureParticipantInRoom**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1051](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1051)

***

### ensureRoomExists()

> **ensureRoomExists**(`roomId`): `Promise`\<`void`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1053](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1053)

***

### composeState()

> **composeState**(`message`, `additionalKeys`?): `Promise`\<[`State`](State.md)\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **additionalKeys?**

#### Returns

`Promise`\<[`State`](State.md)\>

#### Defined in

[packages/core/src/types.ts:1055](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1055)

***

### updateRecentMessageState()

> **updateRecentMessageState**(`state`): `Promise`\<[`State`](State.md)\>

#### Parameters

• **state**: [`State`](State.md)

#### Returns

`Promise`\<[`State`](State.md)\>

#### Defined in

[packages/core/src/types.ts:1060](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1060)
