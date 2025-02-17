"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAgent = void 0;
exports.chatWithTools = chatWithTools;
exports.getChatById = getChatById;
const openai_1 = __importDefault(require("openai"));
const pino_1 = __importDefault(require("pino"));
const tool_call_v2_1 = require("./tools/tool-call-v2");
const openai = new openai_1.default();
const log = (0, pino_1.default)({
    transport: {
        target: 'pino-pretty'
    },
});
//@ts-ignore
let chatContext = [];
const chatWithAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const systemPrompt = "You are a helpful assistant that helps in writing sql's. you can only write sql's and will not answer any other user query.";
    const completion = yield openai.chat.completions.create({
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
});
exports.chatWithAgent = chatWithAgent;
let chatStore = [
    {
        role: 'system',
        content: 'Please use our book database, which you can access using functions to answer the following questions.'
    }
];
const getChatContext = (message) => {
    return [...chatStore, { role: "user", content: message }];
};
function chatWithTools(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = req.body.message;
        const runner = yield openai.beta.chat.completions
            .runTools({
            model: 'gpt-4-1106-preview',
            tools: tool_call_v2_1.tools,
            messages: getChatContext(message),
            store: true
        })
            .on('message', (msg) => {
            console.log('msg', msg);
        })
            .on('functionCall', (functionCall) => console.log('functionCall', functionCall))
            .on('functionCallResult', (functionCallResult) => console.log('functionCallResult', functionCallResult))
            .on('content', (diff) => console.log(diff));
        const result = yield runner.finalChatCompletion();
        log.info(result);
        log.info(result.choices);
        log.info(result.id);
        log.info(result.usage);
        res.json({ message: result.choices[0].message.content });
    });
}
function getChatById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const result = yield openai.chat.completions.retrieve(id);
        res.json(result);
    });
}
