import { getDeferredTools, addParametersToDescription, } from "@goat-sdk/core";
import { generateText, ModelClass, composeContext, generateObjectV2, } from "@ai16z/eliza";
/**
 * Get all the on chain actions for the given wallet client and plugins
 *
 * @param params
 * @returns
 */
export async function getOnChainActions({ getWalletClient, plugins, chain, supportsSmartWallets, }) {
    const tools = await getDeferredTools({
        plugins,
        wordForTool: "action",
        chain,
        supportsSmartWallets,
    });
    return tools
        .map((action) => ({
        ...action,
        name: action.name.toUpperCase(),
    }))
        .map((tool) => createAction(tool, getWalletClient));
}
function createAction(tool, getWalletClient) {
    return {
        name: tool.name,
        similes: [],
        description: tool.description,
        validate: async () => true,
        handler: async (runtime, message, state, options, callback) => {
            try {
                const walletClient = await getWalletClient(runtime);
                let currentState = state ?? (await runtime.composeState(message));
                currentState =
                    await runtime.updateRecentMessageState(currentState);
                const parameterContext = composeParameterContext(tool, currentState);
                const parameters = await generateParameters(runtime, parameterContext, tool);
                const parsedParameters = tool.parameters.safeParse(parameters);
                if (!parsedParameters.success) {
                    callback?.({
                        text: `Invalid parameters for action ${tool.name}: ${parsedParameters.error.message}`,
                        content: { error: parsedParameters.error.message },
                    });
                    return false;
                }
                const result = await tool.method(walletClient, parsedParameters.data);
                const responseContext = composeResponseContext(tool, result, currentState);
                const response = await generateResponse(runtime, responseContext);
                callback?.({ text: response, content: result });
                return true;
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                callback?.({
                    text: `Error executing action ${tool.name}: ${errorMessage}`,
                    content: { error: errorMessage },
                });
                return false;
            }
        },
        examples: [],
    };
}
function composeParameterContext(tool, state) {
    const contextTemplate = `{{recentMessages}}

Given the recent messages, extract the following information for the action "${tool.name}":
${addParametersToDescription("", tool.parameters)}
`;
    return composeContext({ state, template: contextTemplate });
}
async function generateParameters(runtime, context, tool) {
    const { object } = await generateObjectV2({
        runtime,
        context,
        modelClass: ModelClass.LARGE,
        schema: tool.parameters,
    });
    return object;
}
function composeResponseContext(tool, result, state) {
    const responseTemplate = `
    # Action Examples
{{actionExamples}}
(Action examples are for reference only. Do not use the information from them in your response.)

# Knowledge
{{knowledge}}

# Task: Generate dialog and actions for the character {{agentName}}.
About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{attachments}}

# Capabilities
Note that {{agentName}} is capable of reading/seeing/hearing various forms of media, including images, videos, audio, plaintext and PDFs. Recent attachments have been included above under the "Attachments" section.

The action "${tool.name}" was executed successfully.
Here is the result:
${JSON.stringify(result)}

{{actions}}

Respond to the message knowing that the action was successful and these were the previous messages:
{{recentMessages}}
  `;
    return composeContext({ state, template: responseTemplate });
}
async function generateResponse(runtime, context) {
    return generateText({
        runtime,
        context,
        modelClass: ModelClass.LARGE,
    });
}
//# sourceMappingURL=actions.js.map