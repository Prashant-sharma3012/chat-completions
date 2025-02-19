import OpenAI from "openai";
import { Request, Response } from "express";
import pino from 'pino'
import { tools } from "../tools/examples/tool-call-v2";
import { getChatFromStore, saveChat, updateChat } from '../service/conversation.history'
import { ChatCompletionMessageParam } from 'openai/resources/chat';

const openai = new OpenAI();

const log = pino({
  transport: {
    target: 'pino-pretty'
  },
})

//@ts-ignore
let chatContext = []

export const chatWithAgent = async (req: Request, res: Response) => {
  const systemPrompt = "You are a helpful assistant that helps in writing sql's. you can only write sql's and will not answer any other user query."

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    //@ts-ignore
    messages: [{ role: "assistant", content: systemPrompt }, ...chatContext, {
      role: "user",
      content: req.body.message
    }]
  });

  //@ts-ignore
  chatContext = [...chatContext, { role: "user", content: req.body.message }, completion.choices[0].message];
  res.json(chatContext);
}

let systemPrompt: ChatCompletionMessageParam = {
  role: 'system',
  content:
    'Please use our book database, which you can access using functions to answer the following questions.'
}


export async function chatWithTools(req: Request, res: Response) {
  const message = req.body.message;
  const id = req.body.id;

  let chatContext: ChatCompletionMessageParam[] = [
    systemPrompt,
    { role: 'user', content: message }
  ]

  if (id) {
    chatContext = [
      ...getChatFromStore(id).messages,
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

  if (!id) {
    saveChat(result.id, [
      ...chatContext,
      {
        role: result.choices[0].message.role,
        content: result.choices[0].message.content
      }
    ])
  } else {
    updateChat(id, [
      ...chatContext,
      {
        role: result.choices[0].message.role,
        content: result.choices[0].message.content
      }
    ])
  }

  res.json({ id: result.id, message: result.choices[0].message.content });
}

export async function getChatById(req: Request, res: Response) {
  const id = req.params.id;
  res.json(getChatFromStore(id));
}