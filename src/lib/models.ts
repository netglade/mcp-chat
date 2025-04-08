import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createVertex } from '@ai-sdk/google-vertex'
import { createMistral } from '@ai-sdk/mistral'
import { createOpenAI } from '@ai-sdk/openai'
import { createOllama } from 'ollama-ai-provider'
import { LLMModel, LLMModelConfig } from '@/types/llmModel'

export function getModelClient(model: LLMModel, config: LLMModelConfig) {
    const { id: modelNameString, providerId } = model
    const { apiKey, baseURL } = config

    const providerConfigs = {
        anthropic: () => createAnthropic({ apiKey, baseURL })(modelNameString),
        openai: () => createOpenAI({ apiKey, baseURL })(modelNameString),
        google: () =>
            createGoogleGenerativeAI({ apiKey, baseURL })(modelNameString),
        mistral: () => createMistral({ apiKey, baseURL })(modelNameString),
        groq: () =>
            createOpenAI({
                apiKey: apiKey,
                baseURL: baseURL || 'https://api.groq.com/openai/v1',
            })(modelNameString),
        togetherai: () =>
            createOpenAI({
                apiKey: apiKey,
                baseURL: baseURL || 'https://api.together.xyz/v1',
            })(modelNameString),
        ollama: () => createOllama({ baseURL })(modelNameString),
        fireworks: () =>
            createOpenAI({
                apiKey: apiKey,
                baseURL: baseURL || 'https://api.fireworks.ai/inference/v1',
            })(modelNameString),
        vertex: () =>
            createVertex({
                googleAuthOptions: {
                    credentials: JSON.parse(
                        '{}',
                    ),
                },
            })(modelNameString),
        xai: () =>
            createOpenAI({
                apiKey: apiKey,
                baseURL: baseURL || 'https://api.x.ai/v1',
            })(modelNameString),
        deepseek: () =>
            createOpenAI({
                apiKey: apiKey,
                baseURL: baseURL || 'https://api.deepseek.com/v1',
            })(modelNameString),
    }

    const createClient =
        providerConfigs[providerId as keyof typeof providerConfigs]

    if (!createClient) {
        throw new Error(`Unsupported provider: ${providerId}`)
    }

    return createClient()
}

export function getDefaultMode(model: LLMModel) {
    const { id: modelNameString, providerId } = model

    // monkey patch fireworks
    if (providerId === 'fireworks') {
        return 'json'
    }

    return 'auto'
}
