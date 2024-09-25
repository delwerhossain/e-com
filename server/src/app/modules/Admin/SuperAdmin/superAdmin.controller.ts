import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import { validateIdOrEmail } from '../../../../helpers/validation';
import { IAdmin } from '../admin.interface';
import { AdminValidation } from '../admin.validation';
import { SuperAdminServices } from './superAdmin.services';

const getSuperAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id, email } = req.query;

    // Validate input: require either id or email, and ensure formats are correct
    const validationError = validateIdOrEmail(
      id as string,
      email as string,
      res,
    );
    if (validationError) return validationError;

    // Fetch admin by id or email
    const result = await SuperAdminServices.getSuperAdminInToDB(
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

const updateSuperAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, emailVerified, profile } = req.body;

    // Assume the super admin status is retrieved from JWT (hardcoded for now)
    const isSuperAdmin = true;

    const data: Partial<IAdmin> = {
      email,
      emailVerified,
      profile,
    };

    // Check if no data is provided to update
    if (!Object.values(data).some(value => value !== undefined)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: 'No valid data provided to update',
      });
    }

    // Validate the update data using Zod
    const validatedData = AdminValidation.adminUpdateValidation.parse(data);

    // Update the admin in the database
    const result = await SuperAdminServices.updateSuperAdminInDB(
      id,
      validatedData,
      isSuperAdmin,
    );

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Admin updated successfully',
      data: result,
    });
  },
);

export const SuperAdminController = {
  getSuperAdmin,
  updateSuperAdmin,
};
