import express from 'express';
import dotenv from 'dotenv';
const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.json({ msg: 'Hello' });
});

app.listen(PORT || 5000, () => {
    console.log(`Server listening at ${PORT}`);
});
