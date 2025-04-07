export interface ToolCallArgument {
    name: string
    value: string
}

export interface ToolCall {
    name: string
    arguments: ToolCallArgument[]
    result: string,
    id: string,
}
