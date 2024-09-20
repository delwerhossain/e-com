import { NextFunction, Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AdminServices } from './admin.services';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';
import { IAdmin, ICreateAdminInput } from './admin.interface';
import bcrypt from 'bcrypt';
import { AdminValidation } from './admin.validation';

const getAllAdmins: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      role,
      email,
      isActive,
      createdFrom,
      createdTo,
      isDeleted = false,
    } = req.query;
    //
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const filter: any = {};
    if (role) filter.role = role;
    if (email) filter.email = new RegExp(email as string, 'i');
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    // Date filters
    if (createdFrom || createdTo) {
      filter.createdAt = {
        ...(createdFrom && { $gte: new Date(createdFrom as string) }),
        ...(createdTo && { $lte: new Date(createdTo as string) }),
      };
    }
    if (isDeleted === 'false') {
      filter.isDelete = { $ne: true };
    }

    // sorting filter
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    // super admin
    const isSuperAdmin = true;
    const result = await AdminServices.getAllAdminInToDB(
      filter,
      sort,
      pageNumber,
      limitNumber,
      { isSuperAdmin },
    );

    const totalPages = Math.ceil(result.total / limitNumber);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'admin retrieved successfully',
      data: result,
      meta: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalRecords: result.total,
        totalPages,
        hasPrevPage: pageNumber > 1,
        hasNextPage: pageNumber < totalPages,
      },
    });
  },
);

// get a single admin details
const getAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, email } = req.query;

    // Ensure at least one of id or email is provided
    if (!id && !email) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message:
          'Please provide either an ID or an email to search for a admin.',
      });
    }

    // Fetch the admin from the database using either ID or email
    const result = await AdminServices.getAdminInToDB(
      id as string,
      email as string,
    );

    // If the admin is not found, return a 404 response
    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Admin not found',
      });
    }

    // If the admin is found, return the safe admin information with a 200 status
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin retrieved successfully',
      data: result,
    });
  },
);

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, passwordHash ,emailVerified, phoneNumber} = req.body;

    //! todo => salt rounds value
    // Parse salt rounds with a fallback to default value if parsing fails
    const saltRounds = parseInt(config.bcrypt_salt_rounds as string, 10) || 12;

    // Hash the password with correct salt rounds
    const hashedPassword = await bcrypt.hash(passwordHash, saltRounds);

    // Create the vendor object 
    const data: ICreateAdminInput = {
      email,
      emailVerified: emailVerified ?? false, // Default to false if not provided
      passwordHash: hashedPassword,
      role: 'admin',
      isActive: false,
    };

    // Validate the vendor data with Zod
    const validatedData = AdminValidation.adminValidation.parse(data);

    // Create the vendor in the database
    const result = await AdminServices.createAdminInToDB(validatedData);

    // Return the created vendor, excluding sensitive information like password
    res.status(201).json({
      success: true,
      statusCode: 201,
      vendor: {
        email: result.email,
        emailVerified: result.emailVerified,
      },
    });
  },
);

const updateAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deleteAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const AdminController = {
  getAllAdmins,
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};
