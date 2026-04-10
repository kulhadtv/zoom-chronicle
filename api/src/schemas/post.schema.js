import mongoose from 'mongoose';
import { POST_CATEGORIES, POST_STATUS } from '../common/constants.js';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    trim: true
  },
  excerpt: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    enum: Object.values(POST_CATEGORIES),
    default: POST_CATEGORIES.NEWS
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: Object.values(POST_STATUS),
    default: POST_STATUS.PUBLISHED
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
postSchema.index({ category: 1, status: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

export default mongoose.model('Post', postSchema);