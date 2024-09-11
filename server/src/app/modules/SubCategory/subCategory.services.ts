import { ISubCategory } from './subCategory.interface';
import { SubCategoryModel } from './subCategory.model';

const createSubCategory = async (subCategory: ISubCategory) => {
  const result = await SubCategoryModel.create(subCategory);
  return result;
};

const getSubCategories = async () => {
  const result = await SubCategoryModel.find({ isActive: true });
  return result;
};

const getASubCategory = async (id: string) => {
  const searchIsActive = await SubCategoryModel.findById(id);
  if (!searchIsActive) {
    const result = {
      Not_found: 'Subcategory not found',
    };
    return result;
  }
  if (!searchIsActive?.isActive) {
    const result = {
      Active_Status: 'The Subcategory Status is UnActive',
    };
    return result;
  }
  const result = await SubCategoryModel.findById(id);
  return result;
};

const isActiveSubCategory = async (id: string) => {
  const searchSubCategory = await SubCategoryModel.findById(id);
  if (!searchSubCategory) {
    const result = {
      Not_found: 'Subcategory not found',
    };
    return result;
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
    const result = {
      Not_found: 'Subcategory not found',
    };
    return result;
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
    const result = {
      Not_found: 'Subcategory not found',
    };
    return result;
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
