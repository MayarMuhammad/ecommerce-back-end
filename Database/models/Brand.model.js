import { Schema, Types, model } from "mongoose";

const brandSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    lowercase: true,
    required: true
  },
  image: {
    type: Object,
    required: true
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// brandSchema.post('init', function (document) {
//   document.logo = process.env.BASE_URL + '/brand/' + document.logo;
// })

const brandModel = model("Brand", brandSchema);

export default brandModel;