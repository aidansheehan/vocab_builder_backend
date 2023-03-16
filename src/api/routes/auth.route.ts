import express                                  from 'express';
import { 
    loginHandler, 
    logoutHandler, 
    refreshAccessTokenHandler, 
    registerHandler }                           from '../controllers/auth.controller';
import { deserializeUser }                      from '../middleware/deserializeUser';
import { requireUser }                          from '../middleware/requireUser';
import { validate }                             from '../middleware/validate';
import { createUserSchema, loginUserSchema }    from '../schemas/user.schema';
/**
 * Routes to
 *  - login a user
 *  - register a user
 */

//Init router
const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Creates a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's display name.
 *                 example: tom
 *               email:
 *                 type: string
 *                 description: The user's email address. This must be unique and is used for login.
 *                 example: 'tom@mail.com'
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: password123
 *               passwordConfirm:
 *                 type: string
 *                 description: The users password. Must match password property.
 *                 example: password123
 *     responses:
 *       '202':
 *         description: The user was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token
 *       '400':
 *         description: Invalid request body type.
 *       '409':
 *         description: A user with this email address already exists.
 *       '500':
 *         description: Internal server error.
 */
router.post('/register', validate(createUserSchema), registerHandler);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Request to log a user in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address (MongoDB user key)
 *                 example: 'tom@mail.com'
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: password123
 *     responses:
 *       '200':
 *         description: Login request successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: JWT access token
 *       '400':
 *         description: Invalid request body type.
 *       '401':
 *         description: Invalid email or password.
 *       '500':
 *         description: Internal server error.
 */
router.post('/login', validate(loginUserSchema), loginHandler);

//Refresh access token route
router.get('/refresh', refreshAccessTokenHandler);

router.use(deserializeUser, requireUser);

/**
 * @openapi
 * /auth/logout:
 *   get:
 *     summary: Log the current user out
 *     description: Terminates the current user session
 *     responses:
 *       '200':
 *         description: Logout successful
 */
router.get('/logout', logoutHandler);

export default router;