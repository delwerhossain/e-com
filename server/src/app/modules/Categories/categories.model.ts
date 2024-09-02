import { Schema, model } from 'mongoose';
import { ICategory } from './categories.interface';

// category schema
const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
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
    categoryImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// category Model
export const CategoryModel = model<ICategory>('Category', categorySchema);
