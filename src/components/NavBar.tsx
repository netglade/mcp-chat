import { Button } from '@/components/ui/Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import { Trash } from 'lucide-react'

export function NavBar({
                           onClear,
                           canClear,
                       }: {
    onClear: () => void
    canClear: boolean
}) {
    return (
        <nav className="w-full flex bg-background py-4">
            <div className="flex flex-1 items-center">
                <h1 className="whitespace-pre text-2xl font-bold">
                    💬🛠️ Chat & MCPs
                </h1>
            </div>
            <div className="flex items-center gap-1 md:gap-4">
                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClear}
                                disabled={!canClear}
                            >
                                <Trash className="h-4 w-4 md:h-5 md:w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Clear chat</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </nav>
    )
}
