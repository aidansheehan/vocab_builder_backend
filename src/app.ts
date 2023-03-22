require('dotenv').config();

import express, { NextFunction, Request, Response } from 'express';
import morgan                                       from 'morgan';
import config                                       from 'config';
import cors                                         from 'cors';
import cookieParser                                 from 'cookie-parser';
import connectDB                                    from './api/helpers/connectDB';
import userRouter                                   from './api/routes/user.route';
import authRouter                                   from './api/routes/auth.route';
import collectionRouter                             from './api/routes/collection.route';

const swaggerJSDoc  = require('swagger-jsdoc');
const swaggerUi     = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for Vocab Builder',
        version: '0.1.0',
        description:
            'This is a REST API application made with Express. It provides an authentication service and CRUD operations for custom user flashcard decks.'
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            },
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'refreshToken'
            }
        },
        // TODO not working. Have a look into this solution https://github.com/chuve/swagger-multi-file-spec/blob/master/index.js
        // schemas: {
        //     'Card': {
        //         type: 'object',
        //         description: 'A single flashcard',
        //         properties: {
        //             lexi: {
        //                 type: 'string',
        //                 description: 'The lexical item to be memorized',
        //                 example: 'Ek'
        //             },
        //             prompt: {
        //                 type: 'string',
        //                 description: 'A prompt to help the user remember the word',
        //                 example: 'One'
        //             },
        //             id: {
        //                 type: 'string',
        //                 description: 'The card\'s unique ID',
        //                 example: 'fd1c6dc2-db1e-4f32-b3b7-885c0c386ccafd1c6dc2-db1e-4f32-b3b7-885c0c386cca'
        //             }
        //         }
        //     },
        //     'Collection': {
        //         type: 'object',
        //         description: 'A collection of flashcards.',
        //         properties: {
        //             title: {
        //                 type: 'string',
        //                 description: 'The title of the collection',
        //                 example: 'Numbers'
        //             }, 
        //             description: {
        //                 type: 'string',
        //                 description: 'A description of the collection',
        //                 example: 'A collection about numbers.'
        //             },
        //             cards: {
        //                 type: 'array',
        //                 items: {
        //                     type: "$ref '#/components/schemas/Card'"
        //                 }
        //             }
        //         }
        //     },
        // },
        tags: [
            {
                name: 'auth',
                description: 'User authentication service'
            },
        ]
    },
    servers: [
        {
            url: 'http://localhost:8000',
            description: 'Development server',
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: [ './src/api/routes/*.ts']
};

const swaggerSpec = swaggerJSDoc(options);

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
app.use('/api/collections', collectionRouter);

//6. Documentation with Swagger and JSDoc
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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