import { Button } from '@/components/ui/Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import { ArrowUp } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { Spinner } from '@/components/ui/Spinner.tsx'

export function ChatInput({
    retry,
    isErrored,
    isLoading = true,
    input,
    handleInputChange,
    handleSubmit,
    children,
}: {
    retry: () => void
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
            {isErrored && (
                <div
                    className={`flex items-center p-1.5 text-sm font-medium mx-4 mb-10 rounded-xl bg-red-400/10 text-red-400`}
                >
                    <span className="flex-1 px-1.5">
                        An unexpected error has occurred.
                    </span>
                    <button
                        className={`px-2 py-1 rounded-sm bg-red-400/20`}
                        onClick={retry}
                    >
                        Try again
                    </button>
                </div>
            )}
            <div className="relative">
                <div className="shadow-md rounded-2xl relative z-10 bg-background border">
                    <div className="flex items-center px-3 py-2 gap-1">{children}</div>
                    <TextareaAutosize
                        autoFocus={true}
                        minRows={1}
                        maxRows={5}
                        className="text-normal px-3 resize-none ring-0 bg-inherit w-full m-0 outline-none"
                        required={true}
                        placeholder="Chat with your tools..."
                        disabled={isErrored}
                        value={input}
                        onChange={handleInputChange}
                    />
                    <div className="flex p-3 gap-2 items-center">
                        <div>
                            <TooltipProvider>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            disabled={isErrored || isLoading}
                                            variant="default"
                                            size="icon"
                                            type="submit"
                                            className="rounded-xl h-10 w-10"
                                        >
                                            {isLoading ? <Spinner className="h-7 w-7 text-primary-foreground" /> : <ArrowUp className="h-5 w-5" />}
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
                Assistant uses the MCP protocol to connect to tools
            </p>
        </form>
    )
}
