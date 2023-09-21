import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../utils/AppError.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import productModel from './../../../../Database/models/Product.model.js';
import cartModel from './../../../../Database/models/Cart.model.js';

export const addToCartModule = asyncHandler(async (req, res, next) => {
  const { productID, quantity } = req.body;
  const isExistProduct = await productModel.findById(productID);
  if (!isExistProduct) {
    return next(new AppError('Product not found', StatusCodes.NOT_FOUND));
  }
  if (quantity > isExistProduct.stock) {
    await productModel.updateOne({ _id: productID }, {
      $addToSet: {
        wishlist: req.user._id
      }
    })
    return next(new AppError('Out of stock', StatusCodes.BAD_REQUEST));
  }
  const cart = await cartModel.findOne({ userID: req.user._id });
  const productIndex = cart.products.findIndex(element => {
    return element.product == productID;
  });
  if (productIndex == -1) {
    cart.products.push({
      product: productID,
      quantity
    })
  } else {
    cart.products[productIndex].quantity = quantity;
  }
  await cart.save();
  let response = {};
  response['Cart'] = cart;
  return res.status(StatusCodes.OK).json({ message: `Cart added`, ...response });
});

export const removeFromCartModule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cart = await cartModel.findOneAndUpdate({ userID: req.user._id }, { $pull: { products: { _id: id } } }, { new: true });
  console.log(cart);
  if (!cart) {
    return next(new AppError('Cart not found', StatusCodes.NOT_FOUND));
  }
  let response = {};
  response['Cart'] = cart;
  return res.status(StatusCodes.OK).json({ message: `Product removed from cart`, ...response });
});

export const getUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ userID: req.user._id }).populate([
    {
      path: 'products.product',
      select: 'name price stock description priceAfterDiscount'
    }
  ]);
  let totalPrice = 0;
  cart.products = cart.products.filter(element => {
    if (element.product && element.product.stock) {
      if (element.product.stock < element.quantity) {
        element.quantity = element.product.stock;
      }
      totalPrice += (element.quantity * element.product.priceAfterDiscount);
      return element;
    } 
  });
  await cart.save();
  return res.status(StatusCodes.OK).json({ message: `Cart`, cart, totalPrice });
})