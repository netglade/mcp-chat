import { Button } from '@/components/ui/Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import { MessageSquareCode, CircleDot, XCircle } from 'lucide-react'

export function NavBar({
    onClear,
    canClear,
}: {
    onClear: () => void
    canClear: boolean
}) {
    return (
        <nav className="w-full flex bg-background py-4 border-b sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <MessageSquareCode className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold">Chat & MCPs</h1>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                        <CircleDot className="h-3 w-3 text-green-500" />
                        <span>Connected</span>
                    </div>
                </div>
                {canClear && (
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={onClear}
                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                                    >
                                        <XCircle className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Clear chat history</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
            </div>
        </nav>
    )
}
