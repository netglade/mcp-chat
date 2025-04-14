import { Settings2, CheckIcon, HammerIcon } from 'lucide-react'

export function SetupGuide({ hasApiKey, hasServers }: { hasApiKey: boolean; hasServers: boolean }) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="max-w-md mx-auto text-center mb-6">
                <h2 className="text-xl font-medium mb-2">Setup Your MCP Chat</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Complete these steps to start using MCP tools
                </p>
                
                <div className="flex flex-col gap-4 items-start text-left bg-card border rounded-lg p-5">
                    <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full ${hasApiKey ? 'bg-green-500' : 'bg-primary/10'} flex items-center justify-center mt-0.5`}>
                            {hasApiKey ? (
                                <CheckIcon className="h-4 w-4 text-white" />
                            ) : (
                                <span className="text-sm font-medium text-primary">1</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-1">Add API Keys</h3>
                            <p className="text-xs text-muted-foreground">
                                Click the settings icon <Settings2 className="h-3.5 w-3.5 inline text-muted-foreground" /> to add your <a href="https://e2b.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">E2B API key</a> and OpenAI/Anthropic API key
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full ${hasServers ? 'bg-green-500' : 'bg-primary/10'} flex items-center justify-center mt-0.5`}>
                            {hasServers ? (
                                <CheckIcon className="h-4 w-4 text-white" />
                            ) : (
                                <span className="text-sm font-medium text-primary">2</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-1">Connect MCP Servers</h3>
                            <p className="text-xs text-muted-foreground">
                                Click the tools icon <HammerIcon className="h-3.5 w-3.5 inline text-muted-foreground" /> to add at least one MCP server connection
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 