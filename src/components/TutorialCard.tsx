import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion.tsx'
import { ExternalLink } from 'lucide-react'
import { Settings2, HammerIcon, LoaderCircle } from 'lucide-react'

export const TutorialCard = () => {
    return <div className="absolute top-0 left-0 h-full w-[320px] 2xl:w-[400px] invisible xl:visible flex flex-col p-4">
        <div className="shadow-md rounded-2xl bg-background border p-4">
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h1 className="whitespace-pre text-xl font-bold flex items-center gap-2">
                            <span>💡</span> Getting Started
                        </h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-6">
                            {/* Setup Guide */}
                            <ol className="list-decimal pl-5 space-y-4 pt-2">
                                <li>Click the settings icon <Settings2 className="h-4 w-4 inline text-muted-foreground" /> to add your E2B API key and model API key</li>
                                <li>Click the tools icon <HammerIcon className="h-4 w-4 inline text-muted-foreground" /> to create a new MCP server connection</li>
                                <li>When you see <LoaderCircle className="h-4 w-4 inline text-muted-foreground animate-spin" />, wait for the server to load</li>
                                <li>Start chatting in the message box below!</li>
                            </ol>

                            {/* Resources Section */}
                            <div className="space-y-3">
                                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Resources
                                </h2>
                                <div className="space-y-2">
                                    <a href="https://github.com/modelcontextprotocol/servers"
                                       className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-500 hover:underline">
                                        <ExternalLink className="h-3 w-3" />
                                        Blog post about MCP Chat
                                    </a>
                                    <a href="https://github.com/modelcontextprotocol/servers"
                                       className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-500 hover:underline">
                                        <ExternalLink className="h-3 w-3" />
                                        Discover MCP Servers on GitHub
                                    </a>
                                </div>
                            </div>

                            {/* Privacy Notice */}
                            <div className="text-xs text-muted-foreground italic border-t pt-4">
                                We do not store any of your data. Your API keys are sent directly from your browser to E2B servers.
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
}
