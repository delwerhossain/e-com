import { Types } from 'mongoose';
import { IReviews } from './reviews.interface';
import { ReviewsModel } from './reviews.model';
import { ProductModel } from '../Products/product.model';

// Function to create a new review
const createReview = async (review: IReviews) => {
  const addReviewIntoProduct = await ProductModel.findByIdAndUpdate(
    review?.productId,
    {
      $set: { reviews: review },
    },

  );
  // Create a new review and save it in the database
  const result = await ReviewsModel.create(review);
  return result;
};






// const createReview = async (review: IReviews) => {
//   // Create a new review and save it in the database
//   const newReview = await ReviewsModel.create(review);

//   // Update the product with the new review
//   const productId = review.productId;

//   // Find the product and add the new review
//   const product = await ProductModel.findById(productId);
//   if (!product) {
//     throw new Error('Product not found');
//   }

//   // Add the new review to the product's reviews array
//   product.reviews.push(newReview._id);

//   // Calculate the total and average ratings
//   const productReviews = await ReviewsModel.find({
//     productId: productId,
//     isActive: true, // Consider only active reviews
//   });

//   const totalRatings = productReviews.reduce(
//     (sum, review) => sum + review.rating,
//     0,
//   );
//   const averageRating = productReviews.length > 0
//     ? totalRatings / productReviews.length
//     : 0;

//   // Update product ratings and review count
//   product.ratings = {
//     averageRating: averageRating,
//     reviewsCount: productReviews.length,
//   };

//   // Save the updated product
//   await product.save();

//   return newReview;
// };




















// Function to fetch active reviews for a specific product
const getProductReviews = async (productId: Types.ObjectId) => {
  console.log(productId);
  const result = await ReviewsModel.find({
    isActive: true,
    productId: productId, // Query by ObjectId
  });
  console.log(result);
  return result; // Return the array directly, even if it's empty
};
// Function to fetch best reviews
const bestReviews = async () => {
  const result = await ReviewsModel.find({
    isBest: true,
  });
  return result;
};

// Function to get a specific review by its ID
const getAReview = async (id: string) => {
  // Find a review by its unique ID
  const result = await ReviewsModel.findById(id);
  if (!result) {
    return { Not_found: 'Review not found' };
  }
  return result;
};

// Function to get all inactive reviews for a specific product
const getInActiveReviews = async (productId: string) => {
  // Find all reviews that are marked as inactive for the given product ID
  const result = await ReviewsModel.find({
    isActive: false,
    productId: productId,
  });
  if (!result) {
    return { Not_found: 'Review not found' };
  }
  return result;
};

// Function to fetch all reviews regardless of their status
const getALLReviews = async () => {
  // Find all reviews in the database
  const result = await ReviewsModel.find();
  return result;
};

// Function to toggle or set the active status of a review
const isActiveReview = async (id: string, status: boolean) => {
  // Find a review by ID and update its active status
  const result = await ReviewsModel.findByIdAndUpdate(
    id,
    { $set: { isActive: status } }, // Set the isActive field to the passed status
    { new: true }, // Return the updated document
  );

  // If review is not found, return an error message
  if (!result) {
    return { Not_found: 'Review not found' };
  }

  return result;
};

// Function to update specific fields of a review
const updateReview = async (id: string, ReviewData: Partial<IReviews>) => {
  // Find a review by ID and update the specified fields
  const result = await ReviewsModel.findByIdAndUpdate(
    id,
    { $set: ReviewData }, // Set the fields to be updated
    { new: true }, // Return the updated document
  );

  // If review is not found, return an error message
  if (!result) {
    return { Not_found: 'Review not found' };
  }

  return result;
};

// Function to delete a review by its ID
const deleteReview = async (id: string) => {
  // Find a review by ID and delete it
  const result = await ReviewsModel.findByIdAndDelete(id);

  // If review is not found, return an error message
  if (!result) {
    return { Not_found: 'Review not found' }; // Update the error message to match the context
  }

  return result;
};

export const ReviewServices = {
  createReview, //crate a review
  getProductReviews, //get a specific products  all review
  getAReview, // get a single review with its object id
  getInActiveReviews, //front end prospective : admin can see all Bad inactive reviews of a product and if want he can active them..
  getALLReviews, //front end prospective : admin can see all active reviews to show them on what our client say about us section admin can make the review as isBest review / or change the active status form here also
  isActiveReview, //front end prospective : admin can change a reviews active status with help of this
  updateReview, //a user can update his review by this
  deleteReview, //a user or a vendor or a admin can delete a review with this
  bestReviews, // for get all best reviews.....admin can use the updateReview func for update the isBest field of a review.
};
