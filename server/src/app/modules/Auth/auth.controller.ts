// controller for auth routes

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AuthServices } from './auth.services';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: { result },
  });
});

export const AuthController = { loginUser };
