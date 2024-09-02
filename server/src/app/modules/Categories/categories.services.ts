import { ICategory } from './categories.interface';
import { CategoryModel } from './categories.model';

const createCategory = async (category: ICategory) => {
  const result = await CategoryModel.create(category);
  return result;
};

const getCategories = async () => {
  const result = await CategoryModel.find();
  return result;
};

const getACategory = async (id: string) => {
  const result = await CategoryModel.findById(id);
  return result;
};

const isActiveCategory = async (id: string) => {
  const searchCategory = await CategoryModel.findById(id);
  if (!searchCategory) {
    throw new Error('Category not found');
  }
  const updatedStatus = !searchCategory.isActive;
  const result = await CategoryModel.findByIdAndUpdate(
    id,
    { $set: { isActive: updatedStatus } },
    { new: true },
  );

  return result;
};

const updateACategory = async (id: string, updatedData: Partial<ICategory>) => {
  const searchCategory = await CategoryModel.findById(id);
  if (!searchCategory) {
    throw new Error('Category not found');
  }
  const result = await CategoryModel.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true },
  );
  return result;
};

const deleteCategory = async (id: string) => {
  const searchCategory = await CategoryModel.findById(id);
  if (!searchCategory) {
    throw new Error('Category not found');
  }
  const result = await CategoryModel.findByIdAndDelete(id);
  return result;
};

export const CategoryServices = {
  createCategory,
  getCategories,
  getACategory,
  isActiveCategory,
  deleteCategory,
  updateACategory,
};
