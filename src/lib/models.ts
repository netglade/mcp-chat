import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { LLMModel, LLMModelConfig } from '@/types/llmModel'

export function getModelClient(model: LLMModel, config: LLMModelConfig) {
    const { id: modelNameString, providerId } = model
    const { apiKey, baseURL } = config

    const providerConfigs = {
        anthropic: () => createAnthropic({ apiKey, baseURL })(modelNameString),
        openai: () => createOpenAI({ apiKey, baseURL })(modelNameString),
    }

    const createClient =
        providerConfigs[providerId as keyof typeof providerConfigs]

    if (!createClient) {
        throw new Error(`Unsupported provider: ${providerId}`)
    }

    return createClient()
}
