import { NextFunction, Request, Response }  from 'express';
import { findUserById }                     from '../services/user.service';
import AppError                             from '../helpers/appError';
import redisClient                          from '../helpers/connectRedis';
import { verifyJwt }                        from '../helpers/jwt';

/**
 * Middleware responsible for deserializing the User
 * responsible for getting the JWT authorization bearer token and cookie 
 * from headers and cookie object, validating user & session and adding
 * user to res.locals
 */
export const deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //Get the token
        let access_token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            access_token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.access_token) {
            access_token = req.cookies.access_token;
        }

        if (!access_token) {
            return next(new AppError('You are not logged in', 401));
        }

        //Validate access token
        const decoded = verifyJwt<{ sub: string }>(
            access_token,
            'accessTokenPublicKey'
            );

        if (!decoded) {
            return next(new AppError(`Invalid token or user doesn't exist`, 401));
        }

        //Get user session
        const session = await redisClient.get(decoded.sub);

        //If no session in redis user session expired
        if (!session) {
            return next(new AppError(`User session has expired`, 401));
        }

        //Check if user still exists
        const user = await findUserById(JSON.parse(session)._id);

        if (!user) {
            return next(new AppError(`User with that token no longer exists`, 401));
        }

        //Check if user is logged in from other controllers
        res.locals.user = user;

        next();
    } catch (err: any) {
        next(err);
    }
}
