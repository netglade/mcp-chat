import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion.tsx'

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
                        1. Add you e2b API key and the API key for your selcted model in LLM Settings.
                    </AccordionContent>
                    <AccordionContent>
                        2. Create an MCP server connection in the Tool Settings (you can add more any time).
                    </AccordionContent>
                    <AccordionContent>
                        3. Wait for the MCP server to load.
                    </AccordionContent>
                    <AccordionContent>
                        4. Chat away!
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
}
