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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const boardRoute_1 = require("./src/routes/boardRoute");
const taskRoute_1 = require("./src/routes/taskRoute");
const columnRoute_1 = require("./src/routes/columnRoute");
const commentRoute_1 = require("./src/routes/commentRoute");
const db_1 = require("./src/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//Routes
app.use('/board', boardRoute_1.boardRouter);
app.use('/task', taskRoute_1.taskRouter);
app.use('/column', columnRoute_1.columnRouter);
app.use('/comment', commentRoute_1.commentRoute);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.prisma.$connect();
        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        });
    });
}
startServer().catch((e) => console.error(e));
