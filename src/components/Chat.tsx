import { LoaderIcon, HammerIcon, Settings2, CheckIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Message } from '@/types/message'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { EmptyState } from '@/components/EmptyState'
import { SetupGuide } from '@/components/SetupGuide'

export function Chat({
    messages,
    isLoading,
    onExampleClick,
    hasApiKey = false,
    hasServers = false,
}: {
    messages: Message[]
    isLoading: boolean
    onExampleClick?: (query: string) => void
    hasApiKey?: boolean
    hasServers?: boolean
}) {
    const [expandedCalls, setExpandedCalls] = useState(
        {} as Record<string, boolean>,
    )

    const toggleExpand = (id: string) => {
        setExpandedCalls((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    useEffect(() => {
        const chatContainer = document.getElementById('chat-container')
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight
        }
    }, [JSON.stringify(messages)])

    // Show setup guide if API keys or servers are not set up
    if (messages.length === 0 && !isLoading && (!hasApiKey || !hasServers)) {
        return <SetupGuide hasApiKey={hasApiKey} hasServers={hasServers} />
    }

    // Only show EmptyState if API keys are set and at least one server is connected
    if (messages.length === 0 && !isLoading && onExampleClick && hasApiKey && hasServers) {
        return <EmptyState onExampleClick={onExampleClick} />
    }

    return (
        <div
            id="chat-container"
            className="flex flex-col overflow-y-auto max-h-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700"
        >
            <div className="flex-1 flex flex-col gap-4 pt-4 pb-12">
                {messages.map((message: Message, index: number) => (
                    <div
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        key={index}
                    >
                        <div
                            className={`flex flex-col max-w-[85%] md:max-w-[75%] shadow-sm
                            ${message.role !== 'user' 
                                ? 'bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 py-4 px-5 rounded-2xl gap-4' 
                                : 'bg-primary text-primary-foreground py-3 px-4 rounded-2xl gap-3'
                            }`}
                        >
                            {message.toolCalls && message.toolCalls.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-1.5">
                                        {message.toolCalls.map((toolCall) => (
                                            <div 
                                                key={toolCall.id} 
                                                className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden"
                                            >
                                                <div
                                                    className="flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-700/50 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700/70 transition-colors"
                                                    onClick={() => toggleExpand(toolCall.id)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <HammerIcon className="h-4 w-4 text-amber-500" />
                                                        <span className="text-sm font-medium">{toolCall.name}</span>
                                                    </div>
                                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                        {expandedCalls[toolCall.id] ? '▲' : '▼'}
                                                    </span>
                                                </div>

                                                {expandedCalls[toolCall.id] && (
                                                    <div className="px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50">
                                                        {toolCall.arguments.map((argument) => (
                                                            <div key={argument.name} className="flex py-0.5">
                                                                <span className="text-zinc-500 dark:text-zinc-400 mr-2 font-mono text-xs">
                                                                    {argument.name}:
                                                                </span>
                                                                <span className="text-zinc-700 dark:text-zinc-300 font-mono text-xs">
                                                                    {argument.value}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {message.content.map((content, id) => {
                                if (content.type === 'text') {
                                    return (
                                        <div key={id} className="prose dark:prose-invert max-w-none text-sm [&>p]:m-0 [&>ul]:my-2 [&>ol]:my-2 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:whitespace-pre-wrap [&_code]:break-words">
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkGfm]}
                                            >
                                                {content.text.trim()}
                                            </ReactMarkdown>
                                        </div>
                                    )
                                }
                                if (content.type === 'image') {
                                    return (
                                        <img
                                            key={id}
                                            src={content.image}
                                            alt="fragment"
                                            className="rounded-lg bg-white max-w-full h-auto"
                                        />
                                    )
                                }
                            })}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start pt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>AI is thinking...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
