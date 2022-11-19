import config                                               from 'config';
import { CookieOptions, NextFunction, Request, Response }   from 'express';
import { CreateUserInput, LoginUserInput }                  from '../schemas/user.schema';
import { createUser, findUser, signToken }                  from '../services/user.service';
import AppError                                             from '../helpers/appError';

/**
 * Authentication Controller
 */

// Exclude this field from the response
export const excludedFields = ['password'];

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
    expires: new Date(
        Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
}

// Only set secure you true in production
if (process.env.NODE_ENV === 'production')
    accessTokenCookieOptions.secure = true;

/**
 * Function to handle register
 * @param req user register request
 * @param res register response
 * @param next callback
 * @returns void
 */
export const registerHandler = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {

        //Create a user with the specified credentials
        const user = await createUser({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        res.status(202).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err: any) {

        //Duplicate (user already exists) mongo code 11000
        if (err.code === 11000) {
            return res.status(409).json({
                status: 'fail',
                message: 'Email already exists'
            });
        }
        next(err);
    }
};


/**
 * Function to handle login
 * @param req user login request
 * @param res login response
 * @param next callback
 * @returns void
 */
export const loginHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {

        //Get the user from the collection
        const user = await findUser({ email: req.body.email });

        //Check if user exists and password is correct
        if (
            !user ||
            !(await user.comparePasswords(user.password, req.body.password))
        ) {
            return next(new AppError('Invalid email or password', 401));
        }

        //Create an access token
        const { accessToken } = await signToken(user);

        //Send access token in Cookie TODO configure here so access token only sent in cookie
        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

        //Send access token
        res.status(200).json({
            status: 'success',
            accessToken,
            user
        });
    } catch (err: any) {
        next(err);
    }
};

/**
 * TODO:
 *  - implement password reset emails here for forgotten email/password
 *  - functionality to reset user's password here
 *  - update currently logged in user's password here
 *  - implement OAuth authentication here
 */