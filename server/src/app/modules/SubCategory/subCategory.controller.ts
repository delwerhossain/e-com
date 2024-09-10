import { RequestHandler } from 'express';
import subCategoryValidation from './subCategory.validation';
import { SubCategoryServices } from './subCategory.services';

// Controller to create a subcategory
const createSubCategory: RequestHandler = async (req, res, next) => {
  try {
    const subCategory = subCategoryValidation.parse(req.body); 
    const result = await SubCategoryServices.createSubCategory(subCategory);
    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error); // Pass error to error-handling middleware
  }
};

// Controller to get all subcategories
const getSubCategories: RequestHandler = async (req, res, next) => {
  try {
    const result = await SubCategoryServices.getSubCategories();
    res.status(200).json({
      success: true,
      message: 'Subcategories fetched successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Controller to fetch a specific subcategory by ID
const getASubCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await SubCategoryServices.getASubCategory(id);
    res.status(200).json({
      success: true,
      message: 'Subcategory fetched successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Controller to toggle the active status of a subcategory
const isActiveSubCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await SubCategoryServices.isActiveSubCategory(id);
    res.status(200).json({
      success: true,
      message: 'Subcategory active status updated successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Controller to update a subcategory's details
const updateASubCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await SubCategoryServices.updateASubCategory(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Subcategory details updated successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Controller to delete a subcategory
const deleteASubCategory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await SubCategoryServices.deleteASubCategory(id);
    res.status(200).json({
      success: true,
      message: 'Subcategory deleted successfully!',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const SubCategoryControllers = {
  createSubCategory,
  getSubCategories,
  getASubCategory,
  isActiveSubCategory,
  updateASubCategory,
  deleteASubCategory,
};
