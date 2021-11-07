import { Request, Response, NextFunction } from 'express';

export default (asyncFn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        asyncFn(req, res, next)
            .catch(next);
    };
};
