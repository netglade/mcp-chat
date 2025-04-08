import { useLocalStorage } from 'usehooks-ts'
import { McpServer } from '@/types/mcpServer.ts'
import { McpSandbox, startMcpSandbox } from '@netglade/mcp-sandbox'
import { useState } from 'react'
import { produce } from 'immer'

type UseMcpToolsArgs = {
    e2bApiKey: string
}

export const useMcpTools = ({
    e2bApiKey,
}: UseMcpToolsArgs) => {
    const [mcpServers, setMcpServers] = useLocalStorage<McpServer[]>('mcpServers', [])
    const [sandboxes, setSandboxes] = useState<{ id: string, sandbox: McpSandbox }[]>([])

    async function startServer(serverId: string) {
        const server = mcpServers.find((server) => server.id === serverId)
        if (!server) {
            throw new Error(`Server not found: ${serverId}`)
        }

        console.log('Starting server...')

        const sandbox = await startMcpSandbox({
            command: server.command,
            apiKey: e2bApiKey,
            envs: server.envs,
            timeoutMs: 1000 * 60 * 10,
        })

        const url = sandbox.getUrl()

        setSandboxes(produce((draft) => draft.push({ id: serverId, sandbox })))
        setMcpServers(produce((draft) => {
            const server = draft.find((server) => server.id === serverId)
            if (server) {
                server.url = url
                server.state = 'running'
            }
        }))
    }

    async function extendOrRestartServer(serverId: string): Promise<boolean> {
        const server = mcpServers.find(server => server.id === serverId)
        const sandbox = sandboxes.find((s) => s.id === serverId)?.sandbox

        if (!server || !sandbox) {
            throw new Error(`Server or sandbox not found: ${serverId}`)
        }

        // Check if server is running
        if (sandbox) {
            const isRunning = await sandbox.sandbox.isRunning()
            if (isRunning) {
                // Extend timeout if server is running
                await sandbox.sandbox.setTimeout(300_000)
                console.log('Server is running, timeout extended:', server.url)
                return false // Not restarted
            }
            console.log('Server stopped, restarting...')
        }

        // Server not running, restart it
        try {
            await startServer(serverId)
            console.log('Server restarted successfully:') //, newUrl)
            return true // Was restarted
        } catch (error) {
            console.error('Failed to restart server:', error)

            setMcpServers(produce((draft) => {
                const server = draft.find((server) => server.id === serverId)
                if (server) {
                    server.state = 'error'
                }
            }))

            throw error // Propagate the error
        }
    }

    const onAddServer = ({
        name,
        command,
        envs,
    }: {
        name: string
        command: string
        envs: Record<string, string>
    }) => {
        // let serverToAdd: McpServer = {
        //     name: server.name,
        //     command: server.command,
        //     envs: server.envs,
        //     id: uuidv4(),
        //     state: 'loading',
        //     url: undefined,
        // }
        //
        // // Check if a postgres server already exists
        // const existingPostgres = mcps.servers.find(s =>
        //     s.name?.toLowerCase().includes(server.name.toLowerCase())
        // );
        //
        // if (existingPostgres) {
        //     console.log('Server already exists');
        //     return;
        // }
        //
        // mcps.servers.push(serverToAdd)
        //
        // startServer(serverToAdd.command, serverToAdd.envs, serverToAdd.id)
    }

    const onRemoveServer = (serverId: string) => {
        const server = mcpServers.find((server) => server.id === serverId)
        if (server) {
            // kill it if running
        }

        setMcpServers(mcpServers.filter((server) => server.id !== serverId))
    }

    return {
        mcpServers,
        extendOrRestartServer,
        onAddServer,
        onRemoveServer,
    }
}
