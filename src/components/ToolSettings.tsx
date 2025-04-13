import { McpServerClient } from '@/types/mcpServer'
import { Button } from './ui/Button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/Dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/DropdownMenu'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/Tooltip'
import { LoaderCircle, PlusIcon, TrashIcon, Settings2, Terminal, HammerIcon, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Spinner } from '@/components/ui/Spinner.tsx'
import presetsList from '@/lib/presets.json'

type ToolSettingsProps = {
    serverClients: McpServerClient[]
    onAddServerAsync: (args: {
        name: string
        command: string
        envs: Record<string, string>
    }) => Promise<void>
    isAddServerPending: boolean
    onRemoveServerAsync: (serverId: string) => Promise<void>
    isRemoveServerPending: boolean
}

export function ToolSettings({
    serverClients,
    onAddServerAsync,
    isAddServerPending,
    onRemoveServerAsync,
    isRemoveServerPending,
}: ToolSettingsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTool, setSelectedTool] = useState<McpServerClient | null>(null)
    const [newToolName, setNewToolName] = useState('')
    const [newToolCommand, setNewToolCommand] = useState('')
    const [newToolEnvs, setNewToolEnvs] = useState<{ key: string, value: string }[]>([])

    // Determine the overall status of tools
    const hasErroredTools = serverClients.some(client => client.state === 'error')
    const activeToolsCount = serverClients.filter(client => client.state === 'running').length

    const handleAddEnv = () => {
        setNewToolEnvs((prev) => ([
            ...prev,
            { key: '', value: '' },
        ]))
    }

    const handleRemoveEnv = (index: number) => {
        setNewToolEnvs((prev) => {
            const newEnvs = [...prev]
            newEnvs.splice(index, 1)
            return newEnvs
        })
    }

    const handleUpdateEnv = (index: number, key: string, value: string) => {
        setNewToolEnvs((prev) => {
            const newEnvs = [...prev]
            newEnvs[index] = { key, value }
            return newEnvs
        })
    }

    const handleOpenTool = (tool: McpServerClient) => {
        setSelectedTool(tool)
        setIsOpen(true)
    }

    const handleCreateNew = () => {
        setSelectedTool(null)
        setNewToolName('')
        setNewToolCommand('')
        setNewToolEnvs([])
        setIsOpen(true)
    }

    const handleDeleteTool = async () => {
        if (selectedTool) {
            await onRemoveServerAsync(selectedTool.id)
            setIsOpen(false)
        }
    }

    const handleAddTool = async (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (newToolName.trim() && newToolCommand.trim()) {
            const envs = {} as Record<string, string>
            for (const { key, value } of newToolEnvs) {
                if (key.trim() && value.trim()) {
                    envs[key] = value
                }
            }

            await onAddServerAsync({
                name: newToolName,
                command: newToolCommand,
                envs,
            })
            setIsOpen(false)
        }
    }

    const handleSetPreset = (indexString: string) => {
        const index = parseInt(indexString, 10)
        const preset = presetsList.presets[index]

        setNewToolName(preset.name)
        setNewToolCommand(preset.command)
        setNewToolEnvs(Object.entries(preset.envs).map(([key, value]) => ({ key, value })))
    }

    return (
        <>
            <DropdownMenu>
                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"
                                    className="text-muted-foreground hover:text-foreground hover:bg-accent h-6 w-6 rounded-sm transition-colors relative">
                                    <HammerIcon className="h-4 w-4" />
                                    {hasErroredTools && (
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                                    )}
                                    {activeToolsCount > 0 && (
                                        <span className="absolute -bottom-1 -right-1 flex items-center justify-center min-w-[14px] h-[14px] text-[10px] font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full px-[2px]">
                                            {activeToolsCount}
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>MCP Tools</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="start" className="w-72">
                    <div className="flex flex-col gap-4 p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium mb-1">MCP Tools</h4>
                                <p className="text-xs text-muted-foreground">Manage your MCP tools</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1"
                                onClick={handleCreateNew}
                            >
                                <PlusIcon className="h-4 w-4" />
                                Add MCP
                            </Button>
                        </div>

                        <div className="max-h-[280px] overflow-y-auto rounded-lg border bg-muted/40">
                            {serverClients && serverClients.length > 0 ? (
                                <ul className="divide-y divide-border">
                                    {serverClients.map((client) => (
                                        <li
                                            key={client.id}
                                            className="flex items-center justify-between p-3 hover:bg-accent/50 cursor-pointer transition-colors"
                                            onClick={() => handleOpenTool(client)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background">
                                                    <Terminal className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{client.configuration.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {client.state === 'running' ? 'Connected' : 'Disconnected'}
                                                    </p>
                                                </div>
                                            </div>
                                            {client.state === 'starting' ? (
                                                <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
                                            ) : (
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        client.state === 'running'
                                                            ? 'bg-green-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
                                    <Settings2 className="h-8 w-8 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">No MCP tools configured</p>
                                        <p className="text-xs text-muted-foreground">Add an MCP tool to get started</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Tool Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
                    {selectedTool ? (
                        // Edit/View Tool Dialog
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Terminal className="h-5 w-5" />
                                    {selectedTool.configuration.name}
                                </DialogTitle>
                                <DialogDescription>View and manage MCP tool configuration</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4 overflow-y-auto flex-1 pr-1">
                                <div className="space-y-2">
                                    <Label>Command</Label>
                                    <code className="block w-full rounded-lg bg-muted p-3 text-sm font-mono overflow-auto whitespace-pre-wrap break-all max-h-[120px]">
                                        {selectedTool.configuration.command}
                                    </code>
                                </div>

                                {Object.keys(selectedTool.configuration.envs).length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Environment Variables</Label>
                                        <div className="rounded-lg border divide-y">
                                            {Object.entries(selectedTool.configuration.envs).map(([key, value]) => (
                                                <div key={key} className="flex items-center p-2 text-sm overflow-hidden">
                                                    <span className="font-medium min-w-[120px] flex-shrink-0">{key}</span>
                                                    <span className="text-muted-foreground truncate overflow-hidden text-ellipsis flex-1" title={value}>
                                                        {value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteTool}
                                    disabled={isRemoveServerPending}
                                >
                                    {isRemoveServerPending ? (
                                        <Spinner className="h-4 w-4" />
                                    ) : (
                                        <>
                                            <TrashIcon className="h-4 w-4 mr-2" />
                                            Remove MCP
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </>
                    ) : (
                        // Add New Tool Dialog
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl">Add New MCP Tool</DialogTitle>
                                <DialogDescription>
                                    Add any existing <a href="https://github.com/modelcontextprotocol/servers"
                                        target="_blank"
                                        className="inline-flex items-center gap-1 pl-1 text-sm text-blue-600 dark:text-blue-500 hover:underline">
                                        <ExternalLink className="h-3 w-3" />
                                        MCP server.
                                    </a>
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleAddTool} className="space-y-4 flex flex-col flex-1 overflow-hidden">
                                <div className="space-y-4 pb-4 overflow-y-auto pr-1">
                                    {/* Quick Start Section */}
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="flex items-center gap-1.5 shrink-0">
                                            <span>💡</span>
                                            <span>Quick Start:</span>
                                        </span>
                                        <div className="flex items-center gap-3">
                                            {presetsList.presets.map((preset, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleSetPreset(index.toString())}
                                                    className="text-blue-600 dark:text-blue-500 hover:underline whitespace-nowrap"
                                                >
                                                    {preset.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Basic Configuration */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name" className="text-sm font-medium">Tool Name</Label>
                                            <p className="text-xs text-muted-foreground mb-2">A descriptive name for your tool</p>
                                            <Input
                                                id="name"
                                                value={newToolName}
                                                onChange={(e) => setNewToolName(e.target.value)}
                                                placeholder="e.g., Python REPL, Node.js Server..."
                                                className="font-medium"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="command" className="text-sm font-medium">Command</Label>
                                            <p className="text-xs text-muted-foreground mb-2">The command to start the MCP server</p>
                                            <Textarea
                                                id="command"
                                                value={newToolCommand}
                                                onChange={(e) => setNewToolCommand(e.target.value)}
                                                placeholder="e.g., npx -y @modelcontextprotocol/..."
                                                className="font-mono text-sm min-h-[80px]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Environment Variables */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-sm font-medium">Environment Variables</Label>
                                                <p className="text-xs text-muted-foreground">Add environment variables for the MCP server</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddEnv}
                                                className="h-8 gap-1.5"
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                                Add Variable
                                            </Button>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            {newToolEnvs.map((env, index) => (
                                                <div key={index} className="group flex gap-2 items-center">
                                                    <Input
                                                        placeholder="Variable name"
                                                        value={env.key}
                                                        onChange={(e) =>
                                                            handleUpdateEnv(index, e.target.value, env.value)
                                                        }
                                                        className="font-mono text-sm flex-1"
                                                    />
                                                    <Input
                                                        placeholder="Value"
                                                        value={env.value}
                                                        onChange={(e) =>
                                                            handleUpdateEnv(index, env.key, e.target.value)
                                                        }
                                                        type="password"
                                                        className="font-mono text-sm flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveEnv(index)}
                                                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={isAddServerPending || !newToolName.trim() || !newToolCommand.trim()}>
                                        {isAddServerPending ? (
                                            <Spinner className="h-4 w-4 mr-2" />
                                        ) : (
                                            <Terminal className="h-4 w-4 mr-2" />
                                        )}
                                        Add MCP Tool
                                    </Button>
                                </DialogFooter>
                            </form>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
