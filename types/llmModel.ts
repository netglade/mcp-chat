export type LLMModel = {
    id: string
    name: string
    provider: string
    providerId: string
}

export type LLMModelConfig = {
    model?: string
    apiKey?: string
    baseURL?: string
    temperature?: number
    topP?: number
    topK?: number
    frequencyPenalty?: number
    presencePenalty?: number
    maxTokens?: number
}
