import { Router } from "express";
import { addCouponModule } from "./controller/coupon.js";
import { endpoints } from "./coupon.endPoint.js";
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addCouponValidator } from "./coupon.validation.js";



const router = Router()

router
  .route("/").post(auth(endpoints.coupon), validation(addCouponValidator), addCouponModule);



export default router