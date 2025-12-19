import express from 'express';
import { auth } from '../middlewares/authMiddleware.js'
import { addComment, getPostComments } from '../controllers/comment.controller.js';
import { validateComment } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/:postId', auth, validateComment, addComment);
router.get('/:postId', auth, getPostComments);

export default router;