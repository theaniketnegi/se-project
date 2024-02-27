import express from 'express';
import { Task } from '../models/tasks';
import 'express-async-errors';

const taskRouter = express.Router();

taskRouter.get('/', async (req, res) => {
    const tasks = await Task.find({});
    return res.json(tasks);
});

taskRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (task) res.status(200).json(task);
    else res.status(404).json({ error: 'Not found' });
});

export default taskRouter;