import config                                               from 'config';
import { CookieOptions, NextFunction, Request, Response }   from 'express';
import { CreateUserInput, LoginUserInput }                  from '../schemas/user.schema';
import { createUser, findUser, findUserById, signToken }    from '../services/user.service';
import AppError                                             from '../helpers/appError';
import { signJwt, verifyJwt }                               from '../helpers/jwt';
import redisClient                                          from '../helpers/connectRedis';

/**
 * Authentication Controller
 */

// Exclude this field from the response
export const excludedFields = ['password'];

// Access Token Cookie options
const accessTokenCookieOptions: CookieOptions = {
    expires: new Date(
        Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
}

//Refresh Token Cookie Options
const refreshTokenCookieOptions: CookieOptions = {
    expires: new Date(
        Date.now() + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
}

// Only set secure to true in production
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

        //Create the access and refresh tokens
        const { accessToken, refreshToken } = await signToken(user);

        //Send access token in Cookie TODO configure here so access token only sent in cookie
        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

        //Send access token - TODO if configuring for HTTPOnlyCookie this should be removed
        res.status(200).json({
            status: 'success',
            accessToken,
            user//TODO is this needed?
        });
    } catch (err: any) {
        next(err);
    }
};

//TODO may need logout function here to clear cookies
const logout = (res: Response) => {
    res.cookie('accessToken', '', { maxAge: 1 });
    res.cookie('refreshToken', '', { maxAge: 1 });
    res.cookie('logged_in', '', {
        maxAge: 1
    })
}

/**
 * Function to log a user out
 * @param req user logout request
 * @param res logout response
 * @param next callback
 * @returns void
 */
export const logoutHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;
        await redisClient.del(user._id);    //TODO will need to be refactored to `user: ${user._id}` after merge in implement-cache-layer branch
        logout(res);
        return res.status(200).json({ status: 'success' });
    } catch (err: any) {
        next(err);
    }
}

/**
 * Function to refresh access token
 * @param req user refresh request
 * @param res refresh response
 * @param next callback
 * @returns void
 */
export const refreshAccessTokenHandler = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        //Get the refresh token from cookie
        const refreshToken = req.cookies.refreshToken as string;

        //Validate the refresh token
        const decoded = verifyJwt<{ sub: string }>(
            refreshToken,
            'refreshTokenPublicKey'
        );

        //Fail message
        const message = 'Could not refresh access token';

        //Return fail message if refresh token wasn't validated
        if (!decoded) {
            return next(new AppError(message, 403));
        }

        //Check if the user has a valid session
        const session = await redisClient.get(decoded.sub); //TODO this will need to be refactored when implement-cache-layer merged in to `user:${decoded.sub}`
        
        //Return fail message if user doesn't have an active session
        if (!session) {
            return next(new AppError(message, 403));
        }

        //Check if the user exists
        const user = await findUserById(JSON.parse(session)._id);

        //Return fail message if user doesn't exist
        if (!user) {
            return next(new AppError(message, 403));
        }

        //Sign new access token
        const accessToken = signJwt({ sub: user._id }, 'accessTokenPrivateKey', {
            expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`
        });

        //Send the access token as cookie
        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

        //Send response
        res.status(200).json({
            status: 'success',
            accessToken
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