import express                              from 'express';
import { getAllUsersHandler, getMeHandler } from '../controllers/user.controller';
import { deserializeUser }                  from '../middleware/deserializeUser';
import { requireUser }                      from '../middleware/requireUser';
import { restrictTo }                       from '../middleware/restrictTo';

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

// Get my info route
router.get('/me', getMeHandler);

export default router;
