import { ChatCompletionMessageParam } from 'openai/resources/chat';

export interface ConversationHistory {
    id: string;
    messages: ChatCompletionMessageParam[];
    createdAt: string;
}

export interface ConversationHistoryStore {
    [key: string]: ConversationHistory;
}

const ConversationHistoryStore: ConversationHistoryStore = {}

export const getChatFromStore = (id: string): ConversationHistory => {
    return ConversationHistoryStore[id];
}

export const saveChat = (id: string, messages: ChatCompletionMessageParam[]): ConversationHistory => {
    if (ConversationHistoryStore[id]) {
        throw new Error('Chat already exists');
    }

    const chat = {
        id,
        messages,
        createdAt: new Date().toISOString()
    }
    ConversationHistoryStore[id] = chat;
    return chat;
}

export const updateChat = (id: string, messages: ChatCompletionMessageParam[]): ConversationHistory => {
    if (!ConversationHistoryStore[id]) {
        throw new Error('Chat does not exist');
    }

    const chat = {
        id,
        messages,
        createdAt: ConversationHistoryStore[id].createdAt
    }
    ConversationHistoryStore[id] = chat;
    return chat;
}

export const deleteChat = (id: string): ConversationHistory | null => {
    if (!ConversationHistoryStore[id]) {
        return null;
    }

    const chat = ConversationHistoryStore[id];
    delete ConversationHistoryStore[id];
    return chat;
}