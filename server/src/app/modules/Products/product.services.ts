import { Types } from 'mongoose';
import { IProduct } from './product.interface';
import { ProductModel } from './product.model';
import { ProductUpdateValidation } from './product.validation';
import { UserModel } from '../Users/users.model';

//!http://localhost:5000/api/v1/product?searchTerm=test&isActive=true&category=electronics -if no isActive and SearchTerm will show all products
const getProducts = async (query: Record<string, unknown>) => {
  const searchTerm = query?.searchTerm ? query.searchTerm : '';
  const sortItem = query?.sort ? query.sort : '-createdAt';
  const limitData = query?.limit ? Number(query.limit) : 10;
  const page = query?.page ? Number(query.page) : 1;
  const paginateQuery = (page - 1) * limitData;
  const fields = query?.fields
    ? (query.fields as string).split(',').join(' ')
    : '-__v ';

  const excludedQuery = { ...query };
  const filterFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

  const searchableFields = [
    'name',
    'color',
    'description',
    'categoryName',
    'subcategoryName',
    'size',
  ];

  //Base Filter
  filterFields.forEach(element => delete excludedQuery[element]);

  //search Func
  const filterActive: Record<string, unknown> = {
    $or: searchableFields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
    ...excludedQuery, //add the filtering values..........
  };

  const result = await ProductModel.find(filterActive)
    .populate('reviews')
    .sort(sortItem as string)
    .limit(limitData as number)
    .skip(paginateQuery)
    .select(fields ? fields : {});
  return result;
};

const getSingleProduct = async (
  _id: string,
  query: Record<string, unknown>,
) => {
  // Find the product by ID and populate reviews
  const filter: Record<string, unknown> = { _id };
  if (query?.isActive === 'true' || query?.isActive === 'false') {
    filter.isActive = query?.isActive;
  }
  const result = await ProductModel.find(filter).populate('reviews');

  if (!result) {
    return { not_found: 'Product Not Found' };
  }
  // console.log(result, 'line 28');
  return result;
};

//! -if no isActive and SearchTerm all products will show
const getVendorAllProducts = async (
  vendorId: string,
  query: Record<string, unknown>,
) => {
  const validateVendor = await UserModel.findById(vendorId);
  if (!validateVendor) {
    throw new Error('No Vendor Found With Provided ID');
  }
  let searchTerm = query.searchTerm ? query.searchTerm : '';
  const limitData = query?.limit ? Number(query.limit) : 10;
  const sortItem = query?.sort ? query.sort : '-createdAt';
  const page = query?.page ? Number(query.page) : 1;
  const paginateQuery = (page - 1) * limitData;
  const excludedQuery = { ...query };
  const excludedFields = ['searchTerm', 'sort', 'limit'];
  const filterFields = [
    'name',
    'color',
    'description',
    'categoryName',
    'subcategoryName',
    'size',
  ];
  excludedFields.forEach(element => delete excludedQuery[element]);
  const fields = query?.fields
    ? (query.fields as string).split(',').join(' ')
    : '-__v ';

  let filterActive: Record<string, unknown> = {
    vendorId,
    $or: filterFields.map(field => ({
      [field]: { $regex: { searchTerm, $options: 'i' } },
    })),
    ...excludedQuery,
  };

  // Find the product by ID and populate reviews
  const result = await ProductModel.find(filterActive)
    .populate('reviews')
    .skip(paginateQuery)
    .select(fields)
    .sort(sortItem as string)
    .limit(limitData as number);

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
