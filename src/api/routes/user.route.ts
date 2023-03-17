import express                              from 'express';
import { /*getAllUsersHandler,*/ getMeHandler } from '../controllers/user.controller';
import { deserializeUser }                  from '../middleware/deserializeUser';
import { requireUser }                      from '../middleware/requireUser';
// import { restrictTo }                       from '../middleware/restrictTo';

/**
 * Routes to 
 *  - get all users (admin only) 
 *  - get the currently logged-in users credentials (all)
 */

//Init router
const router = express.Router();

//Configure router to use middleware
router.use(deserializeUser, requireUser);

//Admin get users route
// router.get('/', restrictTo('admin'), getAllUsersHandler);

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Retrieves user details
 *     tags: ['users']
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: 'Successfully returned user data'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The users ID
 *                       example: 64136604be11d090766433d6
 *                     email:
 *                       type: string
 *                       description: The user's email address.
 *                       example: 'tom@mail.com'
 *                     role:
 *                       type: string
 *                       description: The user's role.
 *                       example: user
 *                     createdAt:
 *                       type: string
 *                       description: Date user account created
 *                       example: 2023-03-16T18:55:00.591Z
 *                     updatedAt:
 *                       type: string
 *                       description: Date user information last updated
 *                       example: 2023-03-16T18:55:00.591Z
 *       '401':
 *         description: User not logged in.
 *       '500':
 *         description: Internal server error.
 *                     
 */
router.get('/me', getMeHandler);

export default router;

/**
 * TODO:
 *  - add routes for update user information and handlers in user controller
 */