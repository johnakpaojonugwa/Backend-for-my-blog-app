import express from 'express';
import { createPost, getAllPosts, getMyPosts, getPostById, deletePost, likePost, dislikePost } from '../controllers/post.controller.js';
import { auth } from '../middlewares/authMiddleware.js'
import uploadMiddleware from '../utils/upload.js';
import { validateCreatePost } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/', auth, uploadMiddleware, validateCreatePost, createPost);
router.get('/', getAllPosts);
router.get('/me', getMyPosts);
router.get('/:id', auth, getPostById);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/dislike', auth, dislikePost);

export default router;  