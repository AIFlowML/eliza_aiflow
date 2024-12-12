[@ai16z/eliza v0.1.5-alpha.3](../index.md) / Goal

# Interface: Goal

Represents a high-level goal composed of objectives

## Properties

### id?

> `optional` **id**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Optional unique identifier

#### Defined in

[packages/core/src/types.ts:111](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L111)

***

### roomId

> **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Room ID where goal exists

#### Defined in

[packages/core/src/types.ts:114](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L114)

***

### userId

> **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

User ID of goal owner

#### Defined in

[packages/core/src/types.ts:117](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L117)

***

### name

> **name**: `string`

Name/title of the goal

#### Defined in

[packages/core/src/types.ts:120](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L120)

***

### status

> **status**: [`GoalStatus`](../enumerations/GoalStatus.md)

Current status

#### Defined in

[packages/core/src/types.ts:123](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L123)

***

### objectives

> **objectives**: [`Objective`](Objective.md)[]

Component objectives

#### Defined in

[packages/core/src/types.ts:126](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L126)
