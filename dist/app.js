"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Step 1: Import the Express module
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const chat_js_1 = require("./chat.js");
const pino_http_1 = __importDefault(require("pino-http"));
// Step 2: Create an instance of an Express application
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, pino_http_1.default)());
// Step 3: Define a route for the root URL ('/') that sends a response
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.post('/chat', chat_js_1.chatWithAgent);
app.post('/chat/tools', chat_js_1.chatWithTools);
app.get('/chat/:id', chat_js_1.getChatById);
// Step 4: Make the server listen on a specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
