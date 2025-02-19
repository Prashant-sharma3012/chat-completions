import { RunnableToolFunction } from 'openai/lib/RunnableFunction';
import { AgentOneTools } from './tools.impl';

const impl = new AgentOneTools();
export const tools: RunnableToolFunction<any>[] = [
    {
        type: 'function',
        function: {
            name: 'addition',
            description: 'addition adds two numbers together',
            parameters: {
                type: 'object',
                properties: {
                    a: { type: 'number' },
                    b: { type: 'number' },
                },
            },
            function: impl.addition,
            parse: JSON.parse,
        },
    } as RunnableToolFunction<{ genre: string }>,
    {
        type: 'function',
        function: {
            name: 'subtraction',
            description: 'subtraction subtracts two numbers',
            parameters: {
                type: 'object',
                properties: {
                    a: { type: 'number' },
                    b: { type: 'number' },
                },
            },
            function: impl.subtraction,
            parse: JSON.parse,
        },
    } as RunnableToolFunction<{ genre: string }>,
    {
        type: 'function',
        function: {
            name: 'multiplication',
            description: 'multiplication multiplies two numbers',
            parameters: {
                type: 'object',
                properties: {
                    a: { type: 'number' },
                    b: { type: 'number' },
                },
            },
            function: impl.multiplication,
            parse: JSON.parse,
        },
    } as RunnableToolFunction<{ genre: string }>,
    {
        type: 'function',
        function: {
            name: 'division',
            description: 'division divides two numbers',
            parameters: {
                type: 'object',
                properties: {
                    a: { type: 'number' },
                    b: { type: 'number' },
                },
            },
            function: impl.division,
            parse: JSON.parse,
        },
    } as RunnableToolFunction<{ genre: string }>,
];

