import { Schema, Types, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: [2, "Too short category name"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true
    },
    image: {
      type: Object,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    id: false, toJSON: { virtuals: true }, timestamps: true
  }
);

categorySchema.virtual("subcategories", {
  localField: "_id",
  foreignField: "category",
  ref: "SubCategory"
})
// categorySchema.post('init', function (document) {
//   document.image = process.env.BASE_URL + '/category/' + document.image;
// })

const categoryModel = model("Category", categorySchema);

export default categoryModel;
