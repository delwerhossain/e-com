import { IUser } from './users.interface';
import { UserModel } from './users.model';

const CreateUserInDB = async (data: IUser) => {
  const result = await UserModel.create(data);
};

const UserLoginInToDB = async (data: IUser) => {
    
}
const UpdateUserInDB = async (id: string, data: Partial<IUser>) => {
  try {
    // Extract other update data from the incoming data
    const { ...updateData } = data;

    // Fetch the existing user
    const existingUser = await UserModel.findById(id);

    // If the user doesn't exist, throw an error or handle it appropriately
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Update other fields as needed & existingUser is now updated
    Object.assign(existingUser, updateData);

    // Save the updated user
    const result = await existingUser.save();

    return result;
  } catch (error) {
    console.error('Error in updateUserInDB:', error);
    throw error; // Re-throw the error to be caught by the controller
  }
};

const GetSingleUser = async (id: string) => {
    const result = await UserModel.findById(id);
    return result
}

