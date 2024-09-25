import {
  buildSearchCriteria,
  filterSensitiveFields,
} from '../../../../helpers/validation';
import { IAdmin } from './../admin.interface';
import { AdminModel } from './../admin.model';

// Get super admin from DB by id or email
const getSuperAdminInToDB = async (id: string, email: string) => {
  try {
    const searchCriteria = buildSearchCriteria(id, email);
    const result =
      await AdminModel.findOne(searchCriteria).select('-passwordHash');

    if (!result) {
      throw new Error('Admin not found');
    }

    return result;
  } catch (error: any) {
    throw new Error('Error retrieving admin');
  }
};

// Update super admin in DB with data, filtering sensitive fields
const updateSuperAdminInDB = async (
  id: string,
  data: Partial<IAdmin>,
  isSuperAdmin: boolean,
) => {
  try {
    const sensitiveFields = [
      'role',
      'isActive',
      'isDelete',
      'createdAt',
      'updatedAt',
    ];

    // Filter out sensitive fields from the update data
    const updateData = filterSensitiveFields(data, sensitiveFields);

    // Update the admin in the database
    const updatedAdmin = await AdminModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, select: '-passwordHash -isDelete' },
    );

    if (!updatedAdmin) {
      throw new Error('Admin not found');
    }

    return updatedAdmin;
  } catch (error) {
    throw new Error('Error updating admin');
  }
};

export const SuperAdminServices = {
  getSuperAdminInToDB,
  updateSuperAdminInDB,
};
