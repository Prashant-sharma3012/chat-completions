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
exports.tools = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default();
exports.tools = [
    {
        type: 'function',
        function: {
            name: 'list',
            description: 'list queries books by genre, and returns a list of names of books',
            parameters: {
                type: 'object',
                properties: {
                    genre: { type: 'string', enum: ['mystery', 'nonfiction', 'memoir', 'romance', 'historical'] },
                },
            },
            function: list,
            parse: JSON.parse,
        },
    },
    {
        type: 'function',
        function: {
            name: 'search',
            description: 'search queries books by their name and returns a list of book names and their ids',
            parameters: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                },
            },
            function: search,
            parse: JSON.parse,
        },
    },
    {
        type: 'function',
        function: {
            name: 'get',
            description: "get returns a book's detailed information based on the id of the book. Note that this does not accept names, and only IDs, which you can get by using search.",
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
            },
            function: get,
            parse: JSON.parse,
        },
    },
];
const db = [
    {
        id: 'a1',
        name: 'To Kill a Mockingbird',
        genre: 'historical',
        description: `Compassionate, dramatic, and deeply moving, "To Kill A Mockingbird" takes readers to the roots of human behavior - to innocence and experience, kindness and cruelty, love and hatred, humor and pathos. Now with over 18 million copies in print and translated into forty languages, this regional story by a young Alabama woman claims universal appeal. Harper Lee always considered her book to be a simple love story. Today it is regarded as a masterpiece of American literature.`,
    },
    {
        id: 'a2',
        name: 'All the Light We Cannot See',
        genre: 'historical',
        description: `In a mining town in Germany, Werner Pfennig, an orphan, grows up with his younger sister, enchanted by a crude radio they find that brings them news and stories from places they have never seen or imagined. Werner becomes an expert at building and fixing these crucial new instruments and is enlisted to use his talent to track down the resistance. Deftly interweaving the lives of Marie-Laure and Werner, Doerr illuminates the ways, against all odds, people try to be good to one another.`,
    },
    {
        id: 'a3',
        name: 'Where the Crawdads Sing',
        genre: 'historical',
        description: `For years, rumors of the “Marsh Girl” haunted Barkley Cove, a quiet fishing village. Kya Clark is barefoot and wild; unfit for polite society. So in late 1969, when the popular Chase Andrews is found dead, locals immediately suspect her.
But Kya is not what they say. A born naturalist with just one day of school, she takes life's lessons from the land, learning the real ways of the world from the dishonest signals of fireflies. But while she has the skills to live in solitude forever, the time comes when she yearns to be touched and loved. Drawn to two young men from town, who are each intrigued by her wild beauty, Kya opens herself to a new and startling world—until the unthinkable happens.`,
    },
];
function list(_a) {
    return __awaiter(this, arguments, void 0, function* ({ genre }) {
        return db.filter((item) => item.genre === genre).map((item) => ({ name: item.name, id: item.id }));
    });
}
function search(_a) {
    return __awaiter(this, arguments, void 0, function* ({ name }) {
        return db.filter((item) => item.name.includes(name)).map((item) => ({ name: item.name, id: item.id }));
    });
}
function get(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id }) {
        return db.find((item) => item.id === id);
    });
}
