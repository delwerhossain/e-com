import { ICategory } from './categories.interface';
import { CategoryModel } from './categories.model';

const createCategory = async (category: ICategory) => {
  return await CategoryModel.create(category);
};

const getCategories = async () => {
  return await CategoryModel.find({ isActive: true });
};

const getACategory = async (id: string) => {
  const category = await CategoryModel.findById(id);

  if (!category) {
    return { Not_found: 'Category not found' };
  }

  if (!category.isActive) {
    return { Active_Status: 'The Category Status is Inactive' };
  }

  return category;
};
//!isActiveCategory is a admin route.......
const isActiveCategory = async (id: string) => {
  const result = await CategoryModel.findByIdAndUpdate(
    id,
    [{ $set: { isActive: { $not: '$isActive' } } }],
    { new: true },
  );

  return result || { Not_found: 'Category not found' };
};
//!updateACategory is a admin route.......
const updateACategory = async (id: string, updatedData: Partial<ICategory>) => {
  const result = await CategoryModel.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true },
  );

  return result || { Not_found: 'Category not found' };
};
//!deleteCategory is a admin route.......
const deleteCategory = async (id: string) => {
  const result = await CategoryModel.findByIdAndDelete(id);

  return result || { Not_found: 'Category not found' };
};

export const CategoryServices = {
  createCategory,
  getCategories,
  getACategory,
  isActiveCategory,
  updateACategory,
  deleteCategory,
};
