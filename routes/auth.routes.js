import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import uploadMiddleware from '../utils/upload.js';

const router = express.Router();

router.post('/sign-up', uploadMiddleware, register);
router.post('/login', login);

export default router;  