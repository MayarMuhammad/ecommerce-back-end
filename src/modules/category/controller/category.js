import cloudinary from '../../../utils/cloudinary.js';
import { asyncHandler } from '../../../utils/errorHandling.js';
import { AppError } from '../../../utils/AppError.js';
import categoryModel from "./../../../../Database/models/Category.model.js";
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import { ApiFeatures } from './../../../utils/AppFeatures.js';
import subCategoryModel from '../../../../Database/models/SubCategory.model.js';
import productModel from './../../../../Database/models/Product.model.js';


export const addCategoryModule = asyncHandler(async (req, res, next) => {
  let { name } = req.body;
  const userID = req.user._id;
  name = name.toLowerCase();
  const checkDocument = await categoryModel.findOne({ name });
  if (checkDocument) {
    return next(new AppError(`Category already exists`, StatusCodes.CONFLICT));
  }
  const slug = slugify(name);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `Category` }
  );
  const document = await categoryModel.create({ name, slug, image: { secure_url, public_id }, createdBy: userID });
  let response = {};
  response['Category'] = document;
  return res.status(StatusCodes.CREATED).json({ message: `Category added`, ...response });
});

export const updateCategoryModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const checkDocument = await categoryModel.findById(id);
  if (!checkDocument) {
    return next(
      new AppError(`Category not found`, StatusCodes.NOT_FOUND)
    );
  }
  if (req.body.name) {
    if (checkDocument.name == req.body.name) {
      return next(
        new AppError(`New category name must be different from old category name`, StatusCodes.CONFLICT));
    }
    const checkDuplicate = await categoryModel.findOne({
      $and: [{ name: req.body.name }, { _id: { $ne: id } }],
    });
    if (checkDuplicate) {
      return next(new AppError("Duplicate Entry", StatusCodes.CONFLICT));
    }
    req.body.slug = slugify(req.body.name);
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Category` });
    await cloudinary.uploader.destroy(checkDocument.image.public_id);
    req.body.image = { secure_url, public_id };
  }
  const document = await categoryModel.updateOne({ _id: id }, req.body, { new: true });
  let response = {};
  response['Category'] = document;
  return res.status(StatusCodes.OK).json({ message: `Category updated`, ...response });
});

export const deleteCategoryModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await categoryModel.findByIdAndDelete(id);
  if (!document) {
    return next(
      new AppError(`Category not found`, StatusCodes.NOT_FOUND)
    );
  }
  await cloudinary.uploader.destroy(document.image.public_id);
  const subCategories = await subCategoryModel.find({ category: id });
  for (let i = 0; i < subCategories.length; i++) {
    await cloudinary.uploader.destroy(subCategories[i].image.public_id);
  }
  const products = await productModel.find({ category: id });
  for (let i = 0; i < products.length; i++) {
    await cloudinary.uploader.destroy(products[i].image.public_id);
  }
  await subCategoryModel.deleteMany({ category: id });
  await productModel.deleteMany({ category: id });
  let response = {};
  response['Category'] = document;
  return res.status(StatusCodes.OK).json({ message: `Category deleted`, ...response });
  // !document && res.status(StatusCodes.NOT_FOUND).json({ message: `Category not found` });
  // document && res.status(StatusCodes.OK).json({ message: `Category deleted`, document });
});

export const getAllCategoriesModule = asyncHandler(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(categoryModel.find().populate([{ path: 'subcategories' }]), req.query)
    .fields()
    .filter()
    .paginate()
    .search()
    .sort();
  let document = await apiFeatures.query;
  let response = {};
  response['Category'] = document;
  return res.status(StatusCodes.OK).json({message: `Category:`, ...response });
});

export const getSpecificCategoryModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await categoryModel.findById(id).populate([{ path: 'subcategories' }]);
  if (!document) {
    return next(new AppError(`Category not found`, StatusCodes.NOT_FOUND));
  }
  let response = {};
  response['Category'] = document;
  return res.status(StatusCodes.OK).json({ message: `Category:`, ...response });
});

