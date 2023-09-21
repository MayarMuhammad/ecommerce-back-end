import { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: Boolean,
    default: false,
  },
  image: {
    type: Object
  },
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'user']
  },
  DOB: {
    type: Date,
  },
  code: {
    type: String,
    min: 6,
    max: 6
  },
  favorites: [{
    type: Types.ObjectId,
    ref: 'Product'
  }]
}, { timestamps: true })

const userModel = model("User", userSchema);

export default userModel;