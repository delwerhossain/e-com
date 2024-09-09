import { NextFunction, Request, RequestHandler, Response } from 'express';
import { categoryValidation } from './categories.validation';
import { CategoryServices } from './categories.services';

const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const category = req.body;
    const validatedCategory = categoryValidation.parse(category);
    const result = await CategoryServices.createCategory(validatedCategory);
    res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const result = await CategoryServices.getCategories();
    res.status(200).json({
      success: true,
      message: 'Categories fetch successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const getACategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await CategoryServices.getACategory(id);
    res.status(200).json({
      success: true,
      message: 'Category fetch successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const isActiveCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await CategoryServices.isActiveCategory(id);
    res.status(200).json({
      success: true,
      message: 'Category active status updated successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const updateACategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await CategoryServices.updateACategory(id, updatedData);
    res.status(200).json({
      success: true,
      message: 'Category details updated successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await CategoryServices.deleteCategory(id);
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const CategoryControllers = {
  createCategory,
  getCategories,
  getACategory,
  isActiveCategory,
  deleteCategory,
  updateACategory,
};
