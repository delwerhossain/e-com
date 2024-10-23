import { Request, Response } from 'express';
import { IUser } from './users.interface';
import { UserValidation } from './users.validation';
import { UserService } from './users.services';
import { passwordHashing } from '../../../helpers/passHandle';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { email, passwordHash, emailVerified, phoneNumber } = req.body;

  //! todo => salt rounds value

  // Hash the password with correct salt rounds
  const hashedPassword = await passwordHashing(passwordHash);

  // Create the user object
  const data: IUser = {
    email,
    emailVerified: emailVerified ?? false, // Default to false if not provided
    passwordHash: hashedPassword,
    role: 'user',
    phoneNumber: phoneNumber,
  };

  // Validate the user data with Zod
  const validatedData = UserValidation.userValidation.parse(data);

  // Create the user in the database
  const result = await UserService.createUserInToDB(validatedData);

  // Return the created user, excluding sensitive information like password
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User created successfully',
    data: {
      email: result.email,
      emailVerified: result.emailVerified,
    },
  });
});

//! this route only for admin
// Admin-only route for getting all users with advanced search
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
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
    isDelete,
  } = req.query;
  // todo : need to use JWT for validation  admin
  const isAdmin = true;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const role = 'user'; //! must be search user role

  const filter: any = {};
  if (role) filter.role = role;
  if (name) filter['profile.name'] = new RegExp(name as string, 'i');
  if (email) filter.email = new RegExp(email as string, 'i');
  if (number) filter['profile.phoneNumber'] = new RegExp(number as string, 'i');
  if (address)
    filter['profile.shippingAddress.city'] = new RegExp(address as string, 'i');
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (emailVerified !== undefined)
    filter.emailVerified = emailVerified === 'true';
  if (gender) filter['profile.gender'] = gender;

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

  if (isDelete == 'false') {
    filter.isDelete = { $ne: true };
  }
  if (isDelete == 'true') {
    filter.isDelete = { $ne: false };
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

  // Send the response
  sendResponse(res, {
    statusCode: 200,
    success: true,
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
});

const getAUser = catchAsync(async (req: Request, res: Response) => {
  const { id, email } = req.query;
  // Ensure at least one of id or email is provided
  if (!id && !email) {
    throw new Error(
      'Please provide either an ID or an email to search for a user.',
    );
  }

  // Fetch the user from the database using either ID or email
  const result = await UserService.getAUserInToDB(
    id as string,
    email as string,
  );

  // If the user is not found, return a 404 response
  if (!result) {
    throw new Error('User not found');
  }

  // If the user is found, return the safe user information with a 200 status
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: result, // Returning the user data with sensitive information excluded
  });
});
const updateAUser = catchAsync(async (req: Request, res: Response) => {
  const userID = req.params.id;
  const { passwordHash, profile, ...primitiveData } = req.body;

  // Initialize update operations object
  const updateOperations: Record<string, unknown> = {};

  // Handle profile data if present
  if (profile) {
    const validatedProfile =
      UserValidation.userUpdateValidation.shape.profile.parse(profile);

    // Map validated profile fields to update operations
    if (validatedProfile) {
      Object.entries(validatedProfile).forEach(([key, value]) => {
        if (key === 'shippingAddress' && value) {
          // If shippingAddress is provided, update only its fields
          Object.entries(value).forEach(([addressKey, addressValue]) => {
            if (addressValue !== undefined) {
              updateOperations[`profile.shippingAddress.${addressKey}`] =
                addressValue;
            }
          });
        } else {
          // For other profile fields, add directly
          if (value !== undefined) {
            updateOperations[`profile.${key}`] = value;
          }
        }
      });
    }

    // Handle dateOfBirth separately with validation
    if (validatedProfile?.dateOfBirth) {
      const dateOfBirthString =
        typeof validatedProfile.dateOfBirth === 'string'
          ? validatedProfile.dateOfBirth
          : validatedProfile.dateOfBirth.toISOString().split('T')[0];

      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirthString)) {
        throw new Error('Invalid dateOfBirth format. Expected "YYYY-MM-DD".');
      }

      const parsedDate = new Date(dateOfBirthString);
      const [year, month, day] = dateOfBirthString.split('-').map(Number);

      const isValidDate =
        !isNaN(parsedDate.getTime()) &&
        parsedDate.getUTCFullYear() === year &&
        parsedDate.getUTCMonth() + 1 === month &&
        parsedDate.getUTCDate() === day;

      if (
        parsedDate.getUTCFullYear() < new Date().getFullYear() - 120 ||
        parsedDate.getUTCFullYear() > new Date().getFullYear() - 6
      ) {
        throw new Error('Invalid dateOfBirth. The year provided is not valid.');
      }

      if (!isValidDate) {
        throw new Error(
          'Invalid dateOfBirth. The date provided does not exist.',
        );
      }

      updateOperations['profile.dateOfBirth'] = parsedDate;
    }

    // Handle primitive data (outside of profile)
    if (primitiveData) {
      // Remove lastLogin from primitiveData if present
      if (primitiveData.lastLogin?.timestamp) {
        delete primitiveData.lastLogin.timestamp;
      }

      // Handle password update if provided
      if (passwordHash) {
        primitiveData.passwordHash = await passwordHashing(passwordHash);
      }

      // Combine primitiveData with profile updates
      Object.assign(updateOperations, primitiveData);
    }

    // Ensure that at least one update operation is present
    if (!Object.keys(updateOperations).length) {
      throw new Error('Invalid data provided. Please provide valid data.');
    }

    // Validate the final update data using Zod
    const validatedPrimitiveData =
      UserValidation.userUpdateValidation.safeParse(updateOperations);
    if (!validatedPrimitiveData.success) {
      throw new Error('Invalid data provided. Please provide valid data.');
    }
    console.log({ updateOperations });
    // Update the user in the database
    const updatedUser = await UserService.updateAUserInToDB(
      userID,
      updateOperations as Partial<IUser>,
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    // Return the updated user data
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User updated successfully!',
      data: updatedUser,
    });
  }
});

//! this route only for admin
const deleteAUser = catchAsync(async (req: Request, res: Response) => {
  const userID = req.params.id;
  const deletedUser = await UserService.deleteAUserInToDB(userID);
  if (!deletedUser) {
    throw new Error('User not found');
  }
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully!',
    data: deletedUser,
  });
});

export const UserController = {
  getAllUsers,
  createUser,
  getAUser,
  updateAUser,
  deleteAUser,
};
