import express from 'express';
import { deleteProfile, getProfile, updateProfile } from '../controllers/user.controller.js';
import { auth } from '../middlewares/authMiddleware.js'
import uploadMiddleware from '../utils/upload.js';
import { validateUpdateProfile } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.get('/me', auth, getProfile);
router.put('/me', auth, validateUpdateProfile, uploadMiddleware, updateProfile);
router.delete('/me', auth, deleteProfile);

export default router;  