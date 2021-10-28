import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../exceptions";

export const validateAuthentication = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new UnauthorizedError('User not authenticated.');
    }
    next();
}