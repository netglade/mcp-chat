import {Button} from './ui/Button'
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,} from './ui/DropdownMenu'
import {Input} from './ui/Input'
import {Label} from './ui/Label'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from './ui/Tooltip'
import {LLMModelConfig} from '@/types/llmModel'
import {Settings2} from 'lucide-react'

export function Settings({
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
                            <Button variant="ghost" size="icon" className="text-muted-foreground h-6 w-6 rounded-sm relative">
                                <Settings2 className="h-4 w-4" />
                                {isIncomplete && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />}
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>LLM settings</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="start">
                <div className="flex flex-col gap-2 px-2 py-2">
                    <Label htmlFor="apiKey">E2B API Key</Label>
                    <Input
                        name="apiKey"
                        type="password"
                        required={true}
                        defaultValue={e2bApiKey}
                        onChange={(e) =>
                            onE2bApiKeyChange(e.target.value)
                        }
                        className="text-sm"
                    />
                </div>
                <div className="flex flex-col gap-2 px-2 py-2">
                    <Label htmlFor="apiKey">Model API Key</Label>
                    <Input
                        name="apiKey"
                        type="password"
                        required={true}
                        defaultValue={languageModel.apiKey}
                        onChange={(e) =>
                            onLanguageModelChange({
                                apiKey:
                                    e.target.value.length > 0 ? e.target.value : undefined,
                            })
                        }
                        className="text-sm"
                    />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
