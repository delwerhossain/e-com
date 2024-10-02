import { RequestHandler } from 'express';
import { ProductValidation } from './product.validation';
import { ProductServices } from './product.services';

// Controller to fetch all active products
const getProducts: RequestHandler = async (req, res, next) => {
  
  try {
    const result = await ProductServices.getProducts(req.query);
    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getVendorAllProducts: RequestHandler = async (req, res, next) => {
  const vendorId = req.params.id;
  const query = req.query
  try {
    const result = await ProductServices.getVendorAllProducts(vendorId,query);
    res.status(200).json({
      success: true,
      message: "Vendor's All Products fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to fetch a single product by ID
const getSingleProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract product ID from route params
    const result = await ProductServices.getSingleProduct(id);
    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to fetch best products
const getBestProducts: RequestHandler = async (req, res, next) => {
  try {
    const result = await ProductServices.getBestProducts();
    res.status(200).json({
      success: true,
      message: 'Best products fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to fetch featured products
const getFeaturedProducts: RequestHandler = async (req, res, next) => {
  try {
    const result = await ProductServices.getFeaturedProducts();
    res.status(200).json({
      success: true,
      message: 'Featured products fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to fetch inactive products
const getInActiveProducts: RequestHandler = async (req, res, next) => {
  try {
    const result = await ProductServices.getInActiveProducts();
    res.status(200).json({
      success: true,
      message: 'Inactive products fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to create a new product
const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = ProductValidation.parse(req.body); // Validate the incoming product data
    const result = await ProductServices.createProduct(product);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result,
    });
  } catch (error) {
    next(error); // Handle validation errors or service errors
  }
};

// Controller to toggle the active status of a product
const isActiveProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract product ID from route params
    const { status } = req.body; // Extract the new active status from the request body
    const result = await ProductServices.isActiveProduct(id, status);
    res.status(200).json({
      success: true,
      message: 'Product status updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to update specific fields of a product
const updateAProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract product ID from route params
    const updatedData = req.body; // Get the updated product data from request body
    const result = await ProductServices.updateAProduct(id, updatedData);
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to delete a product by its ID
const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract product ID from route params
    const result = await ProductServices.deleteProduct(id);
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Export all the controllers
export const ProductController = {
  getProducts, // Get all active products
  getVendorAllProducts, // Get all active products
  getSingleProduct, // Get a single product by ID
  getBestProducts, // Get the best products
  getFeaturedProducts, // Get featured products
  getInActiveProducts, // Get inactive products
  createProduct, // Create a new product
  isActiveProduct, // Toggle product active status
  updateAProduct, // Update product fields
  deleteProduct, // Delete a product by ID
};
