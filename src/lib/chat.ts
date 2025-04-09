import { CoreMessage, experimental_createMCPClient, generateText, LanguageModel } from 'ai'
import { getModelClient } from './models'
import { LLMModelConfig } from '@/types/llmModel'
import { McpServerConfiguration, McpServerState } from '@/types/mcpServer'
import { startMcpSandbox } from '@netglade/mcp-sandbox'
import { ToolCall, ToolCallArgument } from '@/types/toolCall'

export const maxDuration = 60

// TODO: Rate limit
// const rateLimitMaxRequests = process.env.RATE_LIMIT_MAX_REQUESTS
//   ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
//   : 10
// const ratelimitWindow = process.env.RATE_LIMIT_WINDOW
//   ? (process.env.RATE_LIMIT_WINDOW as Duration)
//   : '1d'

async function waitForServerReady(url: string, maxAttempts = 5): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const response = await fetch(url)
            if (response.status === 200) {
                console.log(`Server ready at ${url} after ${i + 1} attempts`)
                return true
            }
            console.log(`Server not ready yet (attempt ${i + 1}), status: ${response.status}`)
        } catch (error) {
            console.log(`Server connection failed (attempt ${i + 1})`)
        }
        // Wait 2 seconds between attempts
        await new Promise(resolve => setTimeout(resolve, 6000))
    }
    return false
}

async function tryExtendMcpSandboxTimeout(server: McpServerConfiguration) {
    if (server.sandbox) {
        const isRunning = await server.sandbox.sandbox.isRunning()

        if (isRunning == false) {
            return false
        }

        // Extend timeout if server is running
        await server.sandbox.sandbox.setTimeout(300_000)
        console.log('Server is running, timeout extended:', server.url)
        return true // Not restarted
    }
    console.warn('Sandbox not set on server')
    return false
}

async function restartMcpSandbox(server: McpServerConfiguration) {
    // Server not running, restart it
    try {
        const sandbox = await startMcpSandbox({
            command: server.command,
            apiKey: e2bApiKey,
            envs: server.envs,
            timeoutMs: 1000 * 60 * 10,
        })

        const newUrl = sandbox.getUrl()

        // Update server with new sandbox and URL
        server.url = newUrl
        server.sandbox = sandbox
        server.state = 'running' as McpServerState

        console.log('Server starting on: ', newUrl)

        // Wait for the server to be initialized
        const isReady = await waitForServerReady(server.url)
        if (!isReady) {
            console.log(`Server ${server.name} failed to initialize properly after restart`)
            server.state = 'error' as McpServerState // Update state if not ready
            return false // Indicate failure to initialize
        }

        return true // Was restarted and is ready
    } catch (error) {
        console.error('Failed to restart server:', error)
        server.state = 'error' as McpServerState
        throw error // Propagate the error
    }
}


export async function generateResponse(
    messages: CoreMessage[],
    config: LLMModelConfig,
    e2bApiKey: string,
    mcpServers: McpServerConfiguration[],
    signal?: AbortSignal,
) {
    // Check if the signal is aborted
    if (signal?.aborted) {
        throw new Error('Request was aborted')
    }

    //TODO: Rate limit??
    // const limit = !config.apiKey
    //   ? await ratelimit(userID, rateLimitMaxRequests, ratelimitWindow)
    //   : false;

    // if (limit) {
    //   return {
    //     status: 429,
    //     body: {
    //       message: 'You have reached your request limit for the day.',
    //       headers: {
    //         'X-RateLimit-Limit': limit.amount.toString(),
    //         'X-RateLimit-Remaining': limit.remaining.toString(),
    //         'X-RateLimit-Reset': limit.reset.toString(),
    //       },
    //     },
    //   };
    // }

    console.log('model', model)
    console.log('config', config)

    const clients: any[] = []
    try {
        const readyServers: typeof mcpServers = []
        const needsInitialization: typeof mcpServers = []

        const extendPromises = mcpServers.map(async (server) => {
            try {
                const wasExtended = await tryExtendMcpSandboxTimeout(server)
                if (wasExtended) {
                    readyServers.push(server) // Collect servers that were successfully extended
                } else {
                    needsInitialization.push(server) // Collect servers that need to be restarted
                }
            } catch (error) {
                console.error(`Failed to extend server ${server.name}:`, error)
            }
        })

        await Promise.all(extendPromises)

        // Phase 2: Wait for restarted servers to be ready
        console.log('Phase 2: Waiting for restarted servers...')
        const initializationPromises = needsInitialization.map(async (server) => {
            if (server.url) {
                const wasRestarted = await restartMcpSandbox(server) // Call the restart function
                if (!wasRestarted) {
                    console.log(`Server ${server.name} failed to initialize properly after restart`)
                    return // Skip adding to readyServers
                }
                readyServers.push(server) // Add to readyServers if successfully restarted and initialized
            }
        })

        await Promise.all(initializationPromises)

        // Phase 3: Create clients for all ready servers
        console.log('Phase 3: Creating clients...')
        for (const server of readyServers) {
            const client = await experimental_createMCPClient({
                transport: {
                    type: 'sse',
                    url: server.url!,
                },
            })
            clients.push(client)
        }

        let tools = {}
        for (const client of clients) {
            const toolSet = await client.tools()
            console.log('Tools fetched:', toolSet)
            tools = {
                ...tools,
                ...toolSet,
            }
        }

        const { model: modelNameString, apiKey: modelApiKey, ...modelParams } = config
        const modelClient = getModelClient(model, config)

        const response = await generateText({
            model: modelClient as LanguageModel,
            tools,
            maxSteps: 20,
            messages,
        })

        console.log(JSON.stringify(response.response.messages))
        console.log(response.text)

        const toolCalls = extractToolCalls(response.response.messages)
        console.log(JSON.stringify(toolCalls))

        return {
            status: 200,
            body: {
                text: response.text,
                toolCalls,
            },
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            body: {
                error: 'Failed to process request',
            },
        }
    } finally {
        for (const client of clients) {
            if (client) {
                await client.close()
            }
        }
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
