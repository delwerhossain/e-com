import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { UserValidation } from '../users.validation';
import { UserService } from './vendors.services';
import { IUser } from '../users.interface';

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
// Admin-only route for getting all users with advanced search
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit = '2',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      role,
      name,
      email,
      number,
      address,
      isActive,
      emailVerified,
      gender,
      dateOfBirthFrom,
      dateOfBirthTo,
      createdFrom,
      createdTo,
      lastLoginFrom,
      lastLoginTo,
      showDeleted = false, //! todo need fix
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const filter: any = {};
    if (role) filter.role = role;
    if (name) filter['profile.name'] = new RegExp(name as string, 'i');
    if (email) filter.email = new RegExp(email as string, 'i');
    if (number)
      filter['profile.phoneNumber'] = new RegExp(number as string, 'i');
    if (address)
      filter['profile.shippingAddress.city'] = new RegExp(
        address as string,
        'i',
      );
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (emailVerified !== undefined)
      filter.emailVerified = emailVerified === 'true';
    if (gender) filter['profile.gender'] = gender;

    console.log({ filter });
    // Date filters
    if (dateOfBirthFrom || dateOfBirthTo) {
      filter['profile.dateOfBirth'] = {
        ...(dateOfBirthFrom && { $gte: new Date(dateOfBirthFrom as string) }),
        ...(dateOfBirthTo && { $lte: new Date(dateOfBirthTo as string) }),
      };
    }
    if (createdFrom || createdTo) {
      filter.createdAt = {
        ...(createdFrom && { $gte: new Date(createdFrom as string) }),
        ...(createdTo && { $lte: new Date(createdTo as string) }),
      };
    }
    if (lastLoginFrom || lastLoginTo) {
      filter['lastLogin.timestamp'] = {
        ...(lastLoginFrom && { $gte: new Date(lastLoginFrom as string) }),
        ...(lastLoginTo && { $lte: new Date(lastLoginTo as string) }),
      };
    }

    //! todo => check if user is admin , need to use jwt token
    const isAdmin = req.user?.isAdmin || false;
    if (!isAdmin || showDeleted === 'false') {
      filter.isDelete = { $ne: true };
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Use the optimized DB function
    const result = await UserService.getAllUsersInToDB(
      filter,
      sort,
      pageNumber,
      limitNumber,
      { isAdmin },
    );

    const totalPages = Math.ceil(result.total / limitNumber);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Users retrieved successfully',
      meta: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalRecords: result.total,
        totalPages,
        hasPrevPage: pageNumber > 1,
        hasNextPage: pageNumber < totalPages,
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
    // last login timestamp is not allowed to update
    if (updateData.lastLogin) {
      delete updateData.lastLogin.timestamp;
    }

    // Handle password update if provided
    if (passwordHash) {
      const saltRounds =
        parseInt(config.bcrypt_salt_rounds as string, 10) || 12;
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
    const updatedUser = await UserService.updateAUserInToDB(
      userID,
      validatedData,
    );

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

export const VendorController = {
  getAllUsers,
  createUser,
  getAUser,
  updateAUser,
  deleteAUser,
};