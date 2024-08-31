import { TCategory } from './categories.interface';
import { categoryModel } from './categories.model';

const createCategory = async (category: TCategory) => {
  const result = await categoryModel.create(category);
  return result;
};

export const categoryServices = {
  createCategory,
};
