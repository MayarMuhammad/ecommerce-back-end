import { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: [2, "Too short subCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// subCategorySchema.post('init', function (document) {
//   document.image = process.env.BASE_URL + '/subCategory/' + document.image;
// })

const subCategoryModel = model("SubCategory", subCategorySchema);

export default subCategoryModel;
