import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/users';
import 'express-async-errors';
import { Task } from '../models/tasks';
import { CustomUserRequest } from '../utils/types';
import { Project, ProjectTask } from '../models/projects';
import { Notice } from '../models/notices';

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

userRouter.put('/:id', async (req: CustomUserRequest, res, next) => {
    const id = req.params.id;
    const user = await User.findOne({ student_id: id });
    if (!user || req.user?.id.toString() !== user._id.toString())
        return res.status(403).json({ err: 'Not authorized' });
    const { all, noticeId } = req.body;

    if (all) {
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: { 'notices.$[].read': true } },
            { new: true },
        )
            .populate('notices.notice')
            .lean();
        if (!updatedUser) {
            return res.status(404).json({ err: 'Failed to update' });
        }
        const updatedNotices = updatedUser?.notices.map((n) => {
            const { notice, read } = n;
            return { ...notice, read };
        });
        return res.status(200).json(updatedNotices);
    }
    if (!noticeId) return res.status(400);

    const userNotice = user.notices.find(
        (n) => n.notice.toString() === noticeId,
    );
    if (!userNotice) {
        return res.status(404).json({ err: 'Notice not found' });
    }
    const updatedUser = await User.findOneAndUpdate(
        {
            _id: user.id,
            'notices.notice': noticeId,
        },
        { $set: { 'notices.$.read': !userNotice.read } },
        { new: true },
    )
        .populate('notices.notice')
        .lean();
    const updatedNotice = updatedUser?.notices.find(
        (n) => n.notice._id.toString() === noticeId,
    );
    if (!updatedNotice)
        return res.status(404).json({ err: 'Notice not found' });
    console.log(updatedNotice);
    const { notice, read } = updatedNotice;
    return res.status(200).json({ ...notice, read });
});

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
    const notices = await Notice.find({ createdBy: req.user?.id });
    if (notices) {
        const userNotices = notices.map((notice) => ({
            notice: notice._id,
        }));
        user.notices = userNotices;
    }
    const newUser = await user.save();
    return res.status(201).json(newUser);
});

userRouter.delete('/:id', async (req: CustomUserRequest, res, next) => {
    const id = req.params.id;
    const userFromDB = await User.findOne({
        student_id: id,
        createdBy: req.user?.id,
    });

    if (!userFromDB) {
        return res.status(404).json({ err: 'Not found' });
    }
    const taskIds = userFromDB?.tasks;
    const projectIds = userFromDB?.projects;
    await User.findOneAndDelete({ student_id: id, createdBy: req.user?.id });
    await Task.deleteMany({ _id: { $in: taskIds } });
    for (const projectId of projectIds) {
        const project = await Project.findById(projectId);
        if (project) {
            const projectTaskIds = project.projectTasks;
            await ProjectTask.deleteMany({ _id: { $in: projectTaskIds } });
        }
    }
    await Project.deleteMany({ _id: { $in: projectIds } });

    return res.status(200).json(id);
});

export default userRouter;
