import { NextFunction, Request, Response }  from "express";
import AppError                             from "../utils/appError";

/**
 * This middleware checks if the user role exists in allowedRoles array.
 * If user role in array user is allowed to perform that action, else return error
 */
export const restrictTo =
    (...allowedRoles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user;
        if (!allowedRoles.includes(user.role)) {
            return next(
                new AppError('You are not allowed to perform this action', 403)
            );
        }

        next();
    }