import express from 'express';
import { deleteProfile, getProfile, updateProfile } from '../controllers/user.controller.js';
import { auth } from '../middlewares/authMiddleware.js'
import uploadMiddleware from '../utils/upload.js';

const router = express.Router();

router.get('/me', auth, getProfile);
router.put('/me', auth, uploadMiddleware, updateProfile);
router.delete('/me', auth, deleteProfile);

export default router;  