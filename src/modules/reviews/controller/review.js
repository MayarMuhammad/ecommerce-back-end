import productModel from './../../../../Database/models/Product.model.js';
import orderModel from './../../../../Database/models/Order.model.js';
import { AppError } from '../../../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import reviewModel from './../../../../Database/models/Review.model.js';
import { asyncHandler } from "../../../utils/errorHandling.js";

export const addReviewModule = asyncHandler(async (req, res, next) => {
  const createdBy = req.user._id;
  const { comment, rating, product } = req.body;
  const checkProduct = await productModel.findById(product);
  if (!checkProduct) {
    return next(new AppError(`Product not found`, StatusCodes.NOT_FOUND));
  }
  const checkReview = await reviewModel.findOne({ createdBy, product });
  if (checkReview) {
    return next(new AppError(`Product already reviewed by this user`, StatusCodes.BAD_REQUEST));
  }
  const checkOrder = await orderModel.findOne({ userID: createdBy, status: 'delivered', "products.product.productID": product });
  if (!checkOrder) {
    return next(new AppError(`Cannot review this product`, StatusCodes.BAD_REQUEST));
  }
  const review = await reviewModel.create({ comment, rating, product, createdBy });
  // const reviews = await reviewModel.find({ product });
  // let sum = 0;
  // for (const review of reviews) {
  //   sum += review.rating;
  // }
  // const avg = sum / reviews.length;
  // checkProduct.ratingAvg = avg;
  // checkProduct.ratingCount += 1;
  const avg = ((checkProduct.ratingAvg * checkProduct.ratingCount) + rating) / (checkProduct.ratingCount + 1);
  checkProduct.ratingAvg = avg;
  checkProduct.ratingCount = checkProduct.ratingCount + 1;
  await checkProduct.save();
  let response = {};
  response['Review'] = review;
  return res.status(StatusCodes.CREATED).json({ message: `Review added`, ...response });
});

export const updateReviewModule = asyncHandler(async (req, res, next) => {
  const createdBy = req.user._id;
  const { comment, rating } = req.body;
  const reviewID = req.params.id;
  const checkReview = await reviewModel.findOne({ _id: reviewID, createdBy });
  if (!checkReview) {
    return next(new AppError(`Review not found`, StatusCodes.BAD_REQUEST));
  }
  const checkProduct = await productModel.findById(checkReview.product);
  if (rating) {
    const avg = (((checkProduct.ratingAvg * checkProduct.ratingCount) - checkReview.rating) + rating) / (checkProduct.ratingCount);
    checkProduct.ratingAvg = avg;
    checkReview.rating = rating;
    await checkProduct.save();
  }
  if (comment) {
    checkReview.comment = comment
  }
  await checkReview.save();
  let response = {};
  response['Review'] = checkReview;
  return res.status(StatusCodes.CREATED).json({ message: `Review Updated`, ...response });
});

export const deleteReviewModule = asyncHandler(async (req, res, next) => {
  const createdBy = req.user._id;
  const reviewID = req.params.id;
  const checkReview = await reviewModel.findOneAndDelete({ _id: reviewID, createdBy });
  if (!checkReview) {
    return next(new AppError(`Review not found`, StatusCodes.BAD_REQUEST));
  }
  const checkProduct = await productModel.findById(checkReview.product);
  const avg = checkProduct.ratingCount == 1 ? 0 : ((checkProduct.ratingAvg * checkProduct.ratingCount) - checkReview.rating) / (checkProduct.ratingCount - 1);
  checkProduct.ratingAvg = avg;
  checkProduct.ratingCount = checkProduct.ratingCount - 1;
  await checkProduct.save();
  await checkReview.save();
  let response = {};
  response['Review'] = checkReview;
  return res.status(StatusCodes.CREATED).json({ message: `Review Deleted`, ...response });
});

export const getProductReviewsModule = asyncHandler(async (req, res, next) => {
  const productID = req.params.id;
  const reviews = await reviewModel.find({ product: productID }).populate([{ path: 'createdBy', select: "name email image" }]);
  if (!reviews) {
    return next(new AppError(`Review not found`, StatusCodes.NOT_FOUND));
  }
  let response = {};
  response['Reviews'] = reviews;
  return res.status(StatusCodes.OK).json({ message: `Reviews:`, ...response });
});