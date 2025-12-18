import express from 'express';
import { auth } from '../middlewares/authMiddleware.js'
import { addComment, getPostComments } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/:postId', auth, addComment);
router.get('/:postId/comment', auth, getPostComments);

export default router;