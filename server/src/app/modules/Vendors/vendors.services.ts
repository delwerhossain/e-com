import {
  checkForSensitiveFieldUpdate,
  filterSensitiveFields,
} from '../../../helpers/validation';
import { IVendor } from './vendors.interface';
import { VendorModel } from './vendors.model';

//! this route only for admin
const getAllVendorsInToDB = async (
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
        // Hide isDelete field if the requester is not an admin
        ...(options.isAdmin ? {} : { isDelete: 0 }),
      },
    },
  ];

  // Execute the aggregation pipeline
  const result = await VendorModel.aggregate(aggregationPipeline, {
    allowDiskUse: true,
  });

  // Get the total count of documents matching the filter
  const total = await VendorModel.countDocuments(filter);

  // Return data and total count
  return { data: result, total };
};

const createVendorInToDB = async (data: any) => {
  try {
    // Create the vendor in the database
    const createData = await VendorModel.create(data);

    const result = {
      email: createData.email,
      emailVerified: createData.emailVerified,
      phoneNumber: createData?.phoneNumber,
    };
    return result;
  } catch (error: any) {
    // Handle duplicate email error
    if (error.code === 11000 && error.keyValue?.email) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

const getAVendorInToDB = async (id: string, email: string) => {
  const searchCriteria: any = {};

  // Add search criteria based on provided query
  if (id) {
    searchCriteria._id = id;
  } else if (email) {
    searchCriteria.email = email;
  }
  // if vendor isDeleted is true then it will not be displayed

  // Find the vendor by either ID or email, excluding the password hash and other sensitive fields
  const result = await VendorModel.findOne(searchCriteria).select(
    '-passwordHash -isDelete -isActive -__v -createdAt -updatedAt',
  );
  return result;
};

const updateAVendorInToDB = async (id: string, data: Partial<IVendor>) => {
  try {
    // Exclude fields that should not be updated
    const sensitiveFields = [
      'role',
      'isActive',
      'isDelete',
      'createdAt',
      'updatedAt',
      'lastLogin',
    ];

    checkForSensitiveFieldUpdate(data, sensitiveFields);

    // Filter out sensitive fields from the data
    const updateData = filterSensitiveFields(data, sensitiveFields);

    // Perform the update
    const updatedVendor = await VendorModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        select: '-passwordHash -role -isDelete -createdAt -updatedAt',
      },
    );

    // Return null if the vendor is not found
    if (!updatedVendor) {
      throw new Error('Vendor not found');
    }

    return updatedVendor;
  } catch (error) {
    throw error; // Re-throw the error to be handled by the controller
  }
};

//! this route only for admin
const deleteAVendorInToDB = async (id: string, isAdmin: boolean) => {
  try {
    if (isAdmin) {
      // Use findByIdAndUpdate to directly search and update the vendor
      const deletedVendor = await VendorModel.findByIdAndUpdate(
        id,
        { $set: { isDelete: true } }, // Mark as deleted (true)
        { new: true },
      );

      // If vendor not found, return null or throw an error
      if (!deletedVendor) {
        throw new Error('Admin not found');
      }

      // Return the updated vendor
      return deletedVendor;
    } else {
      throw new Error('permission denied');
    }
  } catch (error) {
    throw new Error('Failed to update vendor deletion status');
  }
};

const vendorLastLoginInToDB = async (
  id: string,
  ip: string | string[] | undefined,
) => {
  console.log({ id, ip });
  const lastLogin = {
    timestamp: new Date(),
    ip,
  };
  const updatedVendor = await VendorModel.findByIdAndUpdate(
    id,
    { $set: { lastLogin: lastLogin } },
    { new: true },
  );

  if (!updatedVendor) {
    throw new Error('Vendor not found');
  }

  return updatedVendor;
};
export const VendorService = {
  createVendorInToDB,
  getAVendorInToDB,
  updateAVendorInToDB,
  getAllVendorsInToDB,
  deleteAVendorInToDB,
  vendorLastLoginInToDB,
};
