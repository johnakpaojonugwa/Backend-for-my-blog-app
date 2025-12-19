import express from 'express';
import { createPost, getAllPosts, getMyPosts, deletePost, likePost, dislikePost } from '../controllers/post.controller.js';
import { auth } from '../middlewares/authMiddleware.js'
import uploadMiddleware from '../utils/upload.js';
import { validateCreatePost } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/', auth, validateCreatePost, uploadMiddleware, createPost);
router.get('/', auth, getAllPosts);
router.get('/:id', auth, getMyPosts);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/dislike', auth, dislikePost);

export default router;  