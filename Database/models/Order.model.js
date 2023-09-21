import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema({
  userID: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  note: {
    type: String
  },
  coupon: {
    type: Types.ObjectId,
    ref: "Coupon"
  },
  price: {
    type: Number,
    required: true
  },
  paymentPrice: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    default: 'cash',
    enum: ['cash', 'card'],
  },
  status: {
    type: String,
    default: 'placed',
    enum: ['waitPayment', 'onRoad', 'placed', 'canceled', 'rejected', 'delivered']
  },
  reason: {
    type: String
  },
  products: [{
    product: {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      paymentPrice: { type: Number, required: true },
      productID: { type: Types.ObjectId, required: true, ref: "Product" }
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }]
}, { timestamps: true });


const orderModel = model("Order", orderSchema);

export default orderModel;