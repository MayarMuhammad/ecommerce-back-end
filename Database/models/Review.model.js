import { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  product: {
    type: Types.ObjectId,
    required: true,
    ref: "Product",
  },
  user: {
    type: Types.ObjectId,
    required: true,
    ref: "User",
  },
  rate: {
    type: Number,
    enum: [1, 2, 3, 4, 5]
  }

}, { timestamps: true })

const reviewModel = model("Review", reviewSchema);

export default reviewModel;