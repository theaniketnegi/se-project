import express from 'express';
import mongoose from 'mongoose';
import { MONGODB_URI } from './utils/config';
import taskRouter from './routes/tasks';
import userRouter from './routes/users';
import { errorHandler, unknownEndpoint } from './utils/middlewares';

const app = express();

mongoose.set('strictQuery', true);
mongoose
    .connect(MONGODB_URI)
    .then((result) => console.log('connected to MongoDB'))
    .catch((err) => console.error(err));

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.json({ msg: 'Hello' });
});

app.use(express.json());
app.use('/api/tasks', taskRouter);
app.use('/api/users', userRouter);
app.use(unknownEndpoint);
app.use(errorHandler);
app.listen(PORT || 5000, () => {
    console.log(`Server listening at ${PORT}`);
});
