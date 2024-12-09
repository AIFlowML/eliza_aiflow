[@ai16z/eliza v0.1.5-alpha.3](../index.md) / IRedditService

# Interface: IRedditService

## Extends

- [`Service`](../classes/Service.md)

## Accessors

### serviceType

#### Get Signature

> **get** **serviceType**(): [`ServiceType`](../enumerations/ServiceType.md)

##### Returns

[`ServiceType`](../enumerations/ServiceType.md)

#### Inherited from

[`Service`](../classes/Service.md).[`serviceType`](../classes/Service.md#serviceType-1)

#### Defined in

[packages/core/src/types.ts:987](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L987)

## Methods

### initialize()

> `abstract` **initialize**(`runtime`): `Promise`\<`void`\>

Add abstract initialize method that must be implemented by derived classes

#### Parameters

• **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../classes/Service.md).[`initialize`](../classes/Service.md#initialize)

#### Defined in

[packages/core/src/types.ts:992](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L992)

***

### getCurrentUser()

> **getCurrentUser**(): `Promise`\<`unknown`\>

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[packages/core/src/types.ts:1185](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1185)

***

### getSubmission()

> **getSubmission**(`id`): `Promise`\<`unknown`\>

#### Parameters

• **id**: `string`

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[packages/core/src/types.ts:1186](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1186)

***

### getComments()

> **getComments**(`id`): `Promise`\<`unknown`\>

#### Parameters

• **id**: `string`

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[packages/core/src/types.ts:1187](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1187)

***

### replyToComment()

> **replyToComment**(`id`, `text`): `Promise`\<`unknown`\>

#### Parameters

• **id**: `string`

• **text**: `string`

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[packages/core/src/types.ts:1188](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L1188)
