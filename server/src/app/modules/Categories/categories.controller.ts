import { RequestHandler } from 'express';
import { categoryValidation } from './categories.validation';
import { CategoryServices } from './categories.services';

// Controller to create a category
const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const category = categoryValidation.parse(req.body); // Validation done in one step
    const result = await CategoryServices.createCategory(category);
    res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error); // Pass error to middleware for consistent error handling
  }
};

// Controller to fetch all active categories
const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const result = await CategoryServices.getCategories();
    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
// Controller to fetch all Inactive categories
const getInActiveCategories: RequestHandler = async (req, res, next) => {
  try {
    const result = await CategoryServices.getInActiveCategory();
    res.status(200).json({
      success: true,
      message: 'InActive Categories fetched successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Controller to fetch a specific category by ID
const getACategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await CategoryServices.getACategory(id);
    res.status(200).json({
      success: true,
      message: 'Category fetched successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Controller to toggle the active status of a category
const isActiveCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const result = await CategoryServices.isActiveCategory(id, isActive);
    res.status(200).json({
      success: true,
      message: 'Category active status updated successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Controller to update category details
const updateACategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await CategoryServices.updateACategory(id, req.body); // Directly use `req.body` for updates
    res.status(200).json({
      success: true,
      message: 'Category details updated successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Controller to delete a category by ID
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
  getInActiveCategories,
};
