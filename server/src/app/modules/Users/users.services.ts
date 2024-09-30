import {
  checkForSensitiveFieldUpdate,
  filterSensitiveFields,
} from '../../../helpers/validation';
import { IUser } from './users.interface';
import { UserModel } from './users.model';

const createUserInToDB = async (data: any) => {
  try {
    // Create the user in the database
    const result = await UserModel.create(data);
    return result;
  } catch (error: any) {
    // Handle duplicate email error
    if (error.code === 11000 && error.keyValue?.email) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

const getAUserInToDB = async (id: string, email: string) => {
  const searchCriteria: any = {};

  // Add search criteria based on provided query
  if (id) {
    searchCriteria._id = id;
  } else if (email) {
    searchCriteria.email = email;
  }
  // if user isDeleted is true then it will not be displayed

  // Find the user by either ID or email, excluding the password hash and other sensitive fields
  const result = await UserModel.findOne(searchCriteria).select(
    '-passwordHash -isDelete -isActive -__v -createdAt -updatedAt',
  );
  return result;
};
const updateAUserInToDB = async (id: string, data: Partial<IUser>) => {
  try {
    // Exclude fields that should not be updated
    const sensitiveFields = [
      'role',
      'isActive',
      'isDelete',
      'createdAt',
      'updatedAt',
    ];

    checkForSensitiveFieldUpdate(data, sensitiveFields);

    // Filter out sensitive fields from the data
    const updateData = filterSensitiveFields(data, sensitiveFields);

    // Find and update the user //! For updateOne we can user email if we use  findByOneAndUpdate
    // Perform the update
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        select: '-passwordHash -role -isDelete -createdAt -updatedAt',
      }, // Exclude sensitive fields
    );

    // Return null if the user is not found
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    throw error; // Re-throw the error to be handled by the controller
  }
};
//! this route only for admin
const getAllUsersInToDB = async (
  filter: any,
  sort: any,
  page: number,
  limit: number,
  options: { isAdmin: boolean },
) => {
  const skip = (page - 1) * limit;

  // Aggregation pipeline to optimize filtering and search
  const aggregationPipeline = [
    { $match: filter }, // Apply the filters
    { $sort: sort }, // Sort results
    { $skip: skip }, // Pagination skip
    { $limit: limit }, // Pagination limit
    {
      $project: {
        passwordHash: 0,
        // isDelete: 0, // Hide isDelete if not admin
        // ...(options.isAdmin ? {} : { isDelete: { $ne: true } }), // Allow deleted users only for admin
      },
    },
  ];

  // Execute the aggregation pipeline
  const result = await UserModel.aggregate(aggregationPipeline, {
    allowDiskUse: true,
  });

  // Get the total count of documents matching the filter
  const total = await UserModel.countDocuments(filter);

  // Return data and total count
  return { data: result, total };
};

//! this route only for admin
const deleteAUserInToDB = async (id: string) => {
  try {
    // Use findByIdAndUpdate to directly search and update the user
    const deletedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: { isDelete: true } }, // Mark as deleted (true)
      { new: true },
    );

    // If user not found, return null or throw an error
    if (!deletedUser) {
      return null;
    }

    // Return the updated user
    return deletedUser;
  } catch (error) {
    throw new Error('Failed to update user deletion status');
  }
};

export const UserService = {
  createUserInToDB,
  getAUserInToDB,
  updateAUserInToDB,
  getAllUsersInToDB,
  deleteAUserInToDB,
};
