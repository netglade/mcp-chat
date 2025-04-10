import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion.tsx'
import { Link } from 'lucide-react'

export const TutorialCard = () => {
    return <div className="absolute top-0 left-0 h-full w-[320px] 2xl:w-[400px] invisible xl:visible flex flex-col p-4">
        <div className="shadow-md rounded-2xl bg-background border p-4">
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h1 className="whitespace-pre text-xl font-bold">
                            💡 Help
                        </h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-4">
                            <h1 className="whitespace-pre text-xl font-bold">
                                Guide
                            </h1>
                            <ol className="list-inside list-decimal space-y-4">
                                <li>Add you E2B API key and the API key for your selcted model in LLM Settings.</li>
                                <li>Create an MCP server connection in the Tool Settings (you can add more any
                                    time). Don't forget to set any necessary API keys.
                                </li>
                                <li>Wait for the MCP server to load.</li>
                                <li>Chat away!</li>
                            </ol>
                            <h1 className="whitespace-pre text-xl font-bold">
                                Resources
                            </h1>
                            <div>
                                <div>
                                    <a href="https://github.com/modelcontextprotocol/servers"
                                       className="font-medium text-blue-600 dark:text-blue-500 hover:underline"><Link
                                        className="w-3 h-3 inline mr-1" />Blog
                                        post
                                        about MCP Chat</a>
                                    <a href="https://github.com/modelcontextprotocol/servers"></a>
                                </div>
                                <div>
                                    <a href="https://github.com/modelcontextprotocol/servers"
                                       className="font-medium text-blue-600 dark:text-blue-500 hover:underline"><Link
                                        className="w-3 h-3 inline mr-1" />Discover MCP Servers on
                                        GitHub</a>
                                </div>
                            </div>
                            <div className="text-muted-foreground italic">
                                We do not store any of your data. Your API keys are sent directly from your browser to
                                E2B
                                servers.
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
}
