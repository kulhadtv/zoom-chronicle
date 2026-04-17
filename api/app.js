import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postsRoute from './src/routes/posts.route.js';
import authRoute from './src/routes/auth.route.js';
import cookieParser from 'cookie-parser';
import { errorHandler } from './src/middleware/error.middleware.js';

dotenv.config();

const app = express();

app.use(cors( process.env.NODE_ENV === 'production' ? { origin: process.env.FRONTEND_URL, credentials: true } : {} ));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/posts', postsRoute);
app.use('/api/auth', authRoute);

app.get('/health', (req, res) => {
  res.json({ message: 'API is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;