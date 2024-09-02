import { Request, Response } from 'express';
import subCategoryValidation from './subCategory.validation';
import { SubCategoryServices } from './subCategory.services';


const createSubCategory = async (req: Request, res: Response) => {
    try {
        const subCategory = req.body;
        const validatedSubCategory = subCategoryValidation.parse(subCategory);
        const result = await SubCategoryServices.createSubCategory(validatedSubCategory);
        res.status(201).json({
            success: true,
            message: 'Subcategory created successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to create Subcategory',
            errorDetails: {
                errorType: error.name || 'UnknownError',
                message:
                    error.issues[0].message ||
                    'An unexpected error occurred while creating the category.',
                errorPath: error.issues[0].path[0] || 'Unknown path',
                error: error,
            },
        });
    }
};
const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await CategoryServices.getCategories();
        res.status(200).json({
            success: true,
            message: 'Categories fetch successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            errorDetails: {
                errorType: error.name || 'UnknownError',
                message:
                    error.issues[0].message || 'An unexpected error occurred while creating the category.',
                errorPath: error.issues[0].path[0] || 'Unknown path',
                error: error,
            },
        });
    }
};
const getACategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await CategoryServices.getACategory(id);
        res.status(200).json({
            success: true,
            message: 'Category fetch successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch category',
            errorDetails: {
                errorType: error.name || 'UnknownError',
                message:
                    error.issues[0].message || 'An unexpected error occurred while creating the category.',
                errorPath: error.issues[0].path[0] || 'Unknown path',
                error: error,
            },
        });
    }
};
const isActiveCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await CategoryServices.isActiveCategory(id);
        res.status(200).json({
            success: true,
            message: 'Category active status updated successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to update category status',
            errorDetails: {
                errorType: error.name || 'UnknownError',
                message:
                    error.issues[0].message || 'An unexpected error occurred while creating the category.',
                errorPath: error.issues[0].path[0] || 'Unknown path',
                error: error,
            },
        });
    }
};
const updateACategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const updatedData = req.body
        const result = await CategoryServices.updateACategory(id, updatedData);
        res.status(200).json({
            success: true,
            message: 'Category details updated successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to update category',
            errorDetails: {
                errorType: error.name || 'UnknownError',
                message:
                    error.issues[0].message || 'An unexpected error occurred while creating the category.',
                errorPath: error.issues[0].path[0] || 'Unknown path',
                error: error,
            },
        });
    }
};
const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await CategoryServices.deleteCategory(id);
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            errorDetails: {
                errorType: error.name || 'UnknownError',
                message:
                    error.issues[0].message || 'An unexpected error occurred while creating the category.',
                errorPath: error.issues[0].path[0] || 'Unknown path',
                error: error,
            },
        });
    }
};

export const SubCategoryControllers = {
    createSubCategory,
    getCategories,
    getACategory,
    isActiveCategory,
    deleteCategory,
    updateACategory
};
