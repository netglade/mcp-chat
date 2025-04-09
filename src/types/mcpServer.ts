import { McpSandbox } from '@netglade/mcp-sandbox'

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
}
