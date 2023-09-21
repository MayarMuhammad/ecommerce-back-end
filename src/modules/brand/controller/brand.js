import brandModel from './../../../../Database/models/Brand.model.js';
import cloudinary from '../../../utils/cloudinary.js';
import { asyncHandler } from '../../../utils/errorHandling.js';
import { AppError } from '../../../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import { ApiFeatures } from './../../../utils/AppFeatures.js';
import productModel from '../../../../Database/models/Product.model.js';


export const addBrandModule = asyncHandler(async (req, res, next) => {
  let { name } = req.body;
  const userID = req.user._id;
  name = name.toLowerCase();
  const checkDocument = await brandModel.findOne({ name });
  if (checkDocument) {
    return next(new AppError(`Brand already exists`, StatusCodes.CONFLICT));
  }
  const slug = slugify(name);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `Brand` }
  );
  const document = await brandModel.create({ name, slug, image: { secure_url, public_id }, createdBy: userID });
  let response = {};
  response['Brand'] = document;
  return res.status(StatusCodes.CREATED).json({ message: `Brand added`, ...response });
});

export const updateBrandModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const checkDocument = await brandModel.findById(id);
  if (!checkDocument) {
    return next(
      new AppError(`Brand not found`, StatusCodes.NOT_FOUND)
    );
  }
  if (req.body.name) {
    if (checkDocument.name == req.body.name) {
      return next(
        new AppError(`New brand name must be different from old brand name`, StatusCodes.CONFLICT));
    }
    const checkDuplicate = await brandModel.findOne({
      $and: [{ name: req.body.name }, { _id: { $ne: id } }],
    });
    if (checkDuplicate) {
      return next(new AppError("Duplicate Entry", StatusCodes.CONFLICT));
    }
    req.body.slug = slugify(req.body.name);
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Brand` });
    await cloudinary.uploader.destroy(checkDocument.image.public_id);
    req.body.image = { secure_url, public_id };
  }
  const document = await brandModel.updateOne({ _id: id }, req.body, { new: true });
  let response = {};
  response['Brand'] = document;
  return res.status(StatusCodes.OK).json({ message: `Brand updated`, ...response });
});

export const deleteBrandModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await brandModel.findByIdAndDelete(id);
  if (!document) {
    return next(
      new AppError(`Brand not found`, StatusCodes.NOT_FOUND)
    );
  }
  await cloudinary.uploader.destroy(document.image.public_id);
  const products = await productModel.find({ brand: id });
  for (let i = 0; i < products.length; i++) {
    await cloudinary.uploader.destroy(products[i].image.public_id);
  }
  await productModel.deleteMany({ brand: id });
  let response = {};
  response['Brand'] = document;
  return res.status(StatusCodes.OK).json({ message: `Brand deleted`, ...response });
});

export const getAllBrandsModule = asyncHandler(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(brandModel.find(), req.query)
    .fields()
    .filter()
    .paginate()
    .search()
    .sort();
  let document = await apiFeatures.query;
  let response = {};
  response['Brand'] = document;
  return res.status(StatusCodes.OK).json({ message: `Brand:`, ...response });
});

export const getSpecificBrandModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await brandModel.findById(id);
  if (!document) {
    return next(new AppError(`Brand not found`, StatusCodes.NOT_FOUND));
  }
  let response = {};
  response['Brand'] = document;
  return res.status(StatusCodes.OK).json({ message: `Brand:`, ...response });
});
