import { useLocalStorage } from 'usehooks-ts'
import { McpServerClient, McpServerConfiguration } from '@/types/mcpServer.ts'
import { startMcpSandbox } from '@netglade/mcp-sandbox'
import { useEffect, useState } from 'react'
import { produce } from 'immer'
import { useMutation } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid'

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

        setServerClients(produce((draft) => {
            const client = draft.find((c) => c.id === serverConfiguration.id)
            if (client) {
                client.state = 'running'
                client.sandbox = sandbox
                client.url = url
            }
        }))
    }

    async function extendOrRestartServer(serverId: string): Promise<boolean> {
        const serverConfiguration = serverConfigurations.find(s => s.id === serverId)
        const client = serverClients.find((c) => c.id === serverId)

        if (!serverConfiguration || !client) {
            throw new Error(`Server or sandbox not found. ID: ${serverId}`)
        }

        // Check if server is running
        if (client.sandbox) {
            const isRunning = await client.sandbox.sandbox.isRunning()
            if (isRunning) {
                // Extend timeout if server is running
                await client.sandbox.sandbox.setTimeout(300_000)
                console.log(`Server \`${serverConfiguration.name}\` is running, timeout extended:`, client.url)
                return false // Not restarted
            }
            console.log(`Server \`${serverConfiguration.name}\` stopped, restarting...`)
        }

        // Server not running, restart it
        try {
            await startServer(serverConfiguration)
            console.log(`Server \`${serverConfiguration.name}\` restarted successfully:`) //, newUrl)
            return true // Was restarted
        } catch (error) {
            console.error(`Failed to restart server \`${serverConfiguration.name}\`:`, error)

            setServerClients(produce((draft) => {
                const client = draft.find((c) => c.id === serverId)
                if (client) {
                    client.state = 'error'
                }
            }))

            throw error // Propagate the error
        }
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
