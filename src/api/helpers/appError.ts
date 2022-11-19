/**
 * Custom express error handler for passing errors to the user
 */
export default class AppError extends Error {
    status: string;
    isOperational: boolean;

    constructor(public message: string, public statusCode: number = 500) {
        super(message);

        this.status         = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational  = true;

        Error.captureStackTrace(this, this.constructor);
    }
}