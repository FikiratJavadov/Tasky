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
exports.createTask = exports.getTasks = void 0;
const db_1 = require("../db");
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allTasks = yield db_1.prisma.task.findMany();
    res.status(200).json({ data: allTasks });
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, columnId } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (!name || !columnId)
        return res.status(404).json({ message: 'Missing some fields' });
    try {
        const newTask = yield db_1.prisma.task.create({
            data: {
                name,
                column: {
                    connect: {
                        id: columnId,
                    },
                },
            },
        });
        res.status(201).json({ data: newTask });
    }
    catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
});
exports.createTask = createTask;
