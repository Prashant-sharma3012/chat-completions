import { prompt, tools } from './agent-one'

export const agentRegistry: Record<string,any> = {
    'agent-one': {
        systemPrompt: prompt,
        tools: tools
    }
}

