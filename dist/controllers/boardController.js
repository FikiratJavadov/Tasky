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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBoard = exports.getBoards = void 0;
const db_1 = require("../db");
const getBoards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allBoard = yield db_1.prisma.board.findMany();
    res.status(200).json({ data: allBoard });
});
exports.getBoards = getBoards;
const createBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (!name)
        return res.status(404).json({ message: 'Name is missing' });
    const newBoard = yield db_1.prisma.board.create({
        data: {
            name,
            columns: {
                create: [{ name: 'Queue' }, { name: 'Development' }, { name: 'Done' }],
            },
        },
    });
    res.status(201).json({ data: newBoard });
});
exports.createBoard = createBoard;
//# sourceMappingURL=boardController.js.map