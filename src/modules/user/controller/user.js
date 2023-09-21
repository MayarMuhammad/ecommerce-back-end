
import { asyncHandler } from './../../../utils/errorHandling.js';
import userModel from './../../../../Database/models/User.model.js';
import { AppError } from '../../../utils/AppError.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto-js';
import cloudinary from './../../../utils/cloudinary.js';
import { nanoid } from 'nanoid';
import sendEmail, { createHTML } from './../../../utils/email.js';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import cartModel from './../../../../Database/models/Cart.model.js';
import productModel from '../../../../Database/models/Product.model.js';


export const signupModule = asyncHandler(async (req, res, next) => {
  const isEmailExist = await userModel.findOne({ email: req.body.email });
  if (isEmailExist) {
    return next(new AppError(`Email already exists`, StatusCodes.CONFLICT));
  }
  req.body.password = bcrypt.hashSync(req.body.password, -(process.env.SALT_ROUND));
  if (req.body.phone) {
    req.body.phone = crypto.AES.encrypt(req.body.phone, process.env.ENCRYPTION_KEY).toString();
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: '/user' });
    req.body.image = { public_id, secure_url }
  }
  const code = nanoid(6);
  req.body.code = code;
  const html = createHTML(code);
  await sendEmail({ to: req.body.email, subject: "Email Confirmation", html });
  req.body.DOB = new Date(req.body.DOB);
  const user = await userModel.create(req.body);
  await cartModel.create({ userID: user._id });
  let response = {};
  response['User'] = user;
  return res.status(StatusCodes.CREATED).json({ message: `User added`, ...response });
});

export const confirmEmailModule = asyncHandler(async (req, res, next) => {
  const isEmailExist = await userModel.findOne({ email: req.body.email });
  if (!isEmailExist) {
    return next(new AppError(`Email not found`, StatusCodes.NOT_FOUND));
  }
  if (isEmailExist.isVerified) {
    return next(new AppError(`Email already confirmed`, StatusCodes.CONFLICT));
  }
  if (req.body.code != isEmailExist.code) {
    return next(new AppError(`Invalid confirmation code`, StatusCodes.BAD_REQUEST));
  }
  const newCode = nanoid(6);
  await userModel.updateOne({ _id: isEmailExist._id }, { isVerified: true, code: newCode });
  return res.status(StatusCodes.OK).json({ message: "Email confirmed" })
});

export const loginModule = asyncHandler(async (req, res, next) => {
  const isEmailExist = await userModel.findOne({ email: req.body.email });
  if (!isEmailExist) {
    return next(new AppError(`Email not found`, StatusCodes.NOT_FOUND));
  }
  if (!isEmailExist.isVerified) {
    return next(new AppError(`Confirm your email first to login`, StatusCodes.UNAUTHORIZED));
  }
  const match = bcrypt.compareSync(req.body.password, isEmailExist.password);
  if (!match) {
    return next(new AppError("Invalid credentials"), StatusCodes.UNAUTHORIZED);
  }
  const token = jwt.sign({ name: isEmailExist.name, id: isEmailExist._id }, process.env.TOKEN_SIGNATURE);
  return res.status(StatusCodes.OK).json({ message: `Welcome ${isEmailExist.name}`, token });
});

export const sendCodeModule = asyncHandler(async (req, res, next) => {
  const isEmailExist = await userModel.findOne({ email: req.body.email });
  if (!isEmailExist) {
    return next(new AppError(`Email not found`, StatusCodes.NOT_FOUND));
  }
  const code = nanoid(6);
  const html = createHTML(code);
  sendEmail(req.body.email, 'Change Password', html);
  await userModel.updateOne({ email: req.body.email }, { code });
  return res.status(StatusCodes.OK).json({ message: `Check your email` });
});

export const resetPasswordModule = asyncHandler(async (req, res, next) => {
  const isEmailExist = await userModel.findOne({ email: req.body.email });
  if (!isEmailExist) {
    return next(new AppError(`Email not found`, StatusCodes.NOT_FOUND));
  }
  if (req.body.code != isEmailExist.code) {
    return next(new AppError(`Invalid confirmation code`, StatusCodes.BAD_REQUEST));
  }
  req.body.password = bcrypt.hashSync(req.body.password, -(process.env.SALT_ROUND));
  const newCode = nanoid(6);
  await userModel.updateOne({ _id: isEmailExist._id }, { password: req.body.password, code: newCode });
  return res.status(StatusCodes.OK).json({ message: `Password Updated` });
});

export const addToFavorites = asyncHandler(async (req, res, next) => {
  const { productID } = req.body;
  const product = await productModel.findById(productID);
  if (!product) {
    return next(new AppError('Product not found', StatusCodes.NOT_FOUND));
  }
  const user = await userModel.updateOne({ _id: req.user._id }, { $addToSet: { favorites: productID } });
  let response = {};
  response['User'] = user;
  return res.status(StatusCodes.OK).json({ message: `Product added to favorites`, ...response });
});

export const getUserFavorites = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate('favorites');
  user.favorites = user.favorites.filter(element => {
    if (element) {
      return element;
    }
  });
  return res.status(StatusCodes.OK).json({ message: `Favorites`, favorites: user.favorites });
})