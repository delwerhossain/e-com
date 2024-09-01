import { Schema, model } from 'mongoose';
import { TCategory } from './categories.interface';

// category schema
const categorySchema = new Schema<TCategory>(
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
      default: true
    },
  },
  { timestamps: true },
);

// category Model
export const categoryModel = model<TCategory>('Category', categorySchema);
