import { NextFunction, Request, RequestHandler, Response } from 'express';

const getAllAdmins: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

const createAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

// get a single admin details
const getAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
const updateAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

const deleteAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};



export const AdminController = {
  getAllAdmins,
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};