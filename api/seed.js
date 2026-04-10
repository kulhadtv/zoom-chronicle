import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import Post from './src/schemas/post.schema.js';
import User from './src/schemas/user.schema.js';
import { POST_CATEGORIES, POST_STATUS } from './src/common/constants.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@zoomchronicle.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        username: 'admin',
        email: 'admin@zoomchronicle.com',
        password: hashedPassword,
        role: 'admin',
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          bio: 'System Administrator'
        }
      });
      await admin.save();
      console.log('Admin user created: admin@zoomchronicle.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Read the clean data
    const dataPath = path.join(process.cwd(), 'src', 'clean-data.json');
    const postsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Add default category and status to posts
    const adminUser = adminExists || await User.findOne({ role: 'admin' });
    const postsWithDefaults = postsData.map(post => ({
      ...post,
      category: post.category || POST_CATEGORIES.NEWS,
      status: post.status || POST_STATUS.PUBLISHED,
      tags: post.tags || [],
      author: adminUser._id
    }));

    // Insert new posts
    const posts = await Post.insertMany(postsWithDefaults);
    console.log(`Seeded ${posts.length} posts successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();