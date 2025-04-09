import { Message } from '@/types/message'
import { CoreMessage } from 'ai'

export function toAISDKMessages(messages: Message[]) {
    return messages.map((message) => ({
        role: message.role,
        content: message.content.map((content) => {
            if (content.type === 'code') {
                return {
                    type: 'text',
                    text: content.text,
                }
            }

            return content
        }),
    } as CoreMessage))
}

export async function toMessageImage(files: File[]) {
    if (files.length === 0) {
        return []
    }

    return Promise.all(
        files.map(async (file) => {
            const base64 = Buffer.from(await file.arrayBuffer()).toString('base64')
            return `data:${file.type};base64,${base64}`
        }),
    )
}
