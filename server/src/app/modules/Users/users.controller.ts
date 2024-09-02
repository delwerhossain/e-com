import { Request, Response } from 'express';
import config from '../../config';
import { IUser } from './users.interface';
import { UserValidation } from './users.validation';
import bcrypt from 'bcrypt';
import { UserService } from './users.services';
import { MongoServerError } from 'mongodb';

const createUser = async (req: Request, res: Response) => {
  try {
    const { email, passwordHash } = req.body;

    // Parse salt rounds with a fallback to a default value if parsing fails
    const saltRounds = parseInt(config.bcrypt_salt_rounds as string, 10) || 12;

    // Hash the password with correct salt rounds
    const hashedPassword = await bcrypt.hash(passwordHash, saltRounds);

    // Create the user object
    const data: IUser = {
      email,
      emailVerified: req.body.emailVerified ?? false, // Default to false if not provided
      passwordHash: hashedPassword,
      role: 'user',
    };

    // Validate the user data with Zod
    const validatedData = UserValidation.userValidation.parse(data);

    // Create the user in the database
    const result = await UserService.createUserInToDB(validatedData);

    // Return the created user, excluding sensitive information like password
    res.status(201).json({
      success: true,
      user: {
        email: result.email,
        emailVerified: result.emailVerified,
      },
    });
  } catch (error: any) {
    // Handle MongoDB duplicate key error
    if (error instanceof MongoServerError && error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0]; // Get the field that caused the duplication
      return res.status(409).json({
        success: false,
        message: `The ${duplicateField} "${error.keyValue[duplicateField]}" is already in use.`,
      });
    }

    if (error.name === 'ZodError') {
      // Handle validation errors
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    // Handle any other errors
    console.error('Error in createUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create User',
      errorDetails: {
        errorType: error.name || 'UnknownError',
        message:
          error.message ||
          'An unexpected error occurred while creating the User.',
      },
    });
  }
};

const getAUser = async (req: Request, res: Response) => {
  try {
    const { id, email } = req.query;

    // Ensure at least one of id or email is provided
    if (!id && !email) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide either an ID or an email to search for a user.',
      });
    }

    // Fetch the user from the database using either ID or email
    const result = await UserService.getAUserInToDB({ id, email });

    // If the user is not found, return a 404 response
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If the user is found, return the safe user information with a 200 status
    res.status(200).json({
      success: true,
      user: result, // Returning the user data with sensitive information excluded
    });
  } catch (error: any) {
    // Handle MongoDB-specific errors
    if (error instanceof MongoServerError) {
      return res.status(500).json({
        success: false,
        message: 'Database error occurred while fetching the user',
        errorDetails: {
          errorType: error.name || 'MongoServerError',
          message: error.message || 'Unexpected database error.',
        },
      });
    }

    if (error.name === 'ZodError') {
      // Handle validation errors
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    // Handle any other errors
    console.error('Error in getAUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve the user',
      errorDetails: {
        errorType: error.name || 'UnknownError',
        message:
          error.message ||
          'An unexpected error occurred while retrieving the user.',
      },
    });
  }
};
const updateAUser = async (req: Request, res: Response) => {
  try {
    const userID = req.params.id;
    const { passwordHash, ...updateData } = req.body;

    // Handle password update if provided
    if (passwordHash) {
      const saltRounds = parseInt(config.bcrypt_salt_rounds as string, 10) || 12;
      updateData.passwordHash = await bcrypt.hash(passwordHash, saltRounds);
    }

    // Check if there's any data to update
    if (!Object.keys(updateData).length) {
      return res.status(400).json({
        success: false,
        message: 'No update data provided.',
      });
    }

    // Validate the update data using Zod
    const validatedData = UserValidation.userUpdateValidation.parse(updateData);

    // Update the user in the database
    const updatedUser = await UserService.updateAUserInToDB(userID, validatedData);

    // If the user is not found, return a 404 response
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Return the updated user data
    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    // Handle MongoDB-specific errors
    if (error instanceof MongoServerError) {
      return res.status(500).json({
        success: false,
        message: 'Database error occurred while updating the user.',
        errorDetails: {
          errorType: error.name || 'MongoServerError',
          message: error.message || 'Unexpected database error.',
        },
      });
    }

    // Handle validation errors from Zod
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error.',
        errors: error.errors,
      });
    }

    // Handle any other errors
    console.error('Error in updateAUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update the user.',
      errorDetails: {
        errorType: error.name || 'UnknownError',
        message: error.message || 'An unexpected error occurred while updating the user.',
      },
    });
  }
};

export const UserController = {
  createUser,
  getAUser,
  updateAUser,
};
