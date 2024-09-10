import { ICategory } from './categories.interface';
import { CategoryModel } from './categories.model';

const createCategory = async (category: ICategory) => {
  const result = await CategoryModel.create(category);
  return result;
};

const getCategories = async () => {
  const result = await CategoryModel.find({ isActive: true });
  return result;
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
const isActiveCategory = async (id: string, status: boolean) => {
  const result = await CategoryModel.findByIdAndUpdate(
    id,
    { $set: { isActive: status } },
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

// Function to get all inactive subcategory for a specific product
const getInActiveCategory = async () => {
  const result = await CategoryModel.find({
    isActive: false,
  });
  return result;
};


export const CategoryServices = {
  createCategory,
  getCategories,
  getACategory,
  isActiveCategory,
  updateACategory,
  deleteCategory,
  getInActiveCategory
};
