import { McpServerClient } from '@/types/mcpServer.ts'
import { useMutation } from '@tanstack/react-query'
import { streamText } from 'ai'
import { LLMModelConfig } from '@/types/llmModel.ts'
import { getModelClient } from '@/lib/models.ts'
import modelsList from '@/lib/models.json'
import { ToolCall, ToolCallArgument } from '@/types/toolCall.ts'
import { toAISDKMessages } from '@/lib/messages.ts'
import { Message } from '@/types/message.ts'

type UseChatArgs = {
    clients: McpServerClient[]
    languageModelConfig: LLMModelConfig
    extendOrRestartServer: (client: McpServerClient) => Promise<void>
    onStreamUpdate?: (text: string) => void
}

export const useChat = ({
    clients,
    languageModelConfig,
    extendOrRestartServer,
    onStreamUpdate,
}: UseChatArgs) => {
    const generateResponseFn = async ({
        messages,
    }: {
        messages: Message[]
    }) => {
        const runningClients = clients.filter((client) => client.state === 'running')
        const extendPromises = runningClients.map(extendOrRestartServer)
        await Promise.all(extendPromises)

        let tools = {}
        for (const client of runningClients) {
            tools = { ...tools, ...client.tools }
        }

        const languageModel = modelsList.models.find((x) => x.id === languageModelConfig.model)!
        const modelClient = getModelClient(languageModel, languageModelConfig)

        let accumulatedText = ''
        const result = streamText({
            model: modelClient,
            tools,
            maxSteps: 20,
            messages: toAISDKMessages(messages),
            headers: {
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            onChunk: ({ chunk }) => {
                if (chunk.type === 'text-delta') {
                    accumulatedText += chunk.textDelta
                    onStreamUpdate?.(accumulatedText)
                }
            },
        })

        // Wait for the stream to finish and get the final result
        for await (const part of result.fullStream) {
            if (part.type === 'finish') {
                console.log('Stream finished:', part)
                break
            }
        }

        const finalText = await result.text
        console.log('Final text:', finalText)

        const responseMetadata = await result.response
        const toolCalls = extractToolCalls(responseMetadata.messages || [])
        console.log('Tool calls:', JSON.stringify(toolCalls))

        return {
            text: finalText,
            toolCalls,
        }
    }

    const { mutateAsync: generateResponseAsync, isPending: isGenerateResponsePending } = useMutation({
        mutationFn: generateResponseFn,
    })

    return {
        generateResponseAsync,
        isGenerateResponsePending,
    }
}

function extractToolCalls(conversation: any[]): ToolCall[] {
    const toolCalls: ToolCall[] = []

    // Iterate through the conversation
    for (let i = 0; i < conversation.length - 1; i++) {
        const currentMessage = conversation[i]

        // Check if this is an assistant message with tool calls
        if (currentMessage.role === 'assistant' && currentMessage.content) {
            // Find the tool-call item in the content array (there can only be one per message)
            const toolCallContent = currentMessage.content.find(
                (item: any) => item.type === 'tool-call',
            )

            // Process the tool call if found
            if (toolCallContent) {
                const toolCallId = toolCallContent.toolCallId
                const toolName = toolCallContent.toolName
                const args = toolCallContent.args

                // Look for the corresponding tool response
                const nextMessage = conversation[i + 1]
                if (nextMessage.role === 'tool' && nextMessage.content) {
                    // Find the matching tool result
                    const toolResult = nextMessage.content.find(
                        (item: any) =>
                            item.type === 'tool-result' && item.toolCallId === toolCallId,
                    )

                    if (toolResult) {
                        // Extract the result text
                        const resultText = toolResult.result.content?.[0]?.text || ''

                        // Convert args object to ToolCallArgument array
                        const argsArray: ToolCallArgument[] = Object.entries(args).map(
                            ([name, value]) => ({
                                name,
                                value: String(value),
                            }),
                        )

                        // Add the tool call to our collection
                        toolCalls.push({
                            name: toolName,
                            arguments: argsArray,
                            result: resultText,
                            id: toolCallId,
                        })
                    }
                }
            }
        }
    }

    return toolCalls
}
