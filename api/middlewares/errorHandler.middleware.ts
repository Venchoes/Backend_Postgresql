import { Request, Response, NextFunction } from 'express';

export interface HttpError extends Error {
    status?: number;
}

const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
};

export default errorHandler;