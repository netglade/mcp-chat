import { useLocalStorage } from 'usehooks-ts'
import { McpServer } from '@/types/mcpServer.ts'
import { McpSandbox, startMcpSandbox } from '@netglade/mcp-sandbox'
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
    const [mcpServers, setMcpServers] = useLocalStorage<McpServer[]>('mcpServers', [])
    const [sandboxes, setSandboxes] = useState<{ id: string, sandbox: McpSandbox }[]>([])

    useEffect(() => {
        for (const server of mcpServers) {
            startServer(server)
        }

        setMcpServers(mcpServers.map((s) => ({
            ...s,
            url: undefined,
            state: 'loading',
        })))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function startServer(server: McpServer) {
        console.log(`Starting server \`${server.name}\`...`)

        const sandbox = await startMcpSandbox({
            command: server.command,
            apiKey: e2bApiKey,
            envs: server.envs,
            timeoutMs: 1000 * 60 * 10,
        })

        const url = sandbox.getUrl()

        setSandboxes(produce((draft) => {
            draft.push({ id: server.id, sandbox })
        }))
        setMcpServers(produce((draft) => {
            const serverToUpdate = draft.find((s) => s.id === server.id)
            if (serverToUpdate) {
                serverToUpdate.url = url
                serverToUpdate.state = 'running'
            }
        }))
    }

    async function extendOrRestartServer(serverId: string): Promise<boolean> {
        const server = mcpServers.find(server => server.id === serverId)
        const sandbox = sandboxes.find((s) => s.id === serverId)?.sandbox

        if (!server || !sandbox) {
            throw new Error(`Server or sandbox not found. ID: ${serverId}`)
        }

        // Check if server is running
        if (sandbox) {
            const isRunning = await sandbox.sandbox.isRunning()
            if (isRunning) {
                // Extend timeout if server is running
                await sandbox.sandbox.setTimeout(300_000)
                console.log(`Server \`${server.name}\` is running, timeout extended:`, server.url)
                return false // Not restarted
            }
            console.log(`Server \`${server.name}\` stopped, restarting...`)
        }

        // Server not running, restart it
        try {
            await startServer(server)
            console.log(`Server \`${server.name}\` restarted successfully:`) //, newUrl)
            return true // Was restarted
        } catch (error) {
            console.error(`Failed to restart server \`${server.name}\`:`, error)

            setMcpServers(produce((draft) => {
                const server = draft.find((server) => server.id === serverId)
                if (server) {
                    server.state = 'error'
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
        const serverToAdd: McpServer = {
            name,
            command,
            envs,
            id: uuidv4(),
            state: 'loading',
            url: undefined,
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

        setMcpServers(produce((draft) => {
            draft.push(serverToAdd)
        }))
        startServer(serverToAdd)
    }

    const removeServerFn = async (serverId: string) => {
        const sandbox = sandboxes.find((s) => s.id === serverId)?.sandbox
        if (sandbox) {
            await sandbox.sandbox.kill()
        }

        setMcpServers((prev) => prev.filter((server) => server.id !== serverId))
        setSandboxes((prev => prev.filter((s) => s.id !== serverId)))
    }

    const { mutateAsync: onAddServerAsync, isPending: isAddServerPending } = useMutation({
        mutationFn: addServerFn,
    })

    const { mutateAsync: onRemoveServerAsync, isPending: isRemoveServerPending } = useMutation({
        mutationFn: removeServerFn,
    })

    return {
        mcpServers,
        sandboxes,
        extendOrRestartServer,
        onAddServerAsync,
        isAddServerPending,
        onRemoveServerAsync,
        isRemoveServerPending,
    }
}
