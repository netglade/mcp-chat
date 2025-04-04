"use client"

import {Button} from '@/components/ui/Button'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/Tooltip'
import {ArrowUp, Square} from 'lucide-react'
import {SetStateAction, useEffect, useState} from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import {isFileInArray} from "@/lib/isFileInArray";

export function ChatInput({
                              retry,
                              isErrored,
                              isLoading,
                              isRateLimited,
                              stop,
                              input,
                              handleInputChange,
                              handleSubmit,
                              isMultiModal,
                              handleFileChange,
                              children,
                          }: {
    retry: () => void
    isErrored: boolean
    isLoading: boolean
    isRateLimited: boolean
    stop: () => void
    input: string
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isMultiModal: boolean
    handleFileChange: (change: SetStateAction<File[]>) => void
    children: React.ReactNode
}) {
    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        handleFileChange((prev) => {
            const newFiles = Array.from(e.target.files || [])
            const uniqueFiles = newFiles.filter(
                (file) => !isFileInArray(file, prev),
            )
            return [...prev, ...uniqueFiles]
        })
    }

    function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
        const items = Array.from(e.clipboardData.items);

        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault();

                const file = item.getAsFile();
                if (file) {
                    handleFileChange((prev) => {
                        if (!isFileInArray(file, prev)) {
                            return [...prev, file];
                        }
                        return prev;
                    });
                }
            }
        }
    }

    const [dragActive, setDragActive] = useState(false);

    function handleDrag(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        );

        if (droppedFiles.length > 0) {
            handleFileChange(prev => {
                const uniqueFiles = droppedFiles.filter(file => !isFileInArray(file, prev));
                return [...prev, ...uniqueFiles];
            });
        }
    }

    function onEnter(e: React.KeyboardEvent<HTMLFormElement>) {
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            if (e.currentTarget.checkValidity()) {
                handleSubmit(e)
            } else {
                e.currentTarget.reportValidity()
            }
        }
    }

    useEffect(() => {
        if (!isMultiModal) {
            handleFileChange([])
        }
    }, [isMultiModal])

    return (
        <form
            onSubmit={handleSubmit}
            onKeyDown={onEnter}
            className="mb-2 mt-auto flex flex-col bg-background"
            onDragEnter={isMultiModal ? handleDrag : undefined}
            onDragLeave={isMultiModal ? handleDrag : undefined}
            onDragOver={isMultiModal ? handleDrag : undefined}
            onDrop={isMultiModal ? handleDrop : undefined}
        >
            {isErrored && (
                <div
                    className={`flex items-center p-1.5 text-sm font-medium mx-4 mb-10 rounded-xl ${
                        isRateLimited
                            ? 'bg-orange-400/10 text-orange-400'
                            : 'bg-red-400/10 text-red-400'
                    }`}
                >
          <span className="flex-1 px-1.5">
            {isRateLimited
                ? 'You have reached your request limit for the day.'
                : 'An unexpected error has occurred.'}
          </span>
                    <button
                        className={`px-2 py-1 rounded-sm ${
                            isRateLimited ? 'bg-orange-400/20' : 'bg-red-400/20'
                        }`}
                        onClick={retry}
                    >
                        Try again
                    </button>
                </div>
            )}
            <div className="relative">
                <div className={`shadow-md rounded-2xl relative z-10 bg-background border ${
                    dragActive
                        ? 'before:absolute before:inset-0 before:rounded-2xl before:border-2 before:border-dashed before:border-primary'
                        : ''
                }`}>
                    <div className="flex items-center px-3 py-2 gap-1">{children}</div>
                    <TextareaAutosize
                        autoFocus={true}
                        minRows={1}
                        maxRows={5}
                        className="text-normal px-3 resize-none ring-0 bg-inherit w-full m-0 outline-none"
                        required={true}
                        placeholder="Chat with your tools..."
                        disabled={isErrored}
                        value={input}
                        onChange={handleInputChange}
                        onPaste={isMultiModal ? handlePaste : undefined}
                    />
                    <div className="flex p-3 gap-2 items-center">
                        <input
                            type="file"
                            id="multimodal"
                            name="multimodal"
                            accept="image/*"
                            multiple={true}
                            className="hidden"
                            onChange={handleFileInput}
                        />
                        <div className="flex items-center flex-1 gap-2">
                            {/* <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={!isMultiModal || isErrored}
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-xl h-10 w-10"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('multimodal')?.click()
                      }}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add attachments</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {files.length > 0 && filePreview} */}
                        </div>
                        <div>
                            {!isLoading ? (
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                disabled={isErrored}
                                                variant="default"
                                                size="icon"
                                                type="submit"
                                                className="rounded-xl h-10 w-10"
                                            >
                                                <ArrowUp className="h-5 w-5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Send message</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="rounded-xl h-10 w-10"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    stop()
                                                }}
                                            >
                                                <Square className="h-5 w-5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Stop generation</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
                Assistant uses the MCP protocol to connect to tools
            </p>
        </form>
    )
}
