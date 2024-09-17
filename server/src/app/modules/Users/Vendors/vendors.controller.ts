import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { IUser } from '../users.interface';
import { VendorService } from './vendors.services';
import { UserValidation } from '../users.validation';

const createVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, passwordHash ,emailVerified, phoneNumber} = req.body;

    //! todo => salt rounds value
    // Parse salt rounds with a fallback to default value if parsing fails
    const saltRounds = parseInt(config.bcrypt_salt_rounds as string, 10) || 12;

    // Hash the password with correct salt rounds
    const hashedPassword = await bcrypt.hash(passwordHash, saltRounds);

    // Create the vendor object
    const data: IUser = {
      email,
      phoneNumber: phoneNumber,
      emailVerified: emailVerified ?? false, // Default to false if not provided
      passwordHash: hashedPassword,
      role: 'vendor',
      isActive: false,
    };

    // Validate the vendor data with Zod
    const validatedData = UserValidation.vendorValidation.parse(data);

    // Create the vendor in the database
    const result = await VendorService.createVendorInToDB(validatedData);

    // Return the created vendor, excluding sensitive information like password
    res.status(201).json({
      success: true,
      statusCode: 201,
      vendor: {
        email: result.email,
        emailVerified: result.emailVerified,
        phoneNumber: result?.phoneNumber
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
const getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      businessName,
      email,
      contactPhone,
      businessCategory,
      isActive,
      ratingsFrom,
      ratingsTo,
      reviewCountFrom,
      reviewCountTo,
      createdFrom,
      createdTo,
      showDeleted = false,
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    
    // Only search for vendors
    const role = 'vendor'; 

    const filter: any = {};
    if (role) filter.role = role;
    if (businessName) filter['profile.businessName'] = new RegExp(businessName as string, 'i');
    if (email) filter['profile.contactInfo.contactEmail'] = new RegExp(email as string, 'i');
    if (contactPhone) filter['profile.contactInfo.contactPhone'] = new RegExp(contactPhone as string, 'i');
    if (businessCategory) filter['profile.businessCategoryID'] = businessCategory;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Rating filters
    if (ratingsFrom || ratingsTo) {
      filter['profile.ratings.averageRating'] = {
        ...(ratingsFrom && { $gte: parseFloat(ratingsFrom as string) }),
        ...(ratingsTo && { $lte: parseFloat(ratingsTo as string) }),
      };
    }
    
    // Review count filters
    if (reviewCountFrom || reviewCountTo) {
      filter['profile.ratings.reviewCount'] = {
        ...(reviewCountFrom && { $gte: parseInt(reviewCountFrom as string, 10) }),
        ...(reviewCountTo && { $lte: parseInt(reviewCountTo as string, 10) }),
      };
    }

    // Date filters
    if (createdFrom || createdTo) {
      filter.createdAt = {
        ...(createdFrom && { $gte: new Date(createdFrom as string) }),
        ...(createdTo && { $lte: new Date(createdTo as string) }),
      };
    }

    // Only admins can see deleted vendors
    const isAdmin = req.vendor?.isAdmin || false;
    if (!isAdmin || showDeleted === 'false') {
      filter.isDelete = { $ne: true };
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Use the optimized DB function
    const result = await VendorService.getAllVendorsInToDB(
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
      message: 'Vendors retrieved successfully',
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

const getAVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, email } = req.query;

    // Ensure at least one of id or email is provided
    if (!id && !email) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message:
          'Please provide either an ID or an email to search for a vendor.',
      });
    }

    // Fetch the vendor from the database using either ID or email
    const result = await VendorService.getAVendorInToDB(id as string , email as string);

    // If the vendor is not found, return a 404 response
    if (!result) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Vendor not found',
      });
    }

    // If the vendor is found, return the safe vendor information with a 200 status
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Vendor retrieved successfully',
      vendor: result, // Returning the vendor data with sensitive information excluded
    });
  } catch (error: any) {
    next(error);
  }
};
const updateAVendor = async (req: Request, res: Response, next: NextFunction) => {
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
    const validatedData = UserValidation.vendorUpdateValidation.parse(updateData);

    // Update the vendor in the database
    const updatedVendor = await VendorService.updateAVendorInToDB(
      userID,
      validatedData as Partial<IUser>,
    );

    // If the vendor is not found, return a 404 response
    if (!updatedVendor) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Vendor not found',
      });
    }

    // Return the updated vendor data
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Vendor updated successfully!',
      data: updatedVendor,
    });
  } catch (error: any) {
    next(error);
  }
};

//! this route only for admin
const deleteAVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = req.params.id;
    const deletedVendor = await VendorService.deleteAVendorInToDB(userID);
    if (!deletedVendor) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Vendor not found.',
      });
    }
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'USER deleted successfully!',
      data: deletedVendor,
    });
  } catch (error: any) {
    next(error);
  }
};

export const VendorController = {
  getAllVendors,
  createVendor,
  getAVendor,
  updateAVendor,
  deleteAVendor,
};
