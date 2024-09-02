import { ICategory } from './categories.interface';
import { categoryModel } from './categories.model';

const createCategory = async (category: ICategory) => {
  const result = await categoryModel.create(category);
  return result;
};
const getCategory = async () => {
  const result = await categoryModel.find();
  return result;
};
const getACategory = async (id: string) => {
  const result = await categoryModel.findById(id);
  return result;
};
const isActiveCategory = async (id: string) => {
  const searchCategory = await categoryModel.findById(id);
  if (!searchCategory) {
    throw new Error('Category not found');
  }
  const updatedStatus = !searchCategory.isActive;
  const result = await categoryModel.findByIdAndUpdate(
    id,
    { $set: { isActive: updatedStatus } },
    { new: true }
  );

  return result;
};
const deleteCategory = async (id: string) => {
  const searchCategory = await categoryModel.findById(id);
  if (!searchCategory) {
    throw new Error('Category not found');
  }
  const result = await categoryModel.findByIdAndDelete(id);
  return result;
};

export const CategoryServices = {
  createCategory,
  getCategory,
  getACategory,
  isActiveCategory,
  deleteCategory
};
