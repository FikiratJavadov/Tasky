"use strict";
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
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//Routes
app.use('/board', boardRoute_1.boardRouter);
app.use('/task', taskRoute_1.taskRouter);
app.use('/column', columnRoute_1.columnRouter);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
