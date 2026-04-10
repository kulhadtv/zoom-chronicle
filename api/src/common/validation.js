import mongoose from 'mongoose';
import { POST_CATEGORIES, POST_STATUS } from './constants.js';

// Validation middleware for post creation/update
export const validatePostData = (req, res, next) => {

  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  const { title, content, images, tags, category, status } = req.body;
  const errors = [];

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!content || typeof content !== 'string' || content.trim().length < 10) {
    errors.push('Content must be at least 10 characters');
  }

  // if (typeof slug !== 'string' || !slugRegex.test(slug)) {
  //   errors.push('Slug must be URL-friendly');
  // }

  if (images) {
    if (!Array.isArray(images)) {
      errors.push('Images must be an array');
    } else if (!images.every(img => typeof img === 'string')) {
      errors.push('Each image must be a string');
    }
  }

  if (tags) {
    if (!Array.isArray(tags)) {
      errors.push('Tags must be an array');
    } else if (!tags.every(tag => typeof tag === 'string')) {
      errors.push('Each tag must be a string');
    }
  }

  if (category && !Object.values(POST_CATEGORIES).includes(category)) {
    errors.push('Invalid category');
  }

  if (status && !Object.values(POST_STATUS).includes(status)) {
    errors.push('Invalid status');
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for MongoDB ObjectId
export const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  next();
};

// General validation middleware for required fields
export const validateRequired = (fields) => {
  return (req, res, next) => {
    const errors = [];

    fields.forEach(field => {
      if (!req.body[field]) {
        errors.push(`${field} is required`);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};