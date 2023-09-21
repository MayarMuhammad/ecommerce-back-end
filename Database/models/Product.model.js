import { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: [10, 'Too short product name']
  },
  slug: {
    type: String,
    lowercase: true,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: [500, 'Description should be less than or equal 500 characters'],
    minlength: [20, 'Description should be more than or equal 20 characters'],
    trim: true,
  },
  price: {
    type: Number,
    default: 0,
    min: 0,
    required: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    min: 0,
    default: 0
  },
  priceAfterDiscount: {
    type: Number,
    default: 0,
    min: 0,
  },
  sold: {
    type: Number,
    default: 0,
    min: 0
  },
  imgCover: {
    type: Object,
    required: true,
  },
  images: {
    type: Array,
  },
  category: {
    type: Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subCategory: {
    type: Types.ObjectId,
    ref: 'SubCategory',
    required: true
  },
  brand: {
    type: Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  ratingAvg: {
    type: Number,
    max: 5,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: 0
  },
  colors: {
    type: Array
  },
  sizes: {
    type: Array
  },
  QRCode: {
    type: String,
    required: true
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  wishlist: [{
    type: Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true })

const productModel = model("Product", productSchema);

export default productModel;