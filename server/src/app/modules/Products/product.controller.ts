import { RequestHandler } from 'express';
import { ProductValidation } from './product.validation';
import { ProductServices } from './product.services';

const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const product = ProductValidation.parse(req.body);
    const result = await ProductServices.createProduct(product);
    res.status(201).json({
      success: true,
      message: 'product created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
