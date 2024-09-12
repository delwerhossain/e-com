import express from 'express';
import { ReviewController } from './reviews.controller';

const router = express.Router();

// Define routes for reviews
router.get('/', ReviewController.getALLReviews); // Get all reviews
router.get('/best', ReviewController.bestReviews); // Get all best reviews
router.get('/:id', ReviewController.getAReview); // Get a specific review by ID
router.get('/product/:productId', ReviewController.getProductReviews); // Get all active reviews for a specific product
router.get('/inactive/:productId', ReviewController.getInActiveReviews); // Get all inactive reviews for a specific product
router.post('/', ReviewController.createReview); // Create a new review
router.patch('/status/:id', ReviewController.isActiveReview); // Toggle review active status
router.patch('/:id', ReviewController.updateReview); // Update specific review fields
router.delete('/:id', ReviewController.deleteReview); // Delete a review by ID

export const reviewRoutes = router;
