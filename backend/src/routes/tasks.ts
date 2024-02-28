import express from 'express';
import { Task } from '../models/tasks';
import 'express-async-errors';
import { CustomUserRequest } from '../utils/types';
import { User } from '../models/users';

const taskRouter = express.Router();

taskRouter.get('/', async (req: CustomUserRequest, res, next) => {
    const user = req.user;
    const tasks = await Task.find({ created_by: user?.id });
    return res.json(tasks);
});

taskRouter.get('/:id', async (req: CustomUserRequest, res, next) => {
	const user = req.user;
    const id = req.params.id;
    const task = await Task.findOne({created_by: user?.id, _id: id});
    if (task) res.status(200).json(task);
    else res.status(404).json({ err: 'Not found' });
});

taskRouter.post('/', async (req: CustomUserRequest, res, next) => {
    const user = req.user;
    const { title, due_date, priority } = req.body;
    const task = new Task({
        title,
        due_date,
        priority,
        created_by: user?.id,
    });
    const newTask = await task.save();
    const userFromDB = await User.findById(user?.id);
    if (userFromDB) {
        userFromDB.tasks = userFromDB.tasks.concat(newTask._id);
        await userFromDB.save();
    }
    return res.status(201).json(newTask);
});

taskRouter.delete('/:id', async (req: CustomUserRequest, res, next) => {
    const user = req.user;
    const id = req.params.id;

    await Task.findOneAndDelete({ _id: id, created_by: user?.id });

    const userFromDB = await User.findById(user?.id);
    if (userFromDB) {
        userFromDB.tasks = userFromDB.tasks.filter(
            (task) => task.toString() !== id,
        );
        await userFromDB.save();
    }
    return res.status(204).end();
});

taskRouter.put('/:id', async (req: CustomUserRequest, res, next) => {
    const user = req.user;
    const id = req.params.id;
    const { title, due_date, priority, done } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
        { _id: id, created_by: user?.id },
        { title, due_date, priority, done },
        { new: true, runValidators: true, context: 'query' },
    );

    return res.status(200).json(updatedTask);
});
export default taskRouter;
