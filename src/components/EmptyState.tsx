import { Database, Globe, Github, Calculator } from 'lucide-react'

type ExampleQuery = {
    icon: React.ReactNode
    title: string
    query: string
}

export function EmptyState({ onExampleClick }: { onExampleClick: (query: string) => void }) {
    const exampleQueries: ExampleQuery[] = [
        {
            icon: <Database className="h-5 w-5 text-blue-500" />,
            title: "Postgres",
            query: "Show me the top 5 most recent users in the database"
        },
        {
            icon: <Globe className="h-5 w-5 text-amber-500" />,
            title: "Brave Search",
            query: "What are the most popular JavaScript frameworks in 2025?"
        },
        {
            icon: <Github className="h-5 w-5 text-slate-600 dark:text-slate-300" />,
            title: "GitHub",
            query: "Find my repositories with the most stars"
        },
        {
            icon: <Calculator className="h-5 w-5 text-green-500" />,
            title: "E2B Calculator",
            query: "Calculate the compound interest on $1000 at 5% for 10 years. Write python code and execute it."
        }
    ]

    return (
        <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="max-w-md mx-auto text-center mb-6">
                <p className="text-sm text-muted-foreground">
                    Try one of these examples to see MCP tools in action
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                {exampleQueries.map((example, index) => (
                    <button
                        key={index}
                        onClick={() => onExampleClick(example.query)}
                        className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent/10 transition-colors text-left"
                    >
                        <div className="flex-shrink-0">
                            {example.icon}
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-medium mb-1">{example.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{example.query}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
} 