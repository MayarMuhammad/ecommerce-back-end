import { Router } from "express";
import auth from "../../middleware/auth.js";
import { endpoints } from "./cart.endPoint.js";
import { addToCartModule, removeFromCartModule, getUserCart } from './controller/cart.js';
import { addToCartValidator, removeFromCartValidator } from "./cart.validation.js";
import { validation } from "../../middleware/validation.js";


const router = Router();

router.route("/")
  .post(auth(endpoints.cart), validation(addToCartValidator), addToCartModule)
  .get(auth(endpoints.cart), getUserCart);

router.route("/:id")
  .delete(auth(endpoints.cart), validation(removeFromCartValidator), removeFromCartModule);

export default router