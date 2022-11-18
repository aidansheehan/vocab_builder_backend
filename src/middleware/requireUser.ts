import { NextFunction, Request, Response }  from "express";
import AppError                             from "../utils/appError";

/**
 * This middleware will be called after deserializeUser middleware to check
 * if the user exists on res.loca.s
 */
export const requireUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;

        if(!user) {
            return next(new AppError(`Invalid token or session has expired`));
        }

        next();
    } catch (err: any) {
        next(err);
    }
};