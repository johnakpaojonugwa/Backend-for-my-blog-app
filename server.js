import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import UserRoutes from './routes/user.routes.js';
import PostRoutes from './routes/post.routes.js';
import CommentRoutes from './routes/comment.routes.js'; 


dotenv.config();

const app = express();
app.use(express.json());

app.use(cors())

connectDB();


// auth routes
app.use('/api/v1/auth', authRoutes);
// user routes
app.use('/api/v1/users', UserRoutes);
// post routes
app.use('/api/v1/posts', PostRoutes);
// comment routes
app.use('/api/v1/comments', CommentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${PORT}`);
})