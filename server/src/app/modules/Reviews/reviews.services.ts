import { IReviews } from './reviews.interface';
import { ReviewsModel } from './reviews.model';

const createReview = async (review: IReviews) => {
  const result = await ReviewsModel.create(review);
  return result;
};

const getProductReviews = async (productId: string) => {
  const result = await ReviewsModel.find({
    isActive: true,
    productId: productId,
  });
  return result;
};

const getAReview = async (id: string) => {
  const result = await ReviewsModel.findById(id);
  return result;
};

//TODO:-Use-case -> if admin wants he can watch the full reviews DB form his Dashboard ACTIVE AND INACTIVE STATUS also if no use case the it will be remove before UPLOAD the backend
const getALLReviews = async () => {
  const result = await ReviewsModel.find();
  return result;
};

const getInActiveReviews = async (productId: string) => {
  const result = await ReviewsModel.find({
    isActive: false,
    productId: productId,
  });
};
