import { ToolCall } from '@/types/toolCall'

export type MessageText = {
    type: 'text'
    text: string
}

export type MessageCode = {
    type: 'code'
    text: string
}

export type MessageImage = {
    type: 'image'
    image: string
}

export type Message = {
    role: 'assistant' | 'user'
    content: Array<MessageText | MessageCode | MessageImage>
    toolCalls?: ToolCall[]
}
