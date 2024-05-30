import express from 'express';
import { CustomUserRequest } from '../utils/types';
import { Notice } from '../models/notices';
import { User } from '../models/users';

export const noticesRouter = express.Router();

const verifyUserPermissions = async (
    req: CustomUserRequest,
    res: express.Response,
    next: express.NextFunction,
) => {
    if (!req.user || !req.user.id)
        return res.status(403).json({ err: 'Not authorized' });
    next();
};

noticesRouter.use(verifyUserPermissions);

noticesRouter.get('/', async (req: CustomUserRequest, res, next) => {
    const created_by = req.user?.created_by || req.user?.id;
    if (!created_by) return res.status(403).json({ err: 'Not authorized' });

    const notices = await Notice.find({ createdBy: created_by });

    if (req.user?.role === 'Student') {
        const user = await User.findById(req.user.id)
            .populate('notices.notice')
            .lean();
        const notices = user?.notices.map((noticeEntry) => {
            const { notice, read } = noticeEntry;
            return {...notice, read};
        });

        return res.status(200).json(notices);
    }
    return res.status(200).json(notices);
});

const verifyEditPermissions = async (
    req: CustomUserRequest,
    res: express.Response,
    next: express.NextFunction,
) => {
    const role = req.user?.role;
    if (role !== 'Admin')
        return res.status(403).json({ err: 'Not authorized' });
    next();
};

noticesRouter.use(verifyEditPermissions);

noticesRouter.post('/', async (req: CustomUserRequest, res, next) => {
    const adminId = req.user?.id;
    const { title, description } = req.body;

    const notice = await Notice.create({
        title,
        description,
        createdBy: adminId,
    });

    await User.updateMany(
        { createdBy: adminId },
        { $push: { notices: { notice: notice._id } } },
    );

    return res.status(201).json(notice);
});
