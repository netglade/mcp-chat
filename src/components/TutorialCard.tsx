import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion.tsx'

export const TutorialCard = () => {
    return <div className="absolute top-0 left-0 h-full w-[320px] invisible xl:visible flex flex-col p-4">
        <div className="shadow-md rounded-2xl bg-background border p-4">
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <h1 className="whitespace-pre text-2xl font-bold">
                            💡 Help
                        </h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
}
