import { ISubCategory } from "./subCategory.interface";
import { SubCategoryModel } from "./subCategory.model";


const createSubCategory = async (subCategory: ISubCategory) => {
  const result = await SubCategoryModel.create(subCategory);
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
    { new: true }
  );

  return result;
};

const updateACategory = async (id: string, updatedData: Partial<ICategory>) => {
  const searchCategory = await CategoryModel.findById(id);
  if (!searchCategory) {
    throw new Error('Category not found');
  }
  const result = await CategoryModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
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


export const SubCategoryServices = {
  createSubCategory,
  getCategories,
  getACategory,
  isActiveCategory,
  deleteCategory,
  updateACategory
};
