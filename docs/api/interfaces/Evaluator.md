[@ai16z/eliza v0.1.5-alpha.5](../index.md) / Evaluator

# Interface: Evaluator

Evaluator for assessing agent responses

## Properties

### alwaysRun?

> `optional` **alwaysRun**: `boolean`

Whether to always run

#### Defined in

[packages/core/src/types.ts:435](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L435)

***

### description

> **description**: `string`

Detailed description

#### Defined in

[packages/core/src/types.ts:438](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L438)

***

### similes

> **similes**: `string`[]

Similar evaluator descriptions

#### Defined in

[packages/core/src/types.ts:441](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L441)

***

### examples

> **examples**: [`EvaluationExample`](EvaluationExample.md)[]

Example evaluations

#### Defined in

[packages/core/src/types.ts:444](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L444)

***

### handler

> **handler**: [`Handler`](../type-aliases/Handler.md)

Handler function

#### Defined in

[packages/core/src/types.ts:447](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L447)

***

### name

> **name**: `string`

Evaluator name

#### Defined in

[packages/core/src/types.ts:450](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L450)

***

### validate

> **validate**: [`Validator`](../type-aliases/Validator.md)

Validation function

#### Defined in

[packages/core/src/types.ts:453](https://github.com/AIFlowML/eliza_aiflow/blob/main/packages/core/src/types.ts#L453)
