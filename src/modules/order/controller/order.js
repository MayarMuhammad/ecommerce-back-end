import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../utils/AppError.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import couponModel from './../../../../Database/models/Coupon.model.js';
import productModel from "../../../../Database/models/Product.model.js";
import orderModel from "../../../../Database/models/Order.model.js";
import cartModel from './../../../../Database/models/Cart.model.js';
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrder = asyncHandler(async (req, res, next) => {
  let { products, address, phone, note, coupon, paymentMethod } = req.body;
  if (coupon) {
    const isCouponExist = await couponModel.findOne({ code: coupon, expiresIn: { $gte: Date.now() } });
    if (!isCouponExist) {
      return next(new AppError('Coupon not found', StatusCodes.NOT_FOUND));
    }
    if (isCouponExist.usedBy.includes(req.user._id)) {
      return next(new AppError('This coupon is used by this user before', StatusCodes.CONFLICT));
    }
    if (isCouponExist.expiresIn < Date.now() || isCouponExist.usedBy.length >= isCouponExist.numberOfUses) {
      return next(new AppError('Coupon expired', StatusCodes.GONE));
    }
    req.body.coupon = isCouponExist
  } if (!req.body.products) {
    const cart = await cartModel.findOne({ userID: req.user._id });
    if (!cart.products.length) {
      return next(new AppError('Cart is empty', StatusCodes.OK));
    }
    products = cart.products;
  }
  const existedProducts = [];
  const foundedIDs = [];
  let price = 0;
  for (const product of products) {
    const checkedProduct = await productModel.findById(product.product);
    if (!checkedProduct) {
      return next(new AppError(`Product ${product.product} not found`, StatusCodes.NOT_FOUND));
    }
    if (checkedProduct.stock < product.quantity) {
      return next(new AppError(`Quantity of this product ${checkedProduct.name} is more than available stock ... Stock available ${checkedProduct.stock}`, StatusCodes.GONE));
    }
    checkedProduct.stock = checkedProduct.stock - product.quantity;
    await checkedProduct.save();
    existedProducts.push({
      quantity: product.quantity,
      product:
      {
        name: checkedProduct.name,
        price: checkedProduct.price,
        paymentPrice: checkedProduct.priceAfterDiscount,
        productID: checkedProduct._id
      }
    });
    foundedIDs.push(checkedProduct._id);
    price += (checkedProduct.priceAfterDiscount * product.quantity);
  };
  const order = await orderModel.create({
    userID: req.user._id,
    address,
    products: existedProducts,
    phone,
    note,
    coupon: req.body.coupon?._id,
    paymentMethod,
    price,
    paymentPrice: price - (price * ((req.body.coupon?.amount || 0) / 100)),
    status: paymentMethod == 'card' ? 'waitPayment' : 'placed'
  });
  if (paymentMethod == 'card') {
    if (req.body.coupon) {
      const coupon = await stripe.coupons.create({ percent_off: req.body.coupon.amount, duration: "once" });
      req.body.stripeCoupon = coupon.id;
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.user.email,
      cancel_url: process.env.CANCEL_URL,
      success_url: process.env.SUCCESS_URL,
      metadata: {
        orderID: order._id.toString()
      },
      discounts: req.body.stripeCoupon ? [{ coupon: req.body.stripeCoupon }] : [],
      line_items: existedProducts.map(element => {
        return {
          price_data: {
            currency: 'EGP',
            product_data: {
              name: element.product.name,
            },
            unit_amount: element.product.paymentPrice * 100,
          },
          quantity: element.quantity
        }
      })
    })
    let response = {};
    response['Category'] = order;
    return res.status(StatusCodes.CREATED).json({ message: `Order:`, ...response, url: session.url });
  }
  if (req.body.coupon) {
    await couponModel.updateOne({ code: coupon }, { $addToSet: { usedBy: req.user._id } })
  }
  if (req.body.products) {
    await cartModel.updateOne({ userID: req.user._id }, { $pull: { products: { product: { $in: foundedIDs } } } })
  } else {
    await cartModel.updateOne({ userID: req.user._id }, { products: [] });
  }
  let response = {};
  response['Category'] = order;
  return res.status(StatusCodes.CREATED).json({ message: `Order:`, ...response });
})

export const webhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event = stripe.webhooks.constructEvent(req.body, sig, process.env.ENDPOINT_SECRET);
  if (event.type == "checkout.session.completed") {
    const order = await orderModel.findByIdAndUpdate(event.data.object.metadata.orderID, { status: 'placed' }, { new: true });
    return res.json({ order });
  } else {
    return next(new AppError('Invalid checkout', StatusCodes.PAYMENT_REQUIRED))
  }
})
