import { IUser } from './users.interface';
import { UserModel } from './users.model';

interface UserQuery {
  id?: string;
  email?: string;
}

const createUserInToDB = async (data: any) => {
  // Create the user in the database
  const result = await UserModel.create(data);
  return result;
};

const getAUserInToDB = async (query: { id?: string; email?: string }) => {
  const searchCriteria: any = {};

  // Add search criteria based on provided query
  if (query.id) {
    searchCriteria._id = query.id;
  }
  if (query.email) {
    searchCriteria.email = query.email;
  }

  // Find the user by either ID or email, excluding the password hash and other sensitive fields
  const result = await UserModel.findOne(searchCriteria).select(
    '-passwordHash -isDelete -isActive -__v -createdAt -updatedAt',
  );
  return result;
};
const updateAUserInToDB = async (id: string, data: Partial<IUser>) => {
  try {
    // Exclude fields that should not be updated
    const sensitiveFields = ['role', 'isDelete', 'createdAt', 'updatedAt'];

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !sensitiveFields.includes(key)),
    );

    // Find and update the user //! For updateOne we can user email if we use  findByOneAndUpdate
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      select: '-passwordHash -role -isDelete -createdAt -updatedAt', // Exclude sensitive fields
    });

    // Return null if the user is not found
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    console.error('Error in updateAUserInToDB:', error);
    throw error; // Re-throw the error to be handled by the controller
  }
};

export const UserService = {
  createUserInToDB,
  getAUserInToDB,
  updateAUserInToDB,
};
