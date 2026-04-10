// Centralized response utilities
export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (res, message, errors = null, statusCode = 500) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Specific response helpers
export const sendCreated = (res, message, data) => {
  return sendSuccess(res, message, data, 201);
};

export const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, null, 404);
};

export const sendBadRequest = (res, message, errors = null) => {
  return sendError(res, message, errors, 400);
};

export const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendError(res, message, null, 401);
};

export const sendForbidden = (res, message = 'Forbidden access') => {
  return sendError(res, message, null, 403);
};

// Async handler wrapper to catch errors
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};