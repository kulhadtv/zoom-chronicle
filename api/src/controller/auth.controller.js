import User from '../schemas/user.schema.js';
import { sendSuccess, sendError, sendCreated, sendBadRequest, sendUnauthorized, asyncHandler } from '../common/response.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (userId, userRole) => {
    return jwt.sign({ userId, role: userRole }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '7d'
    });
};

// Register new user
const register = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (password.length < 6) {
        return sendBadRequest(res, 'Password must be at least 6 characters long');
    }

    if (existingUser) {
        return sendBadRequest(res, 'User with this email or username already exists');
    }

    // Create new user
    const user = new User({
        username,
        email,
        password,
        role: role || 'user' // Default to user role
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    sendCreated(res, 'User registered successfully', {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        token
    });
});

// Login user
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return sendUnauthorized(res, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return sendUnauthorized(res, 'Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.cookie("token", token, {
        httpOnly: true,         
        secure: false,          
        sameSite: "lax",       
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(res, 'Login successful', {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            profile: user.profile
        },
        token
    });
});

// Get current user profile
const getProfile = asyncHandler(async (req, res) => {
    sendSuccess(res, 'Profile retrieved successfully', {
        user: req.user
    });
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
    const updates = { ...req.body };

    delete updates.role;
    delete updates.isActive;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
    );

    sendSuccess(res, 'Profile updated successfully', { user });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await req.user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
        return sendBadRequest(res, 'Current password is incorrect');
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    sendSuccess(res, 'Password changed successfully');
});

// Get all users (Admin only)
const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find();
    const total = await User.countDocuments(users);

    sendSuccess(res, 'Users retrieved successfully', {
        users,
        total
    });
});


// Update user role (Admin only)
const updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;

    if (!['admin', 'editor', 'author', 'user'].includes(role)) {
        return sendBadRequest(res, 'Invalid role');
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        return sendError(res, 'User not found', null, 404);
    }

    sendSuccess(res, 'User role updated successfully', { user });
});

// Deactivate user (Admin only)
const deactivateUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
    ).select('-password');

    if (!user) {
        return sendError(res, 'User not found', null, 404);
    }

    sendSuccess(res, 'User deactivated successfully', { user });
});

const activateUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: true },
        { new: true }
    ).select('-password');
    if (!user) {
        return sendError(res, 'User not found', null, 404);
    }
    sendSuccess(res, 'User activated successfully', { user });
});


export {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    updateUserRole,
    deactivateUser,
    activateUser
};