import { Request, Response } from 'express';
import config from '../../config';
import { IUser } from './users.interface';
import { UserModel } from './users.model';
import { UserValidation } from './users.validation';
import bcrypt from 'bcrypt';

const JWT_SECRET = config.jwt_secret;
const JWT_REFRESH_SECRET = config.jwt_refresh_secret;

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      emailVerified,
      passwordHash,
      profile,
      communicationPreferences,
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      passwordHash,
      config.bcrypt_salt_rounds,
    );

    // Create the user object
    const data: IUser = {
      email,
      emailVerified,
      passwordHash: hashedPassword,
      profile,
      communicationPreferences,
    };

    // Validate the user data with Zod
    const validatedData = UserValidation.userValidation.parse(data);

    // Create the user in the database
    const result = await UserModel.create(validatedData);

    // Return the created user, excluding sensitive information like password
    res.status(201).json({
      success: true,
      user: {
        email: result.email,
        emailVerified: result.emailVerified,
        profile: result.profile,
        communicationPreferences: result.communicationPreferences,
      },
    });
  } catch (error: any) {
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
      message: 'Failed to fetch User',
      errorDetails: {
        errorType: error.name || 'UnknownError',
        message:
          error.issues[0].message ||
          'An unexpected error occurred while creating the User.',
        errorPath: error.issues[0].path[0] || 'Unknown path',
        error: error,
      },
    });
  }
};
