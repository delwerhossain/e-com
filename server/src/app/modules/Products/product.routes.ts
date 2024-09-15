import express from 'express';
import { ProductController } from './product.controller';

const router = express.Router();

// Define routes for products
router.get('/', ProductController.getProducts); // Get all active products
router.get('/best', ProductController.getBestProducts); // Get all best products
router.get('/featured', ProductController.getFeaturedProducts); // Get all featured products
router.get('/inactive', ProductController.getInActiveProducts); // Get all inactive products
router.get('/:id', ProductController.getSingleProduct); // Get a specific product by ID
router.post('/', ProductController.createProduct); // Create a new product
router.patch('/status/:id', ProductController.isActiveProduct); // Toggle product active status
router.patch('/:id', ProductController.updateAProduct); // Update specific product fields
router.delete('/:id', ProductController.deleteProduct); // Delete a product by ID

export const ProductRoutes = router;
