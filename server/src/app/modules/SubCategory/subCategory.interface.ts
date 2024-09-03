import { Types } from "mongoose";

export interface ISubCategory {
    name: string;
    description?: String;
    isActive?: boolean;
    isDeleted?: boolean;
    subCategoryImage: string;
    categoryName?: string;
    categoryId: Types.ObjectId
};

