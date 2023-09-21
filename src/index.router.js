import authRouter from './modules/auth/auth.routes.js'
import brandRouter from './modules/brand/brand.routes.js'
import cartRouter from './modules/cart/cart.routes.js'
import categoryRouter from './modules/category/category.routes.js'
import couponRouter from './modules/coupon/coupon.routes.js'
import orderRouter from './modules/order/order.routes.js'
import productRouter from './modules/product/product.routes.js'
import reviewsRouter from './modules/reviews/reviews.routes.js'
import subcategoryRouter from './modules/subCategory/subCategory.routes.js'
import userRouter from './modules/user/user.routes.js'
import { AppError } from './utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import { globalErrorHandling } from './utils/errorHandling.js'
import morgan from 'morgan'
import connectDB from '../Database/connection.js'

const bootstrap = (app, express) => {
  //convert Buffer Data
  app.use((req, res, next) => {
    if (req.originalUrl == '/order/webhook') {
      next();
    } else {
      express.json()(req, res, next);
    }
  })
  app.use(morgan('dev'));
  //Setup API Routing 
  app.use(`/`, (req, res, next) => {
    return res.json({ message: 'Welcome to our e-commerce backend' })
  })
  app.use(`/auth`, authRouter)
  app.use(`/user`, userRouter)
  app.use(`/products`, productRouter)
  app.use(`/categories`, categoryRouter)
  app.use(`/subcategories`, subcategoryRouter)
  app.use(`/reviews`, reviewsRouter)
  app.use(`/coupons`, couponRouter)
  app.use(`/cart`, cartRouter)
  app.use(`/order`, orderRouter)
  app.use(`/brands`, brandRouter)
  app.all("*", (req, res, next) => {
    next(new AppError("Invalid Routing", StatusCodes.NOT_FOUND))
  });
  app.use(globalErrorHandling)
  connectDB()
}

export default bootstrap