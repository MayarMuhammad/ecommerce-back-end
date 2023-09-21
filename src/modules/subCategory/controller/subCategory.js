import slugify from 'slugify';
import subCategoryModel from '../../../../Database/models/SubCategory.model.js';
import cloudinary from '../../../utils/cloudinary.js';
import { asyncHandler } from '../../../utils/errorHandling.js';
import { AppError } from '../../../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { ApiFeatures } from '../../../utils/AppFeatures.js';
import categoryModel from '../../../../Database/models/Category.model.js';
import productModel from '../../../../Database/models/Product.model.js';


export const addSubCategoryModule = asyncHandler(async (req, res, next) => {
  let { name, category } = req.body;
  const userID = req.user._id;
  name = name.toLowerCase();
  const checkDocument = await subCategoryModel.findOne({ name });
  if (checkDocument) {
    return next(new AppError(`SubCategory already exists`, StatusCodes.CONFLICT));
  }
  const checkCategory = await categoryModel.findOne({ category });
  if (checkCategory) {
    return next(new AppError(`Category not found`, StatusCodes.NOT_FOUND));
  }
  const slug = slugify(name);
  const document = await subCategoryModel.create({ name, slug, category: req.body.category, createdBy: userID });
  let response = {};
  response['SubCategory'] = document;
  return res.status(StatusCodes.CREATED).json({ message: `SubCategory added`, ...response });
});

export const updateSubCategoryModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const checkDocument = await subCategoryModel.findById(id);
  if (!checkDocument) {
    return next(
      new AppError(`SubCategory not found`, StatusCodes.NOT_FOUND)
    );
  }
  if (req.body.name) {
    if (checkDocument.name == req.body.name) {
      return next(
        new AppError(`New subcategory name must be different from old subcategory name`, StatusCodes.CONFLICT));
    }
    const checkDuplicate = await subCategoryModel.findOne({
      $and: [{ name: req.body.name }, { _id: { $ne: id } }],
    });
    if (checkDuplicate) {
      return next(new AppError("Duplicate Entry", StatusCodes.CONFLICT));
    }
    req.body.slug = slugify(req.body.name);
  }
  if (req.body.category) {
    const checkCategory = await categoryModel.findOne({ category: req.body.category });
    if (!checkCategory) {
      return next(new AppError(`Category not found`, StatusCodes.NOT_FOUND));
    }
  }
  const document = await subCategoryModel.updateOne({ _id: id }, req.body, { new: true });
  let response = {};
  response['SubCategory'] = document;
  return res.status(StatusCodes.OK).json({ message: `SubCategory updated`, ...response });
});

export const deleteSubCategoryModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await subCategoryModel.findByIdAndDelete(id);
  if (!document) {
    return next(
      new AppError(`SubCategory not found`, StatusCodes.NOT_FOUND)
    );
  }
  await cloudinary.uploader.destroy(document.image.public_id);
  const products = await productModel.find({ subCategory: id });
  for (let i = 0; i < products.length; i++) {
    await cloudinary.uploader.destroy(products[i].image.public_id);
  }
  await productModel.deleteMany({ subCategory: id });
  let response = {};
  response['SubCategory'] = document;
  return res.status(StatusCodes.OK).json({ message: `SubCategory deleted`, ...response });
});

export const getAllSubCategoriesModule = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.params.id) {
    filter = { category: req.params.id };
  }
  let apiFeatures = new ApiFeatures(subCategoryModel.find(filter).populate([{ path: 'category' }]), req.query)
    .fields()
    .filter()
    .paginate()
    .search()
    .sort();
  let document = await apiFeatures.query;
  let response = {};
  response['SubCategory'] = document;
  return res.status(StatusCodes.OK).json({ message: `SubCategory:`, ...response });
});

export const getSpecificSubCategoryModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await subCategoryModel.findById(id).populate([{ path: 'category' }]);
  if (!document) {
    return next(new AppError(`SubCategory not found`, StatusCodes.NOT_FOUND));
  }
  let response = {};
  response['SubCategory'] = document;
  return res.status(StatusCodes.OK).json({ message: `SubCategory:`, ...response });
});