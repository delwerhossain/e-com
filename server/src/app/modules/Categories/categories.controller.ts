import { Request, Response } from "express";
import { categoryValidation } from "./categories.validation";
import { categoryServices } from "./categories.services";

const createCategory = async (req: Request, res: Response) => {
    try {
        const category = req.body
        const validatedCategory = categoryValidation.parse(category)
        const result = await categoryServices.createCategory(validatedCategory)
        res.status(201).json({
            success: true,
            message: "Category created successfully!",
            data: result
        });
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to create category",
            errorDetails: {
                errorType: error.name || "UnknownError",
                message: error.issues[0].message || "An unexpected error occurred while creating the category.",
                errorPath: error.issues[0].path[0] || 'Unknown path',
                error: error
            }

        });

    }

}


export const categoryControllers = {
    createCategory,
}