import { NextFunction, Request, Response } from 'express';
import config from '../../config';
import { IUser } from './users.interface';
import { UserValidation } from './users.validation';
import bcrypt from 'bcrypt';
import { UserService } from './users.services';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, passwordHash } = req.body;

    //! todo => salt rounds value 
    // Parse salt rounds with a fallback to default value if parsing fails
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
      statusCode: 201,
      user: {
        email: result.email,
        emailVerified: result.emailVerified,
      },
    });
  } catch (error: any) {
    if (error.message === 'Email already exists') {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please use another email.',
      });
    }
    next(error);
  }
};

//! this route only for admin
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit = '10',
      sortBy,
      sortOrder, // 'asc' or 'desc'
      userType, // 'vendor' or 'user'
      name,
      email,
      number,
      address,
    } = req.query;

    const pageNumber = Array.isArray(page)
      ? parseInt(page[0] as string, 10)
      : parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const filter: any = {};
    if (userType) filter.userType = userType;
    if (name) filter.name = new RegExp(name as string, 'i'); // case-insensitive regex search
    if (email) filter.email = new RegExp(email as string, 'i');
    if (number) filter.number = new RegExp(number as string, 'i');
    if (address) filter.address = new RegExp(address as string, 'i');

    const sort: any = {};
    if (sortBy) sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const result = await UserService.getAllUsersInToDB(
      filter,
      sort,
      pageNumber,
      limitNumber,
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Users retrieved successfully',
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total: result.total,
      },
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
};

const getAUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, email } = req.query;

    // Ensure at least one of id or email is provided
    if (!id && !email) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message:
          'Please provide either an ID or an email to search for a user.',
      });
    }

    // Fetch the user from the database using either ID or email
    const result = await UserService.getAUserInToDB(id, email);

    // If the user is not found, return a 404 response
    if (!result) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'User not found',
      });
    }

    // If the user is found, return the safe user information with a 200 status
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User retrieved successfully',
      user: result, // Returning the user data with sensitive information excluded
    });
  } catch (error: any) {
    next(error);
  }
};
const updateAUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.params.id;
    const userRowData = req.body;
    const { passwordHash, ...updateData } = userRowData;

    // Convert dateOfBirth to Date object if present
    if (updateData.profile?.dateOfBirth) {
      updateData.profile.dateOfBirth = new Date(updateData.profile.dateOfBirth);
    }

    // Handle password update if provided
    if (passwordHash) {
      const saltRounds = parseInt(config.bcrypt_salt_rounds as string, 10) || 12;
      updateData.passwordHash = await bcrypt.hash(passwordHash, saltRounds);
    }

    // Check if there's any data to update
    if (!Object.keys(updateData).length) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'No update data provided',
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
        statusCode: 404,
        message: 'User not found',
      });
    }

    // Return the updated user data
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User updated successfully!',
      data: updatedUser,
    });
  } catch (error: any) {
    next(error);
  }
};


//! this route only for admin
const deleteAUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.params.id;
    const deletedUser = await UserService.deleteAUserInToDB(userID);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'User not found.',
      });
    }
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'USER deleted successfully!',
      data: deletedUser,
    });
  } catch (error: any) {
    next(error);
  }
};

export const UserController = {
  getAllUsers,
  createUser,
  getAUser,
  updateAUser,
  deleteAUser,
};
