import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/users';
import 'express-async-errors';
import { Task } from '../models/tasks';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    const users = await User.find({});
    return res.json(users);
});

userRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) res.status(200).json(user);
    else res.status(404).json({ error: 'Not found' });
});

userRouter.post('/', async (req, res, next) => {
    const { name, section, student_id, program, password } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, section, student_id, program, passwordHash });
    const newUser = await user.save();
    return res.status(201).json(newUser);
});

userRouter.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    const userFromDB = await User.findById(id);
    const taskIds = userFromDB?.tasks;

    await User.findByIdAndDelete(id);
    await Task.deleteMany({ _id: { $in: taskIds } });

	return res.status(204).end();
});

export default userRouter;
