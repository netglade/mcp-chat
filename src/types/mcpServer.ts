import { McpSandbox } from '@netglade/mcp-sandbox'
import { experimental_createMCPClient } from 'ai'

export type McpServerState = 'loading' | 'running' | 'error'

export type McpServerConfiguration = {
    name: string
    command: string
    envs: Record<string, string>
    id: string
}

export type McpServerClient = {
    id: string
    configuration: McpServerConfiguration
    state: McpServerState
    sandbox?: McpSandbox
    url?: string
    client?: Awaited<ReturnType<typeof experimental_createMCPClient>>
    tools?: Awaited<ReturnType<Awaited<ReturnType<typeof experimental_createMCPClient>>['tools']>>
}
