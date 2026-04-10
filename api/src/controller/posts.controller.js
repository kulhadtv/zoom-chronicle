import Post from '../schemas/post.schema.js';
import { sendSuccess, sendError, sendCreated, sendNotFound, sendBadRequest, asyncHandler } from '../common/response.js';
import { PAGINATION_DEFAULTS, SORT_OPTIONS, POST_CATEGORIES, POST_STATUS } from '../common/constants.js';
import cloudinary from '../config/cloudinary.config.js';
import fs from 'fs';
import slugify from 'slugify';

// Get all posts with filtering, sorting, and pagination
const getAllPosts = asyncHandler(async (req, res) => {
  const {
    page = PAGINATION_DEFAULTS.PAGE,
    limit = PAGINATION_DEFAULTS.LIMIT,
    category,
    tag,
    status = POST_STATUS.PUBLISHED,
    sort = 'newest',
    search,
    startDate,
    endDate
  } = req.query;

  const query = { status };

  // Add category filter
  if (category && Object.values(POST_CATEGORIES).includes(category)) {
    query.category = category;
  }

  // Add tag filter
  if (tag) {
    query.tags = { $in: [tag] };
  }

  // Add search filter
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } }
    ];
  }

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const options = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), PAGINATION_DEFAULTS.MAX_LIMIT),
    sort: SORT_OPTIONS[sort.toUpperCase()] || SORT_OPTIONS.NEWEST,
    select: '-__v'
  };

  const posts = await Post.find(query)
    .sort(options.sort)
    .limit(options.limit)
    .skip((options.page - 1) * options.limit)
    .select(options.select);

  const total = await Post.countDocuments(query);

  sendSuccess(res, 'Posts retrieved successfully', {
    posts,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      pages: Math.ceil(total / options.limit)
    }
  });
});

const getAllPostAdmin = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search
  } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = Math.min(parseInt(limit), 100);
  const skip = (pageNumber - 1) * limitNumber;

  // 🔥 ADD QUERY OBJECT
  let query = {};

  // ✅ SEARCH LOGIC
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } }
    ];
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  const total = await Post.countDocuments(query);

  sendSuccess(res, 'All posts retrieved successfully', {
    posts,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber)
    }
  });
});

// Get posts by date range
const getPostsByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return sendBadRequest(res, 'Both startDate and endDate are required');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // ✅ include full end date
  end.setHours(23, 59, 59, 999);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return sendBadRequest(res, 'Invalid date format. Use YYYY-MM-DD');
  }

  const posts = await Post.find({
    createdAt: { $gte: start, $lte: end },
    status: POST_STATUS.PUBLISHED
  }).sort({ createdAt: -1 });

  sendSuccess(res, 'Posts retrieved by date range', { posts });
});

// Get trending posts (most viewed in last 30 days)
const getTrendingPosts = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const posts = await Post.find({
    createdAt: { $gte: thirtyDaysAgo },
    status: POST_STATUS.PUBLISHED
  })
    .sort({ views: -1 })
    .limit(10);

  sendSuccess(res, 'Trending posts retrieved', { posts });
});

// Get posts by category
const getPostsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;


  if (!Object.values(POST_CATEGORIES).includes(category)) {
    return sendBadRequest(res, 'Invalid category');
  }

  const posts = await Post.find({
    category,
    status: POST_STATUS.PUBLISHED
  })


  const total = await Post.countDocuments({ category, status: POST_STATUS.PUBLISHED });

  sendSuccess(res, `${category} posts retrieved`, {
    posts,
  });
});

// Get posts by tags
const getPostsByTags = asyncHandler(async (req, res) => {
  const { tags } = req.query; // comma-separated tags

  if (!tags) {
    return sendBadRequest(res, 'Tags parameter is required');
  }

  const tagArray = tags.split(',').map(tag => tag.trim());
  const posts = await Post.find({
    tags: { $in: tagArray },
    status: POST_STATUS.PUBLISHED
  }).sort({ createdAt: -1 });

  sendSuccess(res, 'Posts retrieved by tags', { posts });
});

// Get single post by ID
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return sendNotFound(res, 'Post not found');
  }

  // Increment view count
  post.views += 1;
  await post.save();

  sendSuccess(res, 'Post retrieved successfully', { post });
});

// Get post by slug
const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });

  if (!post) {
    return sendNotFound(res, 'Post not found');
  }

  // Increment view count
  post.views += 1;
  await post.save();

  sendSuccess(res, 'Post retrieved successfully', { post });
});

const getlatestSlugs = asyncHandler(async(req, res) => {
  const latestSlugs = await Post.find({}).sort({ createdAt: -1 }).limit(5).select('slug');
  sendSuccess(res, 'Latest slugs retrieved successfully', { latestSlugs });
})

const getPostWithMoreViews = asyncHandler(async (req, res) => {
  const topPost = await Post.findOne().sort({ views: -1 });

  if (!topPost) {
    return sendNotFound(res, 'No posts found');
  }

  const moreViewsPosts = await Post.find({
    _id: { $ne: topPost._id },
    status: POST_STATUS.PUBLISHED
  })
    .sort({ views: -1 })
    .limit(5);

  sendSuccess(res, 'Post retrieved successfully', { moreViewsPosts });
});

const createPost = asyncHandler(async (req, res) => {

  let imageUrls = [];

  try {
    // 🔥 Generate slug from title
    let baseSlug = slugify(req.body.title, { lower: true, strict: true });

    let slug = baseSlug;
    let count = 1;



    // 🔁 Ensure unique slug
    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }
    console.log('Generated slug:', slug);

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
      }
    }

    const postData = {
      ...req.body,
      slug, // ✅ auto-generated slug
      images: imageUrls,
      author: req.user._id
    };

    const post = new Post(postData);
    const newPost = await post.save();

    sendCreated(res, 'Post created successfully', { post: newPost });

  } catch (error) {
    if (imageUrls.length > 0) {
      for (const url of imageUrls) {
        const publicId = url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    throw error;
  }
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return sendNotFound(res, 'Post not found');
  }

  // ✅ Check ownership
  if (
    req.user.role !== 'admin' &&
    post.author.toString() !== req.user._id.toString()
  ) {
    return sendForbidden(res, 'You can only update your own posts');
  }

  let newImageUrls = [];

  try {
    // ✅ If new images uploaded
    if (req.files && req.files.length > 0) {

      // 🔴 1. Delete old images from Cloudinary
      if (post.images && post.images.length > 0) {
        for (const url of post.images) {
          try {
            const publicId = url.split('/upload/')[1].split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.log('Delete error:', err.message);
          }
        }
      }

      // 🟢 2. Upload new images
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        newImageUrls.push(result.secure_url);

        // optional: delete temp file
        // fs.unlinkSync(file.path);
      }

      // 🟢 3. Replace images
      post.images = newImageUrls;
    }

    // ✅ Update other fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        post[key] = req.body[key];
      }
    });

    const updatedPost = await post.save();

    sendSuccess(res, 'Post updated successfully', { post: updatedPost });

  } catch (error) {

    // ❌ If upload fails → rollback new uploads
    if (newImageUrls.length > 0) {
      for (const url of newImageUrls) {
        const publicId = url.split('/upload/')[1].split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    throw error;
  }
});

// Delete post (Admin or post author only)
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return sendNotFound(res, 'Post not found');
  }

  // Check ownership or admin access
  if (req.user.role !== 'admin' && post.author.toString() !== req.user._id.toString()) {
    return sendForbidden(res, 'You can only delete your own posts');
  }

  await post.deleteOne();
  sendSuccess(res, 'Post deleted successfully');
});

// Like/Unlike post
const toggleLikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return sendNotFound(res, 'Post not found');
  }

  // For simplicity, just increment likes. In real app, you'd track user likes
  post.likes += 1;
  await post.save();

  sendSuccess(res, 'Post liked successfully', { post });
});

export {
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
};