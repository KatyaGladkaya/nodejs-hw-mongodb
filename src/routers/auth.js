import express from 'express';
import { registerUser } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../schemas/authSchemas.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUser } from '../controllers/auth.js';
import { loginSchema } from '../schemas/authSchemas.js';
import { refreshSession } from '../controllers/auth.js';
import { logout } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(registerUser));

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUser));

router.post('/refresh', ctrlWrapper(refreshSession));

router.post('/logout', ctrlWrapper(logout));

export default router;
