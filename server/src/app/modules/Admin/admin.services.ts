import {
  buildSearchCriteria,
  checkForSensitiveFieldUpdate,
  filterSensitiveFields,
} from '../../../helpers/validation';
import { IAdmin } from './admin.interface';
import { AdminModel } from './admin.model';

const getAllAdminInToDB = async (
  filter: any,
  sort: any,
  page: number,
  limit: number,
  options: { isSuperAdmin: boolean },
) => {
  const skip = (page - 1) * limit;
  const aggregationPipeline = [
    { $match: filter }, // Apply the filters
    { $sort: sort }, // Sort results
    { $skip: skip }, // Pagination skip
    { $limit: limit }, // Pagination limit
    {
      $project: {
        passwordHash: 0,
        ...(options.isSuperAdmin ? {} : { isDelete: 0 }),
      },
    },
  ];

  const result = await AdminModel.aggregate(aggregationPipeline, {
    allowDiskUse: true,
  });

  const total = await AdminModel.countDocuments(filter);

  return {
    data: result,
    total,
  };
};

const getAdminInToDB = async (id: string, email: string) => {
  try {
    const searchCriteria = buildSearchCriteria(id, email);
    const result = await AdminModel.findOne(searchCriteria).select(
      '-passwordHash -isDelete -isActive -__v -createdAt -updatedAt',
    );
    if (!result) {
      throw new Error('Admin not found');
    }
    // is user is superAdmin then it will not be displayed
    if (result.role === 'superAdmin') {
      throw new Error('Permission denied');
    }
    return result;
  } catch (error: any) {
    throw new Error(`Error retrieving admin`);
  }
};

// create only admin, //! not superAdmin
const createAdminInToDB = async (payload: any) => {
  try {
    // Create the admin in the database
    const createAdmin = await AdminModel.create(payload);
    const result = {
      email: createAdmin.email,
      emailVerified: createAdmin.emailVerified,
      permissions: createAdmin.permissions,
      role: 'admin',
    };

    return result;
  } catch (error: any) {
    // Handle duplicate email error
    if (error.code === 11000 && error?.keyValue?.email) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

const updateAdminInDB = async (
  id: string,
  data: Partial<IAdmin>,
  isSuperAdmin: boolean,
  adminIdFromJWT: string,
) => {
  try {
    const sensitiveFields = [
      'role',
      'isActive',
      'isDelete',
      'createdAt',
      'updatedAt',
    ];

    // Check for sensitive field updates if not super admin
    if (!isSuperAdmin) {
      checkForSensitiveFieldUpdate(data, sensitiveFields);
    }

    // Filter out sensitive fields from the data
    const updateData = filterSensitiveFields(data, sensitiveFields);

    const isSelfUpdate = id === adminIdFromJWT;
    if (!isSuperAdmin && !isSelfUpdate) {
      throw new Error('Unauthorized to update this admin');
    }

    // Update the admin and return result
    const updatedAdmin = await AdminModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        select: isSuperAdmin
          ? ''
          : '-passwordHash -isDelete -createdAt -updatedAt',
      },
    );

    if (!updatedAdmin) {
      throw new Error('Admin not found');
    }

    return updatedAdmin;
  } catch (error) {
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

const deleteAdminInDB = async (id: string, isSuperAdmin: boolean) => {
  try {
    if (isSuperAdmin) {
      const deletedAdmin = await AdminModel.findByIdAndUpdate(
        id,
        { $set: { isDelete: true } }, // Mark as deleted (true)
        { new: true },
      );

      if (!deletedAdmin) {
        throw new Error('Admin not found');
      }
    } else {
      throw new Error('permission denied');
    }
  } catch (error: any) {}
};
export const AdminServices = {
  getAllAdminInToDB,
  getAdminInToDB,
  createAdminInToDB,
  updateAdminInDB,
  deleteAdminInDB,
};
