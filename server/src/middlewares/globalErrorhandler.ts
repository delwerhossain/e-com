import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  details?: any;
}

export const globalErrorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Set default status code
  const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  // Determine if stack trace should be included
  const showStack = process.env.NODE_ENV !== 'production';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Validation Error',
      errorDetails: {
        errorType: error.name,
        message: error.message || 'Invalid input data',
        errorPath: error.details?.path || 'Unknown path',
        stack: showStack ? error.stack : undefined,
        error: error.details || error,
      },
    });
  }

  if (error.name === 'MongoError') {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Database Error',
      errorDetails: {
        errorType: error.name,
        message: error.message || 'Database operation failed',
        errorPath: 'Database',
        stack: showStack ? error.stack : undefined,
        error: error,
      },
    });
  }

  if (error.name === 'UnauthorizedError') {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized Access',
      errorDetails: {
        errorType: error.name,
        message: error.message || 'Access denied',
        errorPath: 'Authorization',
        stack: showStack ? error.stack : undefined,
        error: error,
      },
    });
  }

  // For custom operational errors
  if (error.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'An operational error occurred',
      errorDetails: {
        errorType: error.name || 'OperationalError',
        message: error.message || 'An operational error occurred',
        errorPath: 'Unknown path',
        stack: showStack ? error.stack : undefined,
        error: error,
      },
    });
  }

  // For unexpected server errors
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Something went wrong!',
    errorDetails: {
      errorType: error.name || 'UnknownError',
      message: error.message || 'An unexpected error occurred',
      errorPath: 'Unknown path',
      stack: showStack ? error.stack : undefined,
      error: error,
    },
  });
};
