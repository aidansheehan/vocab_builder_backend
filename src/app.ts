require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import morgan                                       from 'morgan';
import config                                       from 'config';
import cors                                         from 'cors';
import cookieParser                                 from 'cookie-parser';
import connectDB                                    from './utils/connectDB';
import userRouter                                   from './routes/user.route'
import authRouter                                   from './routes/auth.route';

//Create express instance
const app = express();

/** Middleware */

app.use(express.json({ limit: '10kb' }));   //1. Body Parser
app.use(cookieParser());                    //2. Cookie Parser

if (process.env.NODE_ENV === 'development') app.use(morgan('dev')); //3. Logger

//4. Cors
app.use(
    cors({
        origin: config.get<string>('origin'),
        credentials: true,
    })
);

// 5. Routes 
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

//Testing
app.get('/healthChecker', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to vocab builder'
    });
});

// Unknown Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

//Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.status      = err.status || 'error';
    err.statusCode  = err.statusCode || 500;

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

const port = config.get<number>('port');

//Call listen method
app.listen(port, () => {

    console.log(`Server started on port: ${port}`);

    connectDB(); //Connect to MongoDB instance

})