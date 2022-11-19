import { NextFunction, Request, Response }  from "express";
import { findAllUsers }                     from "../services/user.service";

/**
 * User controller
 * Restricts authorized access to pages, responses, etc
 */

/**
 * returns the currently logged in user's profile info
 * open to all users
 */
export const getMeHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;
        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err: any) {
        next(err);
    }
};

/**
 * returns all user's info
 * only for admin role
 */
export const getAllUsersHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await findAllUsers();
        res.status(200).json({
            status: 'success',
            result: users.length,
            data: {
                users,
            },
        });
    } catch (err: any) {
        next(err);
    }
}