import { Mcps, McpServer } from '@/types/mcpServer'
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
// Import Textarea component
import { HammerIcon, LoaderCircle, PlusIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'

export function ToolSettings() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTool, setSelectedTool] = useState<McpServer | null>(null)
    const [newToolName, setNewToolName] = useState('')
    const [newToolCommand, setNewToolCommand] = useState('')
    const [newToolEnvs, setNewToolEnvs] = useState<Record<string, string>>({})
    const [newEnvKey, setNewEnvKey] = useState('')
    const [newEnvValue, setNewEnvValue] = useState('')

    const mcps: Mcps = { servers: [] }
    const isLoading = false

    const removeMutation = {
        mutate: (x: any) => {
        }, isPending: false,
    }

    const handleAddEnv = () => {
        if (newEnvKey.trim() && newEnvValue.trim()) {
            setNewToolEnvs((prev) => ({
                ...prev,
                [newEnvKey]: newEnvValue,
            }))
            setNewEnvKey('')
            setNewEnvValue('')
        }
    }

    const handleRemoveEnv = (key: string) => {
        setNewToolEnvs((prev) => {
            const updated = { ...prev }
            delete updated[key]
            return updated
        })
    }

    const addMutation = {
        mutate: (x: any) => {
        }, isPending: false,
    }

    const handleOpenTool = (tool: McpServer) => {
        setSelectedTool(tool)
        setIsOpen(true)
    }

    const handleCreateNew = () => {
        setSelectedTool(null)
        setNewToolName('')
        setNewToolCommand('')
        setNewToolEnvs({})
        setNewEnvKey('')
        setNewEnvValue('')
        setIsOpen(true)
    }

    const handleDeleteTool = () => {
        if (selectedTool) {
            removeMutation.mutate(selectedTool.id)
        }
    }

    const handleAddTool = (e: React.FormEvent) => {
        e.preventDefault()
        if (newToolName.trim() && newToolCommand.trim()) {
            // Note: Update your addMcp function to accept these new parameters
            addMutation.mutate({
                name: newToolName,
                command: newToolCommand,
                envs: newToolEnvs,
            })
        }
    }

    return (
        <>
            <DropdownMenu>
                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground h-6 w-6 rounded-sm"
                                >
                                    <HammerIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Tool settings</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="start" className="w-56">
                    <div className="flex flex-col gap-2 px-3 py-2">
                        <div className="flex justify-between items-center">
                            <Label className="mb-1">Tools</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={handleCreateNew}
                            >
                                <PlusIcon className="h-3 w-3 mr-1" />
                                Create
                            </Button>
                        </div>

                        {isLoading ? (
                            <div className="text-xs text-muted-foreground py-1">
                                Loading tools...
                            </div>
                        ) : (
                            <div className="max-h-40 overflow-y-auto">
                                {mcps?.servers && mcps.servers.length > 0 ? (
                                    <ul className="space-y-1">
                                        {mcps.servers.map((server) => (
                                            <li
                                                key={server.id}
                                                className="text-sm py-1 px-1 rounded cursor-pointer hover:bg-accent flex items-center justify-between"
                                                onClick={() => handleOpenTool(server)}
                                            >
                                                <span>{server.name}</span>
                                                {server.state === 'loading' ? (
                                                    <LoaderCircle className="h-3 w-3 animate-spin ml-2" />
                                                ) : (
                                                    <div
                                                        className={`w-2 h-2 rounded-full ml-2 ${
                                                            server.state === 'running'
                                                                ? 'bg-green-500'
                                                                : 'bg-red-500'
                                                        }`}
                                                    />
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-xs text-muted-foreground py-1">
                                        No tools available
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Tool Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    {selectedTool ? (
                        // Edit/View Tool Dialog
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedTool.name}</DialogTitle>
                                <DialogDescription>MCP tool</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div>
                                    <Label>Status</Label>
                                    <div className="flex items-center mt-1">
                                        {selectedTool.state === 'loading' ? (
                                            <>
                                                <LoaderCircle className="h-3 w-3 animate-spin mr-2" />
                                                <span className="capitalize">{selectedTool.state}</span>
                                            </>
                                        ) : (
                                            <>
                                                <div
                                                    className={`w-2 h-2 rounded-full mr-2 ${
                                                        selectedTool.state === 'running'
                                                            ? 'bg-green-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                />
                                                <span className="capitalize">{selectedTool.state}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label>Command</Label>
                                    <Textarea
                                        value={selectedTool.command}
                                        readOnly
                                        className="mt-1 bg-muted font-mono text-sm resize-none"
                                        rows={Math.min(
                                            8,
                                            (selectedTool.command.match(/\n/g) || []).length + 1,
                                        )}
                                    />
                                </div>

                                <div>
                                    <Label>Environment Variables</Label>
                                    {Object.keys(selectedTool.envs).length > 0 ? (
                                        <div className="mt-1 border rounded-md divide-y">
                                            {Object.entries(selectedTool.envs).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="px-3 py-2 flex justify-between items-center"
                                                >
                                                    <span className="font-mono text-xs">{key}</span>
                                                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                                        ••••••
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground mt-1">
                                            No environment variables
                                        </div>
                                    )}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteTool}
                                    disabled={removeMutation.isPending}
                                >
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    Delete Tool
                                </Button>
                                <DialogClose asChild>
                                    <Button variant="outline">Close</Button>
                                </DialogClose>
                            </DialogFooter>
                        </>
                    ) : (
                        // Create New Tool Dialog
                        <>
                            <DialogHeader>
                                <DialogTitle>Create New Tool</DialogTitle>
                                <DialogDescription>
                                    Add a new tool to your collection.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleAddTool}>
                                <div className="space-y-4 py-4">
                                    <div>
                                        <Label htmlFor="toolName">Tool Name</Label>
                                        <Input
                                            id="toolName"
                                            value={newToolName}
                                            onChange={(e) => setNewToolName(e.target.value)}
                                            placeholder="Enter tool name"
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="toolCommand">Command</Label>
                                        <Textarea
                                            id="toolCommand"
                                            value={newToolCommand}
                                            onChange={(e) => setNewToolCommand(e.target.value)}
                                            placeholder="Enter tool command"
                                            className="mt-1 font-mono text-sm resize-none"
                                            rows={Math.min(
                                                8,
                                                (newToolCommand.match(/\n/g) || []).length + 1,
                                            )}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Environment Variables</Label>
                                        {Object.keys(newToolEnvs).length > 0 && (
                                            <div className="mt-2 mb-3 border rounded-md divide-y">
                                                {Object.entries(newToolEnvs).map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="px-3 py-2 flex justify-between items-center"
                                                    >
                                                        <span className="font-mono text-xs">{key}</span>
                                                        <div className="flex items-center">
                                                            <span className="font-mono text-xs mr-2">
                                                                ••••••
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-5 w-5"
                                                                onClick={() => handleRemoveEnv(key)}
                                                            >
                                                                <TrashIcon className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex gap-2 mt-2">
                                            <Input
                                                placeholder="Key"
                                                value={newEnvKey}
                                                onChange={(e) => setNewEnvKey(e.target.value)}
                                                className="text-xs font-mono"
                                            />
                                            <Input
                                                placeholder="Value"
                                                value={newEnvValue}
                                                onChange={(e) => setNewEnvValue(e.target.value)}
                                                className="text-xs"
                                                type="password"
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                onClick={handleAddEnv}
                                                disabled={!newEnvKey.trim() || !newEnvValue.trim()}
                                                className="shrink-0"
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline" type="button">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        disabled={
                                            !newToolName.trim() ||
                                            !newToolCommand.trim() ||
                                            addMutation.isPending
                                        }
                                    >
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        Create Tool
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
