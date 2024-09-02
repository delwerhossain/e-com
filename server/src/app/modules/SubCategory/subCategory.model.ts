import { Schema, model, Types } from 'mongoose';
import { ISubCategory } from './subCategory.interface';

// SubCategory schema
const subCategorySchema = new Schema<ISubCategory>(
    {
        name: {
            type: String,
            required: [true, 'Subcategory name is required'],
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            trim: true,
            required: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        subCategoryImage: {
            type: String,
            required: [true, 'Subcategory image is required'],
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Category ID is required'],
            validate: {
                validator: (value: any) => Types.ObjectId.isValid(value),
                message: 'Invalid ObjectId format for categoryId',
            },
        },
        categoryName: {
            type: String,
            trim: true,
            required: false,
        },
    },
    { timestamps: true },
);

// SubCategory Model
export const SubCategoryModel = model<ISubCategory>('Subcategory', subCategorySchema);
