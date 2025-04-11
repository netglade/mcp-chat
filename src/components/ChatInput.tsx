import { Button } from '@/components/ui/Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import { ArrowUp } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { Spinner } from '@/components/ui/Spinner.tsx'

export function ChatInput({
    isErrored,
    isLoading = true,
    input,
    handleInputChange,
    handleSubmit,
    children,
}: {
    isErrored: boolean
    isLoading: boolean
    input: string
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    children: React.ReactNode
}) {
    function onEnter(e: React.KeyboardEvent<HTMLFormElement>) {
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            if (e.currentTarget.checkValidity()) {
                handleSubmit(e)
            } else {
                e.currentTarget.reportValidity()
            }
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            onKeyDown={onEnter}
            className="mb-2 mt-auto flex flex-col bg-background"
        >
            <div className="relative">
                <div className="shadow-md rounded-2xl relative z-10 bg-background border">
                    <div className="flex items-center px-3 py-2 gap-1">{children}</div>
                    <div className="relative px-3 py-2">
                        <TextareaAutosize
                            autoFocus={true}
                            minRows={1}
                            maxRows={5}
                            className="text-normal resize-none ring-0 bg-inherit w-full m-0 outline-none pr-12"
                            required={true}
                            placeholder="Chat with your MCP tools..."
                            value={input}
                            onChange={handleInputChange}
                        />
                        <div className="absolute right-3 bottom-2">
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            disabled={isErrored || isLoading}
                                            variant="default"
                                            size="icon"
                                            type="submit"
                                            className="rounded-xl h-8 w-8 bg-primary/90 hover:bg-primary transition-colors"
                                        >
                                            {isLoading ? 
                                                <Spinner className="h-4 w-4 text-primary-foreground" /> : 
                                                <ArrowUp className="h-4 w-4" />
                                            }
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Send message</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
                Assistant uses MCP to connect to MCP tools
            </p>
        </form>
    )
}
