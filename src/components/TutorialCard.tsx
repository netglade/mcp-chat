import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion.tsx'
import { ExternalLink, ShieldCheck } from 'lucide-react'
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
                                <li>Click the tools icon <HammerIcon className="h-4 w-4 inline text-muted-foreground" /> to add a new MCP server connection</li>
                                <li>When you see <LoaderCircle className="h-4 w-4 inline text-muted-foreground animate-spin" />, wait for the server to start</li>
                                <li>Start chatting in the message box below!</li>
                            </ol>

                            {/* Resources Section */}
                            <div className="space-y-3">
                                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Resources
                                </h2>
                                <div className="space-y-2">
                                    <a href="https://github.com/modelcontextprotocol/servers"
                                        target="_blank"
                                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-500 hover:underline">
                                        <ExternalLink className="h-3 w-3" />
                                        Blog post about MCP Chat
                                    </a>
                                    <a href="https://github.com/topics/mcp-server"
                                        target="_blank"
                                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-500 hover:underline">
                                        <ExternalLink className="h-3 w-3" />
                                        Discover MCP Servers on GitHub
                                    </a>
                                </div>
                            </div>

                            {/* Privacy Notice */}
                            <div className="space-y-3">
                                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                                    <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-500" />
                                    Privacy & Security
                                </h2>
                                <div className="rounded-md bg-muted/50 p-3">
                                    <div className="space-y-2 text-xs text-muted-foreground">
                                        <p>
                                            This is a client-side application - all sensitive data is stored in your browser's local storage:
                                        </p>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li>API keys are only sent directly to their respective services (E2B, model providers)</li>
                                            <li>MCP configurations and environment variables are only sent to E2B sandbox</li>
                                            <li>We do not store or transmit any of your data to our servers</li>
                                        </ul>
                                        <p className="italic">
                                            You can verify this yourself using browser Developer Tools (Network tab).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
}
