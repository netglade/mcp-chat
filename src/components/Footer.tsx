import { CircleDot, LoaderCircle, AlertCircle } from 'lucide-react'
import { McpServerClient } from '@/types/mcpServer'

export function Footer({
    serverClients,
}: {
    serverClients: McpServerClient[]
}) {
    // Count servers by state
    const runningServers = serverClients.filter(client => client.state === 'running').length
    const startingServers = serverClients.filter(client => client.state === 'starting').length
    const erroredServers = serverClients.filter(client => client.state === 'error').length
    
    // Determine connection status
    let statusIcon = <CircleDot className="h-3 w-3 text-green-500" />
    let statusText = `${runningServers} MCP server${runningServers !== 1 ? 's' : ''} connected`
    
    if (serverClients.length === 0) {
        statusIcon = <CircleDot className="h-3 w-3 text-zinc-400" />
        statusText = "No MCP servers"
    } else if (startingServers > 0) {
        statusIcon = <LoaderCircle className="h-3 w-3 text-amber-500 animate-spin" />
        statusText = "Starting MCP servers..."
    } else if (erroredServers === serverClients.length) {
        statusIcon = <AlertCircle className="h-3 w-3 text-red-500" />
        statusText = "MCP server error"
    }

    return (
        <footer className="w-full pb-2 bg-background text-muted-foreground text-xs">
            <div className="container mx-auto flex items-center justify-center px-4">
                <div className="flex items-center gap-2">
                    {statusIcon}
                    <span>{statusText}</span>
                </div>
            </div>
        </footer>
    )
} 