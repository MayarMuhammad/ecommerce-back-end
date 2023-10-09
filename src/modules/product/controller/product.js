import productModel from './../../../../Database/models/Product.model.js';
import { StatusCodes } from 'http-status-codes';
import categoryModel from './../../../../Database/models/Category.model.js';
import { AppError } from "../../../utils/AppError.js";
import brandModel from "../../../../Database/models/Brand.model.js";
import subCategoryModel from './../../../../Database/models/SubCategory.model.js';
import slugify from "slugify";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js";
import QRCode from 'qrcode';
import { ApiFeatures } from "../../../utils/AppFeatures.js";

export const addProductModule = asyncHandler(async (req, res, next) => {
  req.body.name = req.body.name.toLowerCase();
  const userID = req.user._id;
  const isNameExist = await productModel.findOne({ name: req.body.name })
  if (isNameExist) {
    isNameExist.stock += Number(req.body.quantity);
    await isNameExist.save();
    return res.status(StatusCodes.OK).json({ message: `Done:`, product: isNameExist });
  }
  const isCategoryExist = await categoryModel.findById(req.body.category)
  if (!isCategoryExist) {
    return next(new AppError(`Category not found`, StatusCodes.NOT_FOUND));
  }
  const isSubCategoryExist = await subCategoryModel.findById(req.body.subCategory)
  if (!isSubCategoryExist) {
    return next(new AppError(`SubCategory not found`, StatusCodes.NOT_FOUND));
  }
  const isBrandExist = await brandModel.findById(req.body.brand)
  if (!isBrandExist) {
    return next(new AppError(`Brand not found`, StatusCodes.NOT_FOUND));
  }
  req.body.slug = slugify(req.body.name);
  req.body.stock = Number(req.body.quantity);
  req.body.priceAfterDiscount = ((req.body.price) - ((req.body.price) * (((req.body.discount) || 0) / 100)));
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.imgCover[0].path, { folder: 'product/imgCover' });
  req.body.imgCover = { secure_url, public_id };
  if (req.files.images?.length) {
    const images = [];
    for (let i = 0; i < req.files.images.length; i++) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.images[i].path, { folder: 'product/imgCover' });
      images.push({ secure_url, public_id });
    }
    req.body.images = images;
  }
  if (req.body.sizes) {
    req.body.sizes = JSON.parse(req.body.sizes);
  }
  if (req.body.colors) {
    req.body.colors = JSON.parse(req.body.colors);
  }
  req.body.QRCode = await QRCode.toDataURL(JSON.stringify({
    name: req.body.name,
    description: req.body.description,
    imgURL: req.body.imgCover.secure_url,
    price: req.body.price,
    priceAfterDiscount: req.body.priceAfterDiscount
  }));
  req.body.createdBy = req.user._id;
  const document = await productModel.create(req.body);
  let response = {};
  response['Product'] = document;
  return res.status(StatusCodes.CREATED).json({ message: `Product added`, ...response });
});

export const getAllProductsModule = asyncHandler(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .fields()
    .filter()
    .paginate()
    .search()
    .sort();
  const document = await apiFeatures.query;
  let response = {};
  response['Product'] = document;
  return res.status(StatusCodes.OK).json({ message: `Product:`, ...response });
});

export const getSpecificProductModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await productModel.findById(id);
  if (!document) {
    return next(new AppError(`Product not found`, StatusCodes.NOT_FOUND));
  }
  let response = {};
  response['Product'] = document;
  return res.status(StatusCodes.OK).json({ message: `Product:`, ...response });
});
