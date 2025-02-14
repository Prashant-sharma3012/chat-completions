import OpenAI from "openai";
import pino from 'pino'

const openai = new OpenAI();

const log = pino({
    transport: {
      target: 'pino-pretty'
    },
  })

let chatContext = []

export const chatWithAgent = async (req, res) => {
    const systemPrompt = "You are a helpful assistant that helps in writing sql's. you can only write sql's and will not answer any other user query."

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "assistant", content: systemPrompt }, ...chatContext, {
            role: "user",
            content: req.body.message
        }],
        store: true,
    });

    chatContext = [...chatContext, { role: "user", content: req.body.message }, completion.choices[0].message];
    res.json(chatContext);
}
