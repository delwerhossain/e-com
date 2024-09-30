import mongoose from 'mongoose';
import { IAdmin } from '../app/modules/Admin/admin.interface';
import sendResponse from '../shared/sendResponse';
import { Response } from 'express';
import { IUser } from '../app/modules/Users/users.interface';

// Utility function to validate email format
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility function to check for sensitive field updates
// this function can use for admin and user
export const checkForSensitiveFieldUpdate = (
  data: Partial<IAdmin> | Partial<IUser>,
  sensitiveFields: string[],
) => {
  const attemptedSensitiveFields = Object.keys(data).filter(field =>
    sensitiveFields.includes(field),
  );

  if (attemptedSensitiveFields.length > 0) {
    throw new Error(
      `Permission denied: You cannot update the following fields: ${attemptedSensitiveFields.join(', ')}`,
    );
  }
};

// New function to filter out sensitive fields from the data
export const filterSensitiveFields = (
  data: Partial<IAdmin> | Partial<IUser>,
  sensitiveFields: string[],
) => {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => !sensitiveFields.includes(key)),
  );
};

// Utility function for validating inputs (id and email)
export const validateIdOrEmail = (
  id: string | undefined,
  email: string | undefined,
  res: Response,
) => {
  if (!(id || email)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message:
        'Please provide either an ID or an email to search for an admin.',
    });
  }
  if (id && !mongoose.isValidObjectId(id)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Invalid admin ID format provided.',
    });
  }
  if (email && !isValidEmail(email)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Invalid email format provided.',
    });
  }
  return null;
};

// Utility function to build search criteria
export const buildSearchCriteria = (id?: string, email?: string) => {
  const searchCriteria: any = {};
  if (id) searchCriteria._id = id;
  if (email) searchCriteria.email = new RegExp(email, 'i');
  return searchCriteria;
};
