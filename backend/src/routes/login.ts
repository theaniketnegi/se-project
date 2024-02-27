import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/users';
import jwt from 'jsonwebtoken';

import 'express-async-errors';
import { SECRET } from '../utils/config';

const loginRouter = express.Router();

loginRouter.post('/', async (req, res, next) => {
    const { student_id, password } = req.body;
    const user = await User.findOne({ student_id });
    const passwordCorrect =
        user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);
    if (!(user && passwordCorrect)) {
        return res.status(401).json({ err: 'Invalid username or password' });
    }
    const payload = { student_id, id: user._id };
    const token = jwt.sign(payload, SECRET);
    return res.status(200).send({ token, student_id, name: user.name });
});

export default loginRouter;
