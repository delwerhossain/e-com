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
    const searchCriteria: any = {};

    // Add search criteria based on provided query
    if (id) {
      searchCriteria._id = id;
    } else if (email) {
      searchCriteria.email = email;
    }

    // Find the admin by either ID or email, excluding the password hash and other sensitive fields
    const result = await AdminModel.findOne(searchCriteria).select(
      '-passwordHash -isDelete -isActive -__v -createdAt -updatedAt',
    );
    return result;
  } catch (error) {
    throw error;
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

const updateAdminInDB = async (id: string, data: Partial<IAdmin>) => {
  try {
    let sensitiveFields: any[] = [];
    let sensitiveFieldShow;
    // if role is superAdmin then sensitive fields show and update , else if role is admin then sensitive fields not show and update
    if (data?.role === 'admin') {
      sensitiveFields = [
        'role',
        'isActive',
        'isDelete',
        'createdAt',
        'updatedAt',
      ];
      sensitiveFieldShow =
        '-passwordHash -role -isDelete -createdAt -updatedAt';
    }

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !sensitiveFields.includes(key)),
    );

    // Find and update the admin
    const updateAdmin = await AdminModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, select: sensitiveFieldShow },
    );
    if (!updateAdmin) {
      throw new Error('Admin not found');
    }
    return updateAdmin;
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
