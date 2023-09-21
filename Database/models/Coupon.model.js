import { Schema, Types, model } from "mongoose";

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  numberOfUses: {
    type: Number,
  },
  usedBy: [{
    type: Types.ObjectId,
    ref: 'User'
  }],
  expiresIn: {
    type: Date,
    required: true,
    min: Date.now()
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
}, { timestamps: true })

const couponModel = model("Coupon", couponSchema);

export default couponModel;