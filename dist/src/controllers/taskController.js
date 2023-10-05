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
exports.moveColumn = exports.updateTask = exports.createSubTask = exports.createTask = exports.getTasks = void 0;
const db_1 = require("../db");
var Columns;
(function (Columns) {
    Columns["QUEUE"] = "Queue";
    Columns["DEVELOPMENT"] = "Development";
    Columns["DONE"] = "Done";
})(Columns || (Columns = {}));
const allowToUpate = ['name', 'description', 'priority', 'columnId'];
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
        const column = yield db_1.prisma.column.findUnique({
            where: {
                id: columnId,
                name: Columns.QUEUE,
            },
        });
        console.log({ column });
        if (!column)
            return res
                .status(404)
                .json({ message: 'You can create task only in QUEUE' });
        const newTask = yield db_1.prisma.task.create({
            data: {
                name: name,
                columnId: columnId,
            },
        });
        res.status(201).json({ data: newTask });
    }
    catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
});
exports.createTask = createTask;
const createSubTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { name } = (_b = req.body) !== null && _b !== void 0 ? _b : {};
    const { parentId } = req.params;
    console.log(parentId);
    if (!name || !parentId || isNaN(+parentId))
        return res.status(404).json({ message: 'Missing some fields' });
    try {
        const taskParent = yield db_1.prisma.task.findUnique({
            where: {
                id: +parentId,
                parentId: null,
            },
        });
        if (!taskParent)
            return res.status(400).json({ message: 'Error creating subtask' });
        const subTask = yield db_1.prisma.task.create({
            data: {
                name,
                parentId: +parentId,
            },
            include: {
                subTasks: true,
            },
        });
        res.status(201).json({
            data: {
                subTask: subTask,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
});
exports.createSubTask = createSubTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const param = req.params;
    const newBody = allowToUpate.reduce((obj, current) => {
        if (body[current]) {
            return Object.assign(Object.assign({}, obj), { [current]: body[current] });
        }
        else {
            return obj;
        }
    }, {});
    if (!param || !newBody)
        return res.status(400).json({ message: 'Wrong input' });
    if (isNaN(Number(param.id)))
        return res.status(400);
    try {
        const updatedTask = yield db_1.prisma.task.update({
            where: {
                id: +param.id,
            },
            data: newBody,
        });
        res.status(201).json({ data: updatedTask });
    }
    catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
});
exports.updateTask = updateTask;
function reorder(tasks, columndId) {
    return __awaiter(this, void 0, void 0, function* () {
        const updates = tasks.map((task) => db_1.prisma.task.update({
            where: { id: task.id },
            data: {
                position: task.position,
                columnId: columndId,
            },
        }));
        yield Promise.all(updates);
    });
}
function reorderOldColumn(oldColumnId) {
    return __awaiter(this, void 0, void 0, function* () {
        const column = yield db_1.prisma.column.findUnique({
            where: { id: oldColumnId },
            include: {
                task: {
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
        });
        if (!column)
            return;
        for (let i = 0; i < column.task.length; i++) {
            const taskId = column.task[i].id;
            yield db_1.prisma.task.update({
                where: { id: taskId },
                data: { position: i + 1 },
            });
        }
    });
}
const moveColumn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { oldColumnId, newColumnId, tasks } = (_c = req.body) !== null && _c !== void 0 ? _c : {};
    if (!newColumnId || !oldColumnId) {
        return res.status(400).json({ message: 'Please provide all columns ids' });
    }
    if (newColumnId === oldColumnId) {
        yield reorder(tasks, newColumnId);
    }
    else {
        yield reorder(tasks, newColumnId);
        yield reorderOldColumn(oldColumnId);
    }
    res.status(200).json({ message: 'Update position of all tasks' });
    try {
    }
    catch (error) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
});
exports.moveColumn = moveColumn;
