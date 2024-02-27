import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req:Request, res:Response, next: NextFunction) => {
    console.log('Method:', req.method);
    console.log('Path: ', req.path);
    console.log('Body: ', req.body);
    console.log('---');
    next();
};
export const unknownEndpoint = (req:Request, res:Response) => {
    return res.status(404).send({ error: 'unknown endpoint' });
};

export const errorHandler = (err:Error, req:Request, res:Response, next: NextFunction) => {
    console.log(err.message);
    if (err.name === 'CastError')
        return res.status(400).send({ err: 'Malformatted ID' });
    else if (err.name === 'ValidationError')
        return res.status(400).send({ err: err.message });
    else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ err: err.message });
    } else if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ err: 'token expired' });
    }
    next(err);
};
