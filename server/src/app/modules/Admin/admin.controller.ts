import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AdminServices } from './admin.services';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';
import { IAdmin, ICreateAdminInput } from './admin.interface';
import { AdminValidation } from './admin.validation';
import { passwordHashing } from '../../../helpers/passHandle';
import {  validateIdOrEmail } from '../../../helpers/validation';

const getAllAdmins: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
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
      isDelete,
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
    if (isDelete == 'false') {
      filter.isDelete = { $ne: true };
    }
    if (isDelete == 'true') {
      filter.isDelete = { $ne: false };
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

const getAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id, email } = req.query;

    // Use the utility function to validate id and email
    const validationError = validateIdOrEmail(
      id as string | undefined,
      email as string | undefined,
      res,
    );

    // If there is a validation error, return the error response early
    if (validationError) return validationError;

    // Proceed to fetch the admin if validation passes (returns null)
    const result = await AdminServices.getAdminInToDB(
      id as string,
      email as string,
    );

    // Return response based on whether admin was found
    return sendResponse(res, {
      statusCode: result ? 200 : 404,
      success: !!result,
      message: result ? 'Admin retrieved successfully' : 'Admin not found.',
      data: result || undefined,
    });
  },
);

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, emailVerified, permissions } = req.body;

    const default_pass = config.default_pass as string;
    const hashedPassword = await passwordHashing(default_pass);

    // Create the vendor object
    const data: ICreateAdminInput = {
      email,
      emailVerified: emailVerified ?? false, // Default to false if not provided
      passwordHash: hashedPassword,
      role: 'admin',
      permissions: permissions ?? [],
    };

    // Validate the vendor data with Zod
    const validatedData = AdminValidation.adminValidation.parse(data);

    // Create the vendor in the database
    const result = await AdminServices.createAdminInToDB(validatedData);

    // Return the created vendor, excluding sensitive information like password

    // If the admin is found, return the safe admin information with a 200 status
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Admin retrieved successfully',
      data: {
        email: result.email,
        emailVerified: result.emailVerified,
      },
    });
  },
);

const updateAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, emailVerified, profile } = req.body;

    // todo need to use JWT for validation super admin
    const isSuperAdmin = true;

    //todo get user id from JWT
    const adminIdFromJWT = '';

    const data: Partial<IAdmin> = {
      email,
      emailVerified,
      profile,
    };

    // Check if no data is provided
    const isEmptyData = Object.keys(data).every(
      key => data[key as keyof Partial<IAdmin>] === undefined,
    );

    if (isEmptyData) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: 'No valid data provided to update',
      });
    }

    // Validate the update data using Zod
    const validatedData = AdminValidation.adminUpdateValidation.parse(data);

    // Update the admin in the database
    const result = await AdminServices.updateAdminInDB(
      id,
      validatedData,
      isSuperAdmin,
      adminIdFromJWT,
    );

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin updated successfully',
      data: result,
    });
  },
);

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // todo need to use JWT for validation super admin
  const isSuperAdmin = true;
  const result = await AdminServices.deleteAdminInDB(id, isSuperAdmin);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin deleted successfully',
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};
