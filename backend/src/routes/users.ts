import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/users';
import 'express-async-errors';
import { Task } from '../models/tasks';
import { CustomUserRequest } from '../utils/types';

const userRouter = express.Router();

const verifyUserPermissions = async (
    req: CustomUserRequest,
    res: express.Response,
    next: express.NextFunction,
) => {
    if (!req.user || !req.user.id)
        return res.status(403).json({ err: 'Not authorized' });
    const role = req.user.role;
    if (role !== 'Admin')
        return res.status(403).json({ err: 'Not authorized' });
    next();
};

userRouter.use(verifyUserPermissions);

userRouter.get('/', async (req: CustomUserRequest, res) => {
    const users = await User.find({ createdBy: req.user?.id });
    return res.json(users);
});

userRouter.get('/:id', async (req: CustomUserRequest, res, next) => {
    const id = req.params.id;
    const user = await User.findOne({ id, createdBy: req.user?.id });
    if (user) res.status(200).json(user);
    else res.status(404).json({ err: 'Not found' });
});

userRouter.post('/', async (req: CustomUserRequest, res, next) => {
    const { name, section, student_id, program, password } = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        name,
        section,
        student_id,
        program,
        passwordHash,
        createdBy: req.user?.id,
    });
    const newUser = await user.save();
    return res.status(201).json(newUser);
});

userRouter.delete('/:id', async (req: CustomUserRequest, res, next) => {
    const id = req.params.id;
    const userFromDB = await User.findById(id);
    const taskIds = userFromDB?.tasks;

    await User.findOneAndDelete({ id, createdBy: req.user?.id });
    await Task.deleteMany({ _id: { $in: taskIds } });

    return res.status(204).end();
});

export default userRouter;
