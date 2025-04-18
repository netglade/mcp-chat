import { Chat } from '@/components/Chat'
import { ChatInput } from '@/components/ChatInput'
import { ToolSettings } from '@/components/ToolSettings'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { useState } from 'react'
import type { Message } from '@/types/message'
import { useLocalStorage } from 'usehooks-ts'
import type { LLMModelConfig } from '@/types/llmModel'
import modelsList from '@/lib/models.json'
import { ModelPicker } from '@/components/ModelPicker'
import { ApiKeySettings } from '@/components/ApiKeySettings.tsx'
import { useMcpTools } from '@/hooks/useMcpTools.ts'
import { useChat } from '@/hooks/useChat.ts'
import { TutorialCard } from '@/components/TutorialCard.tsx'
import { ErrorMessage } from '@/components/ErrorMessage.tsx'

export default function App() {
    const [messages, setMessages] = useState<Message[]>([])
    const [chatInput, setChatInput] = useLocalStorage('chat', '')
    const [error, setError] = useState<string | undefined>(undefined)
    const [streamingContent, setStreamingContent] = useState<string>('')

    const [languageModelConfiguration, setLanguageModelConfiguration] = useLocalStorage<LLMModelConfig>(
        'languageModel',
        {
            model: 'claude-3-5-sonnet-latest',
        },
    )
    const [e2bApiKey, setE2bApiKey] = useLocalStorage<string>('e2bApiKey', '')

    const {
        serverClients,
        isClientsLoading,
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
        onStreamUpdate: (text) => {
            setStreamingContent(text)
        },
    })

    const submit = async ({ messages }: { messages: Message[] }) => {
        console.log(messages)
        setError(undefined)
        setStreamingContent('')

        try {
            const response = await generateResponseAsync({ messages })
            addMessage({
                role: 'assistant',
                toolCalls: response.toolCalls,
                content: [{ type: 'text', text: response.text ?? '' }],
            })
            setStreamingContent('')
        } catch (err: unknown) {
            console.error(`Error generating response:`, err)
            setError(err instanceof Error ? err.message : 'An error occurred while generating response')
            setStreamingContent('')
            addMessage({
                role: 'assistant',
                content: [{ type: 'text', text: 'Ups, something went wrong...' }],
            })
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        if (isClientsLoading) {
            return
        }

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
        if (isClientsLoading) {
            return
        }

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
        setError(undefined)
        setStreamingContent('')
    }

    function handleExampleClick(query: string) {
        setChatInput(query)
    }

    return (
        <main className="flex min-h-screen max-h-screen">
            <div className="grid w-full md:grid-cols-2 relative">
                <TutorialCard />
                <div
                    className={`flex flex-col w-full max-h-full max-w-[640px] 2xl:max-w-[800px] mx-auto px-4 overflow-auto col-span-2`}
                >
                    <NavBar 
                        onClear={handleClearChat}
                        canClear={messages.length > 0}
                    />
                    {error && (
                        <ErrorMessage
                            title="Error"
                            message={typeof error === 'string' ? error : 'An error occurred'}
                            onRetry={retry}
                            onDismiss={() => setError(undefined)}
                        />
                    )}
                    <Chat
                        messages={messages}
                        isLoading={isGenerateResponsePending}
                        onExampleClick={handleExampleClick}
                        hasApiKey={e2bApiKey.length > 0 && (languageModelConfiguration.apiKey?.length ?? 0) > 0}
                        hasServers={serverClients.length > 0}
                        streamingContent={streamingContent}
                    />
                    <ChatInput
                        isErrored={error !== undefined}
                        isLoading={isClientsLoading || isGenerateResponsePending}
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
                        <ApiKeySettings
                            e2bApiKey={e2bApiKey}
                            onE2bApiKeyChange={setE2bApiKey}
                            languageModel={languageModelConfiguration}
                            onLanguageModelChange={handleLanguageModelChange}
                        />
                        <ModelPicker
                            models={modelsList.models}
                            languageModel={languageModelConfiguration}
                            onLanguageModelChange={handleLanguageModelChange}
                        />
                    </ChatInput>
                    <Footer serverClients={serverClients} />
                </div>
            </div>
        </main>
    )
}
