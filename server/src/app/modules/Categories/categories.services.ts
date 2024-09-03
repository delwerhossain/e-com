import { ICategory } from './categories.interface';
import { CategoryModel } from './categories.model';

const createCategory = async (category: ICategory) => {
  const result = await CategoryModel.create(category);
  return result;
};


const getCategories = async () => {
  const result = await CategoryModel.find({isActive:true});
  return result;
};


const getACategory = async (id: string) => {
  const searchIsActive = await CategoryModel.findById(id)
  if (!searchIsActive) {
    const result = {
      Not_found: "category not found"
    }
    return result
  }
  if (!searchIsActive?.isActive) {
    const result = {
      Active_Status: "The Category Status is UnActive"
    }
    return result

  }
  const result = await CategoryModel.findById(id);
  return result;
};


const isActiveCategory = async (id: string) => {
  const searchCategory = await CategoryModel.findById(id);
  if (!searchCategory) {
    const result = {
      Not_found: "category not found"
    }
    return result

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
    const result = {
      Not_found: "category not found"
    }
    return result

  }
  const result = await CategoryModel.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
  return result;
};

const deleteCategory = async (id: string) => {
  const searchCategory = await CategoryModel.findById(id);
  if (!searchCategory) {
    const result = {
      Not_found: "category not found"
    }
    return result

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
  updateACategory
};
