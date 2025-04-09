// import { addMcp, getMcps } from './actions/publish'
import { Chat } from '@/components/Chat'
import { ChatInput } from '@/components/ChatInput'
import { ToolSettings } from '@/components/ToolSettings'
import { NavBar } from '@/components/NavBar'
import { SetStateAction, useState } from 'react'
import { toMessageImage } from '@/lib/messages'
import type { Message } from '@/types/message'
import { useLocalStorage } from 'usehooks-ts'
import type { LLMModelConfig } from '@/types/llmModel'
// import { AuthViewType, useAuth } from '@/lib/auth'
// import { Message, toAISDKMessages, toMessageImage } from '@/lib/messages'
// import { LLMModelConfig } from '@/lib/models'
import modelsList from '@/lib/models.json'
import { ModelPicker } from '@/components/ModelPicker'
import { ApiKeySettings } from '@/components/ApiKeySettings.tsx'
import { useMcpTools } from '@/hooks/useMcpTools.ts'
// import { FragmentSchema } from '@/lib/schema'
// import templates, { TemplateId } from '@/lib/templates'
// import { ExecutionResult } from '@/lib/types'
// import { DeepPartial } from 'ai'
// import { usePostHog } from 'posthog-js/react'
import { useChat } from '@/hooks/useChat.ts'

export default function App() {
    // useEffect(() => {
    //   addMcp({
    //     name: 'postgres',
    //     command:
    //         'npx @modelcontextprotocol/server-postgres postgresql://postgres.awlyjmwlluxpdrnpqnpi:utensils.buddha.EXPELLED@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
    //     envs: {},
    //   })
    // }, [])

    const [chatInput, setChatInput] = useLocalStorage('chat', '')
    const [files, setFiles] = useState<File[]>([])
    // const [selectedTemplate, setSelectedTemplate] = useState<'auto' | TemplateId>(
    //     'auto',
    // )
    const [languageModel, setLanguageModel] = useLocalStorage<LLMModelConfig>(
        'languageModel',
        {
            model: 'claude-3-5-sonnet-latest',
        },
    )

    // // const posthog = usePostHog()

    const [messages, setMessages] = useState<Message[]>([])
    // const [isAuthDialogOpen, setAuthDialog] = useState(false)
    // const [authView, setAuthView] = useState<AuthViewType>('sign_in')
    // const [isRateLimited, setIsRateLimited] = useState(false)
    // const { session, apiKey } = useAuth(setAuthDialog, setAuthView)

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
        languageModelConfig: languageModel,
        extendOrRestartServer,
    })

    const currentModel = modelsList.models.find(
        (model) => model.id === languageModel.model,
    )
    // const currentTemplate =
    //     selectedTemplate === 'auto'
    //         ? templates
    //         : { [selectedTemplate]: templates[selectedTemplate] }
    // const lastMessage = messages[messages.length - 1]
    //
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(undefined)
    const [abortController, setAbortController] = useState(
        null as AbortController | null,
    )

    const submit = async ({ messages }: { messages: Message[] }) => {
        console.log(messages)
        setIsLoading(true)
        setError(undefined)

        const controller = new AbortController()
        setAbortController(controller)

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
        } finally {
            setAbortController(null)
            setIsLoading(false)
        }
    }

    const stop = () => {
        if (abortController) {
            // Abort the ongoing fetch
            abortController.abort()

            // You might want to reset states here as well
            setIsLoading(false)

            // Optional: provide user feedback
            console.log('Request cancelled by user')
        }
    }

    // useEffect(() => {
    //   if (object) {
    //     setFragment(object)
    //     const content: Message['content'] = [
    //       { type: 'text', text: object.commentary || '' },
    //       { type: 'code', text: object.code || '' },
    //     ]

    //     if (!lastMessage || lastMessage.role !== 'assistant') {
    //       addMessage({
    //         role: 'assistant',
    //         content,
    //         object,
    //       })
    //     }

    //     if (lastMessage && lastMessage.role === 'assistant') {
    //       setMessage({
    //         content,
    //         object,
    //       })
    //     }
    //   }
    // }, [object])

    // function setMessage(message: Partial<Message>, index?: number) {
    //   setMessages((previousMessages) => {
    //     const updatedMessages = [...previousMessages]
    //     updatedMessages[index ?? previousMessages.length - 1] = {
    //       ...previousMessages[index ?? previousMessages.length - 1],
    //       ...message,
    //     }
    //
    //     return updatedMessages
    //   })
    // }

    async function handleSubmitAuth(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // if (isLoading) {
        //   stop()
        // }

        const content: Message['content'] = [{ type: 'text', text: chatInput }]
        const images = await toMessageImage(files)

        if (images.length > 0) {
            images.forEach((image) => {
                content.push({ type: 'image', image })
            })
        }

        const updatedMessages = addMessage({
            role: 'user',
            content,
        })

        submit({
            messages: updatedMessages,
        })

        setChatInput('')
        setFiles([])

        // posthog.capture('chat_submit', {
        //   template: selectedTemplate,
        //   model: languageModel.model,
        // })
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

    function handleFileChange(change: SetStateAction<File[]>) {
        setFiles(change)
    }

    function handleLanguageModelChange(e: LLMModelConfig) {
        setLanguageModel({ ...languageModel, ...e })
    }

    // function handleSocialClick(target: 'github' | 'x' | 'discord') {
    //   if (target === 'github') {
    //     window.open('https://github.com/e2b-dev/fragments', '_blank')
    //   } else if (target === 'x') {
    //     window.open('https://x.com/e2b_dev', '_blank')
    //   } else if (target === 'discord') {
    //     window.open('https://discord.gg/U7KEcGErtQ', '_blank')
    //   }
    //
    //   posthog.capture(`${target}_click`)
    // }

    function handleClearChat() {
        // stop()
        // setChatInput('')
        // setFiles([])
        // setMessages([])
        // setIsPreviewLoading(false)
    }

    // function handleUndo() {
    //   setMessages((previousMessages) => [...previousMessages.slice(0, -2)])
    //   setCurrentPreview({ fragment: undefined, result: undefined })
    // }

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
                        isLoading={isLoading}
                    />
                    <ChatInput
                        retry={retry}
                        isErrored={error !== undefined}
                        isLoading={isLoading}
                        isRateLimited={false}
                        stop={stop}
                        input={chatInput}
                        handleInputChange={handleSaveInputChange}
                        handleSubmit={handleSubmitAuth}
                        isMultiModal={currentModel?.multiModal || false}
                        handleFileChange={handleFileChange}
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
                            languageModel={languageModel}
                            onLanguageModelChange={handleLanguageModelChange}
                        />
                        <ApiKeySettings
                            e2bApiKey={e2bApiKey}
                            onE2bApiKeyChange={setE2bApiKey}
                            languageModel={languageModel}
                            onLanguageModelChange={handleLanguageModelChange}
                        />
                    </ChatInput>
                </div>
            </div>
        </main>
    )
}
