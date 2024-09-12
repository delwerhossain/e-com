import { RequestHandler } from 'express';
import reviewsValidation from './reviews.validation';
import { ReviewServices } from './reviews.services';

const createReview: RequestHandler = async (req, res, next) => {
  try {
    const review = reviewsValidation.parse(req.body);
    const result = await ReviewServices.createReview(review);
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
