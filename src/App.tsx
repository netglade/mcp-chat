import { Chat } from '@/components/Chat'
import { ChatInput } from '@/components/ChatInput'
import { ToolSettings } from '@/components/ToolSettings'
import { NavBar } from '@/components/NavBar'
import { useState } from 'react'
import type { Message } from '@/types/message'
import { useLocalStorage } from 'usehooks-ts'
import type { LLMModelConfig } from '@/types/llmModel'
import modelsList from '@/lib/models.json'
import { ModelPicker } from '@/components/ModelPicker'
import { ApiKeySettings } from '@/components/ApiKeySettings.tsx'
import { useMcpTools } from '@/hooks/useMcpTools.ts'
import { useChat } from '@/hooks/useChat.ts'

export default function App() {
    const [messages, setMessages] = useState<Message[]>([])
    const [chatInput, setChatInput] = useLocalStorage('chat', '')
    const [error, setError] = useState(undefined)

    const [languageModelConfiguration, setLanguageModelConfiguration] = useLocalStorage<LLMModelConfig>(
        'languageModel',
        {
            model: 'claude-3-5-sonnet-latest',
        },
    )
    const [e2bApiKey, setE2bApiKey] = useLocalStorage<string>('e2bApiKey', '')

    const {
        serverClients,
        extendOrRestartServer,
        onAddServerAsync,
        isAddServerPending,
        onRemoveServerAsync,
        isRemoveServerPending,
    } = useMcpTools({ e2bApiKey })

    const { generateResponseAsync, isGenerateResponsePending } = useChat({
        clients: serverClients,
        languageModelConfig: languageModelConfiguration,
        extendOrRestartServer,
    })


    const submit = async ({ messages }: { messages: Message[] }) => {
        console.log(messages)
        setError(undefined)

        try {
            try {
                const response = await generateResponseAsync({ messages })
                addMessage({
                    role: 'assistant',
                    toolCalls: response.toolCalls,
                    content: [{ type: 'text', text: response.text ?? '' }],
                })
            } catch {
                addMessage({
                    role: 'assistant',
                    content: [{ type: 'text', text: 'Ups, something went wrong...' }],
                })
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Fetch operation was aborted')
            } else {
                console.error('Error submitting form:', err)
                setError(err.message || 'An error occurred while submitting the form')
            }
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const content: Message['content'] = [{ type: 'text', text: chatInput }]

        const updatedMessages = addMessage({
            role: 'user',
            content,
        })

        submit({
            messages: updatedMessages,
        })

        setChatInput('')
    }

    function retry() {
        submit({
            messages,
        })
    }

    function addMessage(message: Message) {
        setMessages((previousMessages) => [...previousMessages, message])
        return [...messages, message]
    }

    function handleSaveInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setChatInput(e.target.value)
    }

    function handleLanguageModelChange(e: LLMModelConfig) {
        setLanguageModelConfiguration({ ...languageModelConfiguration, ...e })
    }

    function handleClearChat() {
        setChatInput('')
        setMessages([])
    }

    return (
        <main className="flex min-h-screen max-h-screen">
            <div className="grid w-full md:grid-cols-2">
                <div
                    className={`flex flex-col w-full max-h-full max-w-[800px] mx-auto px-4 overflow-auto col-span-2`}
                >
                    <NavBar
                        onClear={handleClearChat}
                        canClear={messages.length > 0}
                    />
                    <Chat
                        messages={messages}
                        isLoading={isGenerateResponsePending}
                    />
                    <ChatInput
                        retry={retry}
                        isErrored={error !== undefined}
                        input={chatInput}
                        handleInputChange={handleSaveInputChange}
                        handleSubmit={handleSubmit}
                    >
                        <ToolSettings
                            serverClients={serverClients}
                            onAddServerAsync={onAddServerAsync}
                            isAddServerPending={isAddServerPending}
                            onRemoveServerAsync={onRemoveServerAsync}
                            isRemoveServerPending={isRemoveServerPending}
                        />
                        <ModelPicker
                            models={modelsList.models}
                            languageModel={languageModelConfiguration}
                            onLanguageModelChange={handleLanguageModelChange}
                        />
                        <ApiKeySettings
                            e2bApiKey={e2bApiKey}
                            onE2bApiKeyChange={setE2bApiKey}
                            languageModel={languageModelConfiguration}
                            onLanguageModelChange={handleLanguageModelChange}
                        />
                    </ChatInput>
                </div>
            </div>
        </main>
    )
}
