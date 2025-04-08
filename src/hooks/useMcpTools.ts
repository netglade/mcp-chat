import { useLocalStorage } from 'usehooks-ts'
import { McpServer } from '@/types/mcpServer.ts'

export const useMcpTools = () => {
    const [mcpServers, setMcpServers] = useLocalStorage<McpServer[]>('mcpServers', [])

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
        onAddServer,
        onRemoveServer,
    }
}
