import express from 'express';
import mongoose from 'mongoose';
import { MONGODB_URI } from './utils/config';
import taskRouter from './routes/tasks';
import userRouter from './routes/users';
import {
    errorHandler,
    requestLogger,
    unknownEndpoint,
    userPayload,
} from './utils/middlewares';
import loginRouter from './routes/login';
import projectRouter from './routes/projects';
import cors from 'cors';
const app = express();

mongoose.set('strictQuery', true);
mongoose
    .connect(MONGODB_URI)
    .then((result) => console.log('connected to MongoDB'))
    .catch((err) => console.error(err));

const PORT = process.env.PORT;

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use(userPayload);
app.use('/api/tasks', taskRouter);
app.use('/api/projects', projectRouter);
app.use(unknownEndpoint);
app.use(errorHandler);
app.listen(PORT || 5000, () => {
    console.log(`Server listening at ${PORT}`);
});
