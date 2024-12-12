[@ai16z/eliza v0.1.5-alpha.3](../index.md) / Content

# Interface: Content

Represents the content of a message or communication

## Indexable

 \[`key`: `string`\]: `unknown`

## Properties

### text

> **text**: `string`

The main text content

#### Defined in

[packages/core/src/types.ts:14](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L14)

***

### action?

> `optional` **action**: `string`

Optional action associated with the message

#### Defined in

[packages/core/src/types.ts:17](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L17)

***

### source?

> `optional` **source**: `string`

Optional source/origin of the content

#### Defined in

[packages/core/src/types.ts:20](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L20)

***

### url?

> `optional` **url**: `string`

URL of the original message/post (e.g. tweet URL, Discord message link)

#### Defined in

[packages/core/src/types.ts:23](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L23)

***

### inReplyTo?

> `optional` **inReplyTo**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

UUID of parent message if this is a reply/thread

#### Defined in

[packages/core/src/types.ts:26](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L26)

***

### attachments?

> `optional` **attachments**: [`Media`](../type-aliases/Media.md)[]

Array of media attachments

#### Defined in

[packages/core/src/types.ts:29](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L29)
