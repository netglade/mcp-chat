export type ToolCallArgument = {
    name: string
    value: string
}

export type ToolCall = {
    name: string
    arguments: ToolCallArgument[]
    result: string,
    id: string,
}
