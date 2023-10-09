import { Router } from "express";
import { endpoints } from './reviews.endPoint.js';
import { addReviewModule, deleteReviewModule, getProductReviewsModule, updateReviewModule } from "./controller/review.js";
import { addReviewValidator, deleteReviewValidator, getProductReviewValidator, updateReviewValidator } from "./reviews.validation.js";
import auth from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";



const router = Router()

router
  .route("/").post(auth(endpoints.reviewCRUD), validation(addReviewValidator), addReviewModule);
router
  .route("/:id")
  .put(auth(endpoints.reviewCRUD), validation(updateReviewValidator), updateReviewModule)
  .delete(auth(endpoints.reviewCRUD), validation(deleteReviewValidator), deleteReviewModule)
  .get(validation(getProductReviewValidator), getProductReviewsModule)


export default router