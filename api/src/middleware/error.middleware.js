import { sendError } from "../common/response.js";


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

    // ✅ Default error
    return sendError(res, err.message || 'Something went wrong!');
};