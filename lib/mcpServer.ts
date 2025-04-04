export type McpServerState = 'loading' | 'running' | 'error'

export interface McpServer {
    name: string
    command: string
    envs: Record<string, string>
    id: string
    url: string | undefined
    state: McpServerState
}

export interface Mcps {
    servers: McpServer[]
}
