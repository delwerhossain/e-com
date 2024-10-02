import { Types } from 'mongoose';
import { IProduct } from './product.interface';
import { ProductModel } from './product.model';
import { ProductUpdateValidation } from './product.validation';
import { UserModel } from '../Users/users.model';

const getProducts = async (query: Record<string, unknown>) => {
  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string;
  }
  const searchableFields = [
    'name',
    'color',
    'description',
    'categoryName',
    'subcategoryName',
    'size',
  ];
  const filterActive: Record<string, unknown> = {
    $or: searchableFields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  };
  if (query?.isActive === 'true' || query?.isActive === 'false') {
    filterActive.isActive = query?.isActive;
  }

  const result = await ProductModel.find(filterActive).populate('reviews');
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
const getVendorAllProducts = async (
  vendorId: string,
  query: Record<string, unknown>,
) => {
  const validateVendor = await UserModel.findById(vendorId);
  if (!validateVendor) {
    throw new Error('No Vendor Found With Provided ID');
  }
  let filterActive: Record<string, unknown> = { vendorId };

  if (query.isActive === 'true' || query.isActive === 'false') {
    filterActive.isActive = query?.isActive;
  }

  // Find the product by ID and populate reviews
  const result = await ProductModel.find(filterActive).populate('reviews');

  if (!result.length) {
    return { not_found: 'No product found for this vendor' };
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

//!update with permeative and non permeative fields
const updateAProduct = async (id: string, productData: Partial<IProduct>) => {
  const validatedData = ProductUpdateValidation.parse(productData);
  const { images, ratings, reviews, ...primitiveData } = validatedData;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...primitiveData, // Update primitive fields directly
  };

  // Initialize $push as an empty object if it doesn't exist
  const pushOperations: Record<string, unknown> = {};

  // Add new images to the existing array, if any
  if (images) {
    if (Array.isArray(images)) {
      pushOperations['images'] = { $each: images };
    } else {
      pushOperations['images'] = images;
    }
  }

  // Add new reviews to the existing array
  if (reviews && reviews.length > 0) {
    pushOperations['reviews'] = {
      $each: reviews.map(review => new Types.ObjectId(review)),
    };
  }

  // If there are any push operations, add them to modifiedUpdatedData
  if (Object.keys(pushOperations).length > 0) {
    modifiedUpdatedData['$push'] = pushOperations;
  }

  // Handle nested 'ratings' object (if provided)
  if (ratings) {
    for (const [key, value] of Object.entries(ratings)) {
      modifiedUpdatedData[`ratings.${key}`] = value;
    }
  }

  // Now update the product in the database
  const result = await ProductModel.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

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
  getVendorAllProducts,
};
