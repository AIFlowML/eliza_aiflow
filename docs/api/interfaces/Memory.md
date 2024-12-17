[@ai16z/eliza v0.1.5-alpha.5](../index.md) / Memory

# Interface: Memory

Represents a stored memory/message

## Properties

### id?

> `optional` **id**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Optional unique identifier

#### Defined in

[packages/core/src/types.ts:327](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L327)

***

### userId

> **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Associated user ID

#### Defined in

[packages/core/src/types.ts:330](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L330)

***

### agentId

> **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Associated agent ID

#### Defined in

[packages/core/src/types.ts:333](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L333)

***

### createdAt?

> `optional` **createdAt**: `number`

Optional creation timestamp

#### Defined in

[packages/core/src/types.ts:336](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L336)

***

### content

> **content**: [`Content`](Content.md)

Memory content

#### Defined in

[packages/core/src/types.ts:339](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L339)

***

### embedding?

> `optional` **embedding**: `number`[]

Optional embedding vector

#### Defined in

[packages/core/src/types.ts:342](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L342)

***

### roomId

> **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Associated room ID

#### Defined in

[packages/core/src/types.ts:345](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L345)

***

### unique?

> `optional` **unique**: `boolean`

Whether memory is unique

#### Defined in

[packages/core/src/types.ts:348](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L348)

***

### similarity?

> `optional` **similarity**: `number`

Embedding similarity score

#### Defined in

[packages/core/src/types.ts:351](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L351)
