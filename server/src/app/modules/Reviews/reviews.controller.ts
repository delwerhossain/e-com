import { RequestHandler } from 'express';
import reviewsValidation from './reviews.validation';
import { ReviewServices } from './reviews.services';
import {Types } from 'mongoose';
import { error } from 'console';

// Controller to create a new review
const createReview: RequestHandler = async (req, res, next) => {
  try {
    const review = reviewsValidation.parse(req.body); // Validate the incoming review data
    const result = await ReviewServices.createReview(review);
    // console.log(result,"line 11")
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: result,
    });
  } catch (error) {
    // console.log(error,"line 19")
    next(error); // Handle validation errors or service errors
  }
};
// Controller to fetch active reviews for a specific product
const getProductReviews: RequestHandler = async (req, res, next) => {
  try {
    const { productId } = req.params; // Extract productId from route params

    // Validate and ensure productId is a valid ObjectId
    if (!Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Product ID' });
    }
    const result = await ReviewServices.getProductReviews(
      new Types.ObjectId(productId),
    );
    res.status(200).json({
      success: true,
      message: 'Product reviews fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error); // Pass any error to error handler middleware
  }
};

// Controller to fetch the best reviews
const bestReviews: RequestHandler = async (req, res, next) => {
  try {
    const result = await ReviewServices.bestReviews();
    res.status(200).json({
      success: true,
      message: 'Best Reviews Fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to fetch a specific review by ID
const getAReview: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract review ID from route params
    const result = await ReviewServices.getAReview(id);
    res.status(200).json({
      success: true,
      message: 'Operation process successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to fetch all inactive reviews for a product
const getInActiveReviews: RequestHandler = async (req, res, next) => {
  try {
    const { productId } = req.params; // Extract productId from route params
    const result = await ReviewServices.getInActiveReviews(productId);
    res.status(200).json({
      success: true,
      message: 'Operation process successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to fetch all reviews regardless of their status
const getALLReviews: RequestHandler = async (req, res, next) => {
  try {
    const result = await ReviewServices.getALLActiveReviews();
    res.status(200).json({
      success: true,
      message: 'Operation process successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getALLInActiveReviews: RequestHandler = async (req, res, next) => {
  try {
    const result = await ReviewServices.getAllInActiveReviews();
    res.status(200).json({
      success: true,
      message: 'Operation process successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to toggle the active status of a review
const isActiveReview: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract review ID from route params
    const { isActive } = req.body; // Extract the new active status from the request body
    console.log(isActive)
    if(!isActive){
      throw new Error('Status Not found')
    }
    const result = await ReviewServices.isActiveReview(id, isActive);
    res.status(200).json({
      success: true,
      message: 'Review status updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to update specific fields of a review
const updateReview: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract review ID from route params
    const updatedData = req.body; // Get the updated review data from request body
    const result = await ReviewServices.updateReview(id, updatedData);
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to delete a review by its ID
const deleteReview: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract review ID from route params
    const result = await ReviewServices.deleteReview(id);
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Export all the controllers
export const ReviewController = {
  createReview, // Create a review
  getProductReviews, // Get reviews for a specific product
  bestReviews, // Get the best reviews
  getAReview, // Get a single review by its ID
  getInActiveReviews, // Get all inactive reviews for a product
  getALLReviews, // Get all reviews
  isActiveReview, // Toggle review active status
  updateReview, // Update review fields
  deleteReview, // Delete a review by ID
  getALLInActiveReviews
};
