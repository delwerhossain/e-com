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
const getSubCategories = async (req: Request, res: Response) => {
    try {
        const result = await SubCategoryServices.getSubCategories();
        res.status(200).json({
            success: true,
            message: 'Subcategories fetch successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch Subcategories',
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
const getASubCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await SubCategoryServices.getASubCategory(id);
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
const isActiveSubCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await SubCategoryServices.isActiveSubCategory(id);
        res.status(200).json({
            success: true,
            message: 'SubCategory active status updated successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to update SubCategory status',
            errorDetails: {
                errorType: error.name || 'UnknownError',
                message:
                    error.issues[0].message || 'An unexpected error occurred while creating the SubCategory.',
                errorPath: error.issues[0].path[0] || 'Unknown path',
                error: error,
            },
        });
    }
};
const updateASubCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const updatedData = req.body
        const result = await SubCategoryServices.updateASubCategory(id, updatedData);
        res.status(200).json({
            success: true,
            message: 'SubCategory details updated successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to update SubCategory',
            errorDetails: {
                errorType: error.name || 'UnknownError',
                message:
                    error.issues[0].message || 'An unexpected error occurred while creating the SubCategory.',
                errorPath: error.issues[0].path[0] || 'Unknown path',
                error: error,
            },
        });
    }
};
const deleteASubCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await SubCategoryServices.deleteASubCategory(id);
        res.status(200).json({
            success: true,
            message: 'SubCategory deleted successfully!',
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete SubCategory',
            errorDetails: {
                errorType: error.name || 'UnknownError',
                message:
                    error.issues[0].message || 'An unexpected error occurred while creating the SubCategory.',
                errorPath: error.issues[0].path[0] || 'Unknown path',
                error: error,
            },
        });
    }
};

export const SubCategoryControllers = {
    createSubCategory,
    getSubCategories,
    getASubCategory,
    isActiveSubCategory,
    deleteASubCategory,
    updateASubCategory
};
