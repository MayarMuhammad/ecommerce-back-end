import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema({
  userID: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [{
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }]
}, { timestamps: true });


const cartModel = model("Cart", cartSchema);

export default cartModel;