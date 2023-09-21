import { StatusCodes } from "http-status-codes";
import couponModel from "../../../../Database/models/Coupon.model.js";
import { AppError } from "../../../utils/AppError.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const addCouponModule = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({ code: req.body.code });
  if (coupon) {
    return next(new AppError('This code already in use', StatusCodes.CONFLICT));
  }
  req.body.createdBy = req.user._id;
  const addedCoupon = await couponModel.create(req.body);
  let response = {};
  response['Coupon'] = addedCoupon;
  return res.status(StatusCodes.CREATED).json({ message: `Coupon added`, ...response });
});