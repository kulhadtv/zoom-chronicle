import {
  getAllPosts,
  getPostsByDateRange,
  getTrendingPosts,
  getPostsByCategory,
  getPostsByTags,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  getPostWithMoreViews,
  getAllPostAdmin,
  getlatestSlugs
} from "../controller/posts.controller.js";
import express from 'express';
import { authenticate, requireAuthor, requireAdmin } from '../middleware/auth.middleware.js';
import { validatePostData, validateObjectId } from '../common/validation.js';
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllPosts);
router.get('/trending', getTrendingPosts);
router.get('/more-views', getPostWithMoreViews);

router.get('/all-post-admin',authenticate,requireAdmin, getAllPostAdmin);

router.get('/category/:category', getPostsByCategory);
router.get('/tags', getPostsByTags);
router.get('/slugs', getlatestSlugs)
router.get('/date', getPostsByDateRange);
router.get('/:id', validateObjectId, getPostById);
router.get('/slug/:slug', getPostBySlug);


// Protected routes (authentication required)
router.post('/', authenticate, requireAuthor, upload.array('images', 5), validatePostData, createPost);
router.put('/:id', authenticate, requireAuthor, validateObjectId, upload.array('images', 5), validatePostData, updatePost);
router.delete('/:id', authenticate, requireAuthor, validateObjectId, deletePost);

// Like post (authenticated users)
router.post('/:id/like', authenticate, validateObjectId, toggleLikePost);

export default router;