import { ISubCategory } from './subCategory.interface';
import { SubCategoryModel } from './subCategory.model';

// Create a subcategory
const createSubCategory = async (subCategory: ISubCategory) => {
  const result = await SubCategoryModel.create(subCategory);
  return result;
};

// Fetch all active subcategories
const getSubCategories = async () => {
  const result = await SubCategoryModel.find({ isActive: true }).populate(
    'categoryId',
  );
  return result;
};

// Fetch a subcategory by ID with active status check
const getASubCategory = async (id: string) => {
  const subCategory =
    await SubCategoryModel.findById(id).populate('categoryId');

  if (!subCategory) {
    return { Not_found: 'Subcategory not found' };
  }

  if (!subCategory.isActive) {
    return { Active_Status: 'The Subcategory Status is UnActive' };
  }

  return subCategory;
};

// !Toggle the active status of a subcategory
const isActiveSubCategory = async (id: string, status: boolean) => {
  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    id,
    { $set: { isActive: status } },
    { new: true },
  );

  if (!subCategory) {
    return { Not_found: 'Subcategory not found' };
  }

  return subCategory;
};

//! Update subcategory details
const updateASubCategory = async (
  id: string,
  updatedData: Partial<ISubCategory>,
) => {
  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true },
  );

  if (!subCategory) {
    return { Not_found: 'Subcategory not found' };
  }

  return subCategory;
};

// !Delete a subcategory
const deleteASubCategory = async (id: string) => {
  const subCategory = await SubCategoryModel.findByIdAndDelete(id);

  if (!subCategory) {
    return { Not_found: 'Subcategory not found' };
  }

  return subCategory;
};

// Function to get all inactive subcategory for a specific product
const getInActiveSubcategory = async () => {
  const result = await SubCategoryModel.find({
    isActive: false,
  }).populate('categoryId');
  return result;
};

export const SubCategoryServices = {
  createSubCategory,
  getSubCategories,
  getASubCategory,
  isActiveSubCategory,
  deleteASubCategory,
  updateASubCategory,
  getInActiveSubcategory,
};
