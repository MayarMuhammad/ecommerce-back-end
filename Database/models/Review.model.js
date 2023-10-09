import { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema({
  createdBy: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
  product: {
    type: Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
}, { timestamps: true })

const reviewModel = model("Review", reviewSchema);

export default reviewModel;