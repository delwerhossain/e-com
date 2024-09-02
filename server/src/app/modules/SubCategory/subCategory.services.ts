import { ISubCategory } from './subCategory.interface';
import { SubCategoryModel } from './subCategory.model';

const createSubCategory = async (subCategory: ISubCategory) => {
  const result = await SubCategoryModel.create(subCategory);
  return result;
};

const getSubCategories = async () => {
  const result = await SubCategoryModel.find();
  return result;
};

const getASubCategory = async (id: string) => {
  const result = await SubCategoryModel.findById(id);
  return result;
};

const isActiveSubCategory = async (id: string) => {
  const searchSubCategory = await SubCategoryModel.findById(id);
  if (!searchSubCategory) {
    throw new Error('Subcategory not found');
  }
  const updatedStatus = !searchSubCategory.isActive;
  const result = await SubCategoryModel.findByIdAndUpdate(
    id,
    { $set: { isActive: updatedStatus } },
    { new: true },
  );

  return result;
};

const updateASubCategory = async (
  id: string,
  updatedData: Partial<ISubCategory>,
) => {
  const searchSubCategory = await SubCategoryModel.findById(id);
  if (!searchSubCategory) {
    throw new Error('Subcategory not found');
  }
  const result = await SubCategoryModel.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true },
  );
  return result;
};

const deleteASubCategory = async (id: string) => {
  const searchSubCategory = await SubCategoryModel.findById(id);
  if (!searchSubCategory) {
    throw new Error('Subcategory not found');
  }
  const result = await SubCategoryModel.findByIdAndDelete(id);
  return result;
};

export const SubCategoryServices = {
  createSubCategory,
  getSubCategories,
  getASubCategory,
  isActiveSubCategory,
  deleteASubCategory,
  updateASubCategory,
};
