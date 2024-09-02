import { Schema, model } from 'mongoose';
import { ISubCategory } from './subCategory.interface';

// subCategory schema
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
      required: false,
      trim: true,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    subCategoryImage: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

// Subcategory Model
export const SubCategoryModel = model<ISubCategory>(
  'Subcategory',
  subCategorySchema,
);
