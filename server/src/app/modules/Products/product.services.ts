import { IProduct } from './product.interface';
import { ProductModel } from './product.model';

const getProducts = async () => {
  const result = await ProductModel.find({ isActive: true }).populate(
    'reviews',
  );
  return result;
};

const getSingleProduct = async (id: string) => {
  // Find the product by ID and populate reviews
  const result = await ProductModel.findById(id).populate('reviews');

  if (!result) {
    return { not_found: 'Product Not Found' };
  }
  // console.log(result, 'line 28');
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

const updateAProduct = async (id: string, productData: Partial<IProduct>) => {
  const result = await ProductModel.findByIdAndUpdate(
    id,
    { $set: productData },
    { new: true },
  );

  if (!result) {
    return { Not_found: 'Product not found' };
  }

  return result;
};

const deleteProduct = async (id: string) => {
  const result = await ProductModel.findByIdAndDelete(id);

  if (!result) {
    return { Not_found: 'Product not found' };
  }

  return result;
};

export const ProductServices = {
  getProducts,
  getBestProducts,
  getFeaturedProducts,
  getSingleProduct,
  getInActiveProducts,
  createProduct,
  isActiveProduct,
  updateAProduct,
  deleteProduct,
};
