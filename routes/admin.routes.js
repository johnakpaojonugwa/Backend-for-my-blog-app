import express from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import {
    getAllUsers,
    getAllPostsAdmin,
    deleteUserByAdmin,
    deletePostByAdmin,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(auth);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.get('/posts', getAllPostsAdmin);
router.delete('/users/:id', deleteUserByAdmin);
router.delete('/posts/:id', deletePostByAdmin);

export default router;
