import { useLocalStorage } from 'usehooks-ts'
import { McpServerClient, McpServerConfiguration } from '@/types/mcpServer.ts'
import { startMcpSandbox } from '@netglade/mcp-sandbox'
import { useEffect, useState } from 'react'
import { produce } from 'immer'
import { useMutation } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid'
import { experimental_createMCPClient } from 'ai'

type UseMcpToolsArgs = {
    e2bApiKey: string
}

export const useMcpTools = ({
    e2bApiKey,
}: UseMcpToolsArgs) => {
    const [serverConfigurations, setServerConfigurations] = useLocalStorage<McpServerConfiguration[]>('mcpServerConfigurations', [])
    const [serverClients, setServerClients] = useState<McpServerClient[]>(serverConfigurations.map((configuration) => ({
        id: configuration.id,
        configuration,
        state: 'loading',
    })))

    useEffect(() => {
        for (const serverConfiguration of serverConfigurations) {
            startServer(serverConfiguration)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function startServer(serverConfiguration: McpServerConfiguration) {
        try {
            console.log(`Starting server \`${serverConfiguration.name}\`...`)

            setServerClients(produce((draft) => {
                const client = draft.find((c) => c.id === serverConfiguration.id)
                if (client) {
                    client.state = 'loading'
                }
            }))

            const sandbox = await startMcpSandbox({
                command: serverConfiguration.command,
                apiKey: e2bApiKey,
                envs: serverConfiguration.envs,
                timeoutMs: 1000 * 60 * 10,
            })
            const url = sandbox.getUrl()

            const success = await waitForServerReady(sandbox.getUrl(), 5)
            if (!success) {
                setServerClients(produce((draft) => {
                    const client = draft.find((c) => c.id === serverConfiguration.id)
                    if (client) {
                        client.state = 'error'
                    }
                }))

                throw new Error(`Server \`${serverConfiguration.name}\` not ready`)
            }

            const aiClient = await experimental_createMCPClient({
                transport: {
                    type: 'sse',
                    url,
                },
            })
            const tools = await aiClient.tools()

            setServerClients(produce((draft) => {
                const client = draft.find((c) => c.id === serverConfiguration.id)
                if (client) {
                    client.state = 'running'
                    client.sandbox = sandbox
                    client.url = url
                    client.client = aiClient
                    client.tools = tools
                }
            }))
        } catch (error) {
            setServerClients(produce((draft) => {
                const client = draft.find((c) => c.id === serverConfiguration.id)
                if (client) {
                    client.state = 'error'
                }
            }))

            throw error // Propagate the error
        }
    }

    async function extendOrRestartServer(client: McpServerClient): Promise<void> {
        // Check if server is running
        if (client.sandbox) {
            const isRunning = await client.sandbox.sandbox.isRunning()
            if (isRunning) {
                // Extend timeout if server is running
                await client.sandbox.sandbox.setTimeout(300_000)
                console.log(`Server \`${client.configuration.name}\` is running, timeout extended:`, client.url)
                return
            }
            console.log(`Server \`${client.configuration.name}\` stopped, restarting...`)
        }

        // Server not running, restart it
        try {
            await startServer(client.configuration)
            console.log(`Server \`${client.configuration.name}\` restarted successfully:`) //, newUrl)
        } catch (error) {
            console.error(`Failed to restart server \`${client.configuration.name}\`:`, error)
            throw error // Propagate the error
        }
    }

    async function waitForServerReady(url: string, maxAttempts = 5) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const response = await fetch(url)
                if (response.status === 200) {
                    console.log(`Server ready at ${url} after ${i + 1} attempts`)
                    return true
                }
                console.log(`Server not ready yet (attempt ${i + 1}), status: ${response.status}`)
            } catch {
                console.log(`Server connection failed (attempt ${i + 1})`)
            }
            // Wait 6 seconds between attempts
            await new Promise(resolve => setTimeout(resolve, 6000))
        }
        return false
    }

    const addServerFn = async ({
        name,
        command,
        envs,
    }: {
        name: string
        command: string
        envs: Record<string, string>
    }) => {
        const configuration: McpServerConfiguration = {
            name,
            command,
            envs,
            id: uuidv4(),
        }

        // // Check if a postgres server already exists
        // const existingPostgres = mcps.servers.find(s =>
        //     s.name?.toLowerCase().includes(server.name.toLowerCase())
        // );
        //
        // if (existingPostgres) {
        //     console.log('Server already exists');
        //     return;
        // }

        setServerConfigurations(produce((draft) => {
            draft.push(configuration)
        }))
        setServerClients(produce((draft) => {
            draft.push({
                id: configuration.id,
                configuration,
                state: 'loading',
            })
        }))
        startServer(configuration)
    }

    const removeServerFn = async (serverId: string) => {
        const client = serverClients.find((s) => s.id === serverId)
        if (client?.sandbox) {
            await client.sandbox.sandbox.kill()
        }

        setServerConfigurations((prev) => prev.filter((server) => server.id !== serverId))
        setServerClients((prev => prev.filter((s) => s.id !== serverId)))
    }

    const { mutateAsync: onAddServerAsync, isPending: isAddServerPending } = useMutation({
        mutationFn: addServerFn,
    })

    const { mutateAsync: onRemoveServerAsync, isPending: isRemoveServerPending } = useMutation({
        mutationFn: removeServerFn,
    })

    return {
        serverClients,
        extendOrRestartServer,
        onAddServerAsync,
        isAddServerPending,
        onRemoveServerAsync,
        isRemoveServerPending,
    }
}
