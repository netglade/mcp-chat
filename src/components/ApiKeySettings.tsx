import { Button } from './ui/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/DropdownMenu'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/Tooltip'
import { LLMModelConfig } from '@/types/llmModel'
import { Settings2, KeyRound, ShieldCheck } from 'lucide-react'

export function ApiKeySettings({
    languageModel,
    onLanguageModelChange,
    e2bApiKey,
    onE2bApiKeyChange,
}: {
    languageModel: LLMModelConfig
    onLanguageModelChange: (model: LLMModelConfig) => void
    e2bApiKey: string
    onE2bApiKeyChange: (newValue: string) => void
}) {
    const isIncomplete = !e2bApiKey || !languageModel.apiKey

    return (
        <DropdownMenu>
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"
                                    className="text-muted-foreground hover:text-foreground hover:bg-accent h-6 w-6 rounded-sm transition-colors relative">
                                <Settings2 className="h-4 w-4" />
                                {isIncomplete &&
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />}
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>API Keys</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="start" className="w-72">
                <div className="flex flex-col gap-8 p-4">
                    <div>
                        <h4 className="font-medium mb-1">API Keys</h4>
                        <p className="text-xs text-muted-foreground">Configure your API keys for MCP tools</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <KeyRound className="h-4 w-4 text-primary" />
                                <Label htmlFor="e2bApiKey" className="text-sm font-medium">E2B API Key</Label>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">Required to run MCP tools on E2B</p>
                            <Input
                                id="e2bApiKey"
                                name="e2bApiKey"
                                type="password"
                                required={true}
                                placeholder="Enter your E2B API key"
                                defaultValue={e2bApiKey}
                                onChange={(e) => onE2bApiKeyChange(e.target.value)}
                                className="font-mono text-sm"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                <Label htmlFor="modelApiKey" className="text-sm font-medium">Model API Key</Label>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">OpenAI or Anthropic API key</p>
                            <Input
                                id="modelApiKey"
                                name="modelApiKey"
                                type="password"
                                required={true}
                                placeholder="Enter your OpenAI orAnthropic API key"
                                defaultValue={languageModel.apiKey}
                                onChange={(e) =>
                                    onLanguageModelChange({
                                        apiKey: e.target.value.length > 0 ? e.target.value : undefined,
                                    })
                                }
                                className="font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
