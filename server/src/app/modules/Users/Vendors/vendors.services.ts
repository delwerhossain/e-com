import { IUser } from "../users.interface";
import { UserModel } from "../users.model";


//! this route only for admin
const getAllVendorsInToDB = async (
  filter: any,
  sort: any,
  page: number,
  limit: number,
  options: { isAdmin: boolean }
) => {
  const skip = (page - 1) * limit;

  // Aggregation pipeline to optimize filtering and search
  const aggregationPipeline = [
    { $match: filter },  // Apply the filters
    { $sort: sort },     // Sort results
    { $skip: skip },     // Pagination skip
    { $limit: limit },   // Pagination limit
    {
      $project: {
        passwordHash: 0,
        // Hide isDelete field if the requester is not an admin
        ...(options.isAdmin ? {} : { isDelete: 0 }),
      },
    },
  ];

  // Execute the aggregation pipeline
  const result = await UserModel.aggregate(aggregationPipeline, { allowDiskUse: true });

  // Get the total count of documents matching the filter
  const total = await UserModel.countDocuments(filter);

  // Return data and total count
  return { data: result, total };
};


const createVendorInToDB = async (data: any) => {
  try {
    // Create the vendor in the database
    const createData = await UserModel.create(data);
    
    const result = {
      email: createData.email,
      emailVerified: createData.emailVerified,
      phoneNumber: createData?.phoneNumber
    }
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
  const result = await UserModel.findOne(searchCriteria).select(
    '-passwordHash -isDelete -isActive -__v -createdAt -updatedAt',
  );
  return result;
};
const updateAVendorInToDB = async (id: string, data: Partial<IUser>) => {
  try {
    // Exclude fields that should not be updated
    const sensitiveFields = [
      'role',
      'isActive',
      'isDelete',
      'createdAt',
      'updatedAt',
    ];

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !sensitiveFields.includes(key)),
    );

    // Find and update the vendor //! For updateOne we can vendor email if we use  findByOneAndUpdate
  // Perform the update
  const updatedVendor = await UserModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true, select: '-passwordHash -role -isDelete -createdAt -updatedAt' } // Exclude sensitive fields
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
const deleteAVendorInToDB = async (id: string) => {
  try {
    // Use findByIdAndUpdate to directly search and update the vendor
    const deletedVendor = await UserModel.findByIdAndUpdate(
      id,
      { $set: { isDelete: true } }, // Mark as deleted (true)
      { new: true },
    );

    // If vendor not found, return null or throw an error
    if (!deletedVendor) {
      return null;
    }

    // Return the updated vendor
    return deletedVendor;
  } catch (error) {
    throw new Error('Failed to update vendor deletion status');
  }
};

export const VendorService = {
  createVendorInToDB,
  getAVendorInToDB,
  updateAVendorInToDB,
  getAllVendorsInToDB,
  deleteAVendorInToDB,
};
