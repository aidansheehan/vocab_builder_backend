import express                                  from 'express';
import { loginHandler, registerHandler }        from '../controllers/auth.controller';
import { validate }                             from '../middleware/validate';
import { createUserSchema, loginUserSchema }    from '../schemas/user.schema';
/**
 * Routes to
 *  - login a user
 *  - register a user
 */

const router = express.Router();

// Register user route
router.post('/register', validate(createUserSchema), registerHandler);

// Login user route
router.post('/login', validate(loginUserSchema), loginHandler);

export default router;