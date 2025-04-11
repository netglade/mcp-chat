import { Button } from '@/components/ui/Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import { Github, MessageSquareCode, Trash2 } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export function NavBar({
    onClear,
    canClear,
}: {
    onClear?: () => void
    canClear?: boolean
}) {
    return (
        <nav className="w-full flex bg-background py-4 border-b sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <MessageSquareCode className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold">Chat & MCPs</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {canClear && onClear && (
                        <TooltipProvider>
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onClear}
                                        className="text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors gap-1.5"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span className="text-xs">Clear chat</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Clear conversation history</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                                    asChild
                                >
                                    <a href="https://github.com/netglade/mcp-chat" target="_blank" rel="noopener noreferrer">
                                        <Github className="h-5 w-5" />
                                    </a>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>GitHub Repo</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}
