import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import uploadMiddleware from '../utils/upload.js';
import { validateRegister, validateLogin } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/sign-up', validateRegister, uploadMiddleware, register);
router.post('/login', validateLogin, login);

export default router;  