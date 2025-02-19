import { Request, Response } from 'express';
import { agentRegistry } from '../agents/register.agents';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { getChatFromStore, saveChat, updateChat } from '../service/conversation.history'
import pino from 'pino'
import OpenAI from 'openai';

const openai = new OpenAI();

const log = pino({
    transport: {
        target: 'pino-pretty'
    },
})

export const chatWithAgent = async (req: Request, res: Response) => {
    let agentName = req.params.agentName;
    let chatId = req.params.chatId;
    let message = req.body.message;

    if (!agentRegistry[agentName]) {
        res.status(404).send('Agent not found');
        return;
    }

    let systemPrompt = agentRegistry[agentName].systemPrompt;
    let tools = agentRegistry[agentName].tools;

    let chatContext: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
    ]

    if (chatId) {
        chatContext = [
            ...getChatFromStore(chatId).messages,
            { role: 'user', content: message }
        ]
    }

    log.info("chatContext: ")
    log.info(chatContext)

    const runner = await openai.beta.chat.completions
        .runTools({
            model: 'gpt-4-1106-preview',
            tools,
            messages: chatContext,
            store: true
        })
        .on('message', (msg) => {
            console.log('msg', msg)
        })
        .on('functionCall', (functionCall) => console.log('functionCall', functionCall))
        .on('functionCallResult', (functionCallResult) => console.log('functionCallResult', functionCallResult))
        .on('content', (diff) => console.log(diff));

    const result = await runner.finalChatCompletion();

    log.info(result)
    log.info(result.choices)
    log.info(result.id)

    if (!chatId) {
        saveChat(result.id, [
            ...chatContext,
            {
                role: result.choices[0].message.role,
                content: result.choices[0].message.content
            }
        ])
    } else {
        updateChat(chatId, [
            ...chatContext,
            {
                role: result.choices[0].message.role,
                content: result.choices[0].message.content
            }
        ])
    }

    res.json({ id: result.id, message: result.choices[0].message.content });
}