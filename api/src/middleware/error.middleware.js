import multer from 'multer';
import { sendError, sendBadRequest } from "../common/response.js";


export const errorHandler = (err, req, res, next) => {
    console.error(err);

    // ✅ Mongo duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];

        return sendBadRequest(res, `${field} already exists`);
    }

    // ✅ Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);

        return sendBadRequest(res, 'Validation failed', errors);
    }

    // ✅ Multer file upload errors
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return sendBadRequest(res, 'Image must be 5MB or smaller.');
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return sendBadRequest(res, 'Only image files are allowed.');
        }
        return sendBadRequest(res, err.message);
    }

    // ✅ Default error
    return sendError(res, err.message || 'Something went wrong!');
};