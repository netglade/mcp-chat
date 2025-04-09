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
