import { NextFunction, Request, Response } from 'express';
import { IUser } from '../users.interface';
import { VendorService } from './vendors.services';
import { UserValidation } from '../users.validation';
import sendResponse from '../../../../shared/sendResponse';
import { passwordHashing } from '../../../../helpers/passHandle';
import catchAsync from '../../../../shared/catchAsync';

const createVendor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, passwordHash, emailVerified, phoneNumber } = req.body;

    // Hash the password with correct salt rounds
    const hashedPassword = await passwordHashing(passwordHash);

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
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Vendor created successfully',
      data: {
        email: result.email,
        emailVerified: result.emailVerified,
        phoneNumber: result?.phoneNumber,
      },
    });
  },
);

//! this route only for admin
const getAllVendors = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      businessName,
      email,
      phoneNumber,
      businessCategory,
      isActive,
      ratingsFrom,
      ratingsTo,
      reviewCountFrom,
      reviewCountTo,
      createdFrom,
      createdTo,
      isDelete,
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    // Only search for vendors
    const role = 'vendor';
    // todo : need to use JWT for validation  admin
    const isAdmin = true;

    const filter: any = {};
    if (role) filter.role = role;
    if (businessName)
      filter['profile.businessName'] = new RegExp(businessName as string, 'i');
    if (email) filter['profile.email'] = new RegExp(email as string, 'i');
    // todo : phoneNumber issue need to fix
    if (phoneNumber)
      filter.phoneNumber = new RegExp(phoneNumber as string, 'i');
    if (businessCategory)
      filter['profile.businessCategoryID'] = businessCategory;
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
        ...(reviewCountFrom && {
          $gte: parseInt(reviewCountFrom as string, 10),
        }),
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
    if (isDelete == 'false') {
      filter.isDelete = { $ne: true };
    }
    if (isDelete == 'true') {
      filter.isDelete = { $ne: false };
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    console.log(filter);
    // Use the optimized DB function
    const result = await VendorService.getAllVendorsInToDB(
      filter,
      sort,
      pageNumber,
      limitNumber,
      { isAdmin },
    );

    const totalPages = Math.ceil(result.total / limitNumber);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
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
  },
);

const getAVendor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, email } = req.query;

    // Ensure at least one of id or email is provided
    if (!id && !email) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message:
          'Please provide either an ID or an email to search for a vendor.',
      });
    }

    // Fetch the vendor from the database using either ID or email
    const result = await VendorService.getAVendorInToDB(
      id as string,
      email as string,
    );

    // If the vendor is not found, return a 404 response
    if (!result) {
      return sendResponse(res, {
        success: false,
        statusCode: 404,
        message: 'Vendor not found',
      });
    }

    // If the vendor is found, return the safe vendor information with a 200 status

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Vendor retrieved successfully',
      data: result,
    });
  },
);
const updateAVendor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userID = req.params.id;
    const userRowData = req.body;
    const { passwordHash, ...updateData } = userRowData;

    // Handle password update if provided
    if (passwordHash) {
      updateData.passwordHash = await passwordHashing(passwordHash);
    }

    // Check if there's any data to update
    if (!Object.keys(updateData).length) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: 'No update data provided',
      }) 
    }

    // Validate the update data using Zod
    const validatedData =
      UserValidation.vendorUpdateValidation.parse(updateData);

    // Update the vendor in the database
    const updatedVendor = await VendorService.updateAVendorInToDB(
      userID,
      validatedData as Partial<IUser>,
    );

    // If the vendor is not found, return a 404 response
    if (!updatedVendor) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Vendor not found',
      });
    }

    // Return the updated vendor data
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Vendor updated successfully!',
      data: updatedVendor,
    });
  },
);

//! this route only for admin
const deleteAVendor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendorID = req.params.id;
    //! todo get from JWT + middleware isAdmin
    const isAdmin = true;

    const deletedVendor = await VendorService.deleteAVendorInToDB(
      vendorID,
      isAdmin,
    );
    if (!deletedVendor) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Vendor not found',
      });
    }
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Vendor deleted successfully!',
    });
  },
);

const vendorLastLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get IP address from 'x-forwarded-for' or fallback to 'req.socket.remoteAddress'
    let ip =
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

    // If using IPv6 (::1), convert it to IPv4 (127.0.0.1)
    if (ip === '::1') {
      ip = '127.0.0.1';
    }

    // Handle cases where 'x-forwarded-for' may return multiple IPs
    if (ip && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    const { id } = req.params;

    // You can log the IP address or use it as needed
    console.log({ ip });

    const result = await VendorService.vendorLastLoginInToDB(id, ip);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Vendor last login updated successfully',
      data: result,
    });
  },
);

export const VendorController = {
  getAllVendors,
  createVendor,
  getAVendor,
  updateAVendor,
  deleteAVendor,
  vendorLastLogin,
};
