import { IProduct } from './product.interface';
import { ProductModel } from './product.model';

const getProducts = async () => {
  const result = await ProductModel.find({ isActive: true });
  return result;
};

const getSingleProduct = async (id: string) => {
  const result = await ProductModel.findById(id);
  if (!result) {
    return { not_found: 'Product Not Found' };
  }
  return result;
};

const getBestProducts = async () => {
  const result = await ProductModel.find({ isBestProduct: true });
  return result;
};

const getFeaturedProducts = async () => {
  const result = await ProductModel.find({ isFeatured: true });
  return result;
};

const getInActiveProducts = async () => {
  const result = await ProductModel.find({ isActive: false });
  return result;
};

const createProduct = async (product: IProduct) => {
  const result = await ProductModel.create(product);
  return result;
};

const isActiveProduct = async (id: string, status: boolean) => {
  const result = await ProductModel.findByIdAndUpdate(
    id,
    { $set: { isActive: status } },
    { new: true },
  );
  if (!result) {
    return { not_found: 'Product Not Found' };
  }
  return result;
};
