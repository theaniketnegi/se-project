import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserPayloadType } from '../utils/types';
import 'express-async-errors';
import { SECRET } from '../utils/config';
import { Admin } from '../models/admin';

const adminLoginRouter = express.Router();

adminLoginRouter.post('/', async (req, res, next) => {
    const { adminId, password } = req.body;
    const user = await Admin.findOne({ adminId }).maxTimeMS(10000);
    const passwordCorrect =
        user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);
    if (!(user && passwordCorrect)) {
        return res.status(401).json({ err: 'Invalid username or password' });
    }
    const payload: UserPayloadType = { id: user._id, role: 'Admin' };
    const token: string = jwt.sign(payload, SECRET);
    return res.status(200).send({
        token,
        adminId,
        name: user.name,
        org: user.organization,
    });
});

export default adminLoginRouter;
