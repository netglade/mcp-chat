import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion.tsx'
import { ExternalLink, ShieldCheck, InfoIcon, Lightbulb, Mail } from 'lucide-react'

export const TutorialCard = () => {
    return <div className="absolute top-0 right-0 h-full w-[320px] 2xl:w-[400px] invisible xl:visible flex flex-col p-4">
        <div className="shadow-md rounded-2xl bg-background border p-4">
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h1 className="whitespace-pre text-xl font-normal text-primary/90 flex items-center gap-2">
                            <InfoIcon className="h-5 w-5 text-primary/90" /> About MCP Chat
                        </h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-6">
                            {/* About MCP Section */}
                            <div className="space-y-3">
                                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                                    <Lightbulb className="h-4 w-4 text-amber-500" />
                                    What are MCP Tools?
                                </h2>
                                <p className="text-sm text-foreground/70">
                                    Model Context Protocol (MCP) tools extend AI capabilities beyond text, allowing direct interaction with databases, web services, and other tools.
                                </p>
                            </div>
                            
                            {/* Resources Section */}
                            <div className="space-y-3">
                                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    Resources
                                </h2>
                                <div className="space-y-2">
                                    <a href=" https://www.netglade.cz/en/blog/bringing-mcps-to-the-cloud-how-we-won-the-e2b-hackathon"
                                        target="_blank"
                                        className="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-400 hover:underline">
                                        <ExternalLink className="h-3 w-3" />
                                        Blog post about MCP Chat
                                    </a>
                                    <a href="https://github.com/modelcontextprotocol/servers"
                                        target="_blank"
                                        className="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-400 hover:underline">
                                        <ExternalLink className="h-3 w-3" />
                                        Discover MCP Servers on GitHub
                                    </a>
                                </div>
                            </div>

                            {/* Privacy Notice */}
                            <div className="space-y-3">
                                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                                    <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    Privacy & Security
                                </h2>
                                <div className="rounded-md bg-muted/40 p-3">
                                    <div className="space-y-2 text-xs text-foreground/70">
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

                            {/* Contact Us Section */}
                            <div className="space-y-3">
                                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                                    <Mail className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Contact us
                                </h2>
                                <div className="space-y-2 text-xs text-foreground/70">
                                    <p>
                                        Want to integrate MCPs into your product, talk more about AI agents, or just have a chat with us?
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <a href="https://www.netglade.cz" target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-400 hover:underline">
                                        <ExternalLink className="h-3 w-3" />
                                        Visit our website
                                    </a>
                                    <a href="mailto:vacha@netglade.cz" className="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-400 hover:underline">
                                        <Mail className="h-3 w-3" />
                                        vacha@netglade.cz
                                    </a>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
}
