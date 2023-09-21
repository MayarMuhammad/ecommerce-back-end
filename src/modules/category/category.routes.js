import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import subCategoryRouter from '../subCategory/subCategory.routes.js'
import {
  addCategoryModule,
  deleteCategoryModule,
  getAllCategoriesModule,
  getSpecificCategoryModule,
  updateCategoryModule,
} from "./controller/category.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import {
  addCategoryValidator,
  deleteCategoryValidator,
  getSpecificCategoryValidator,
  updateCategoryValidator,
} from "./category.validation.js";
import auth, { roles } from "../../middleware/auth.js";
import { endpoints } from "./category.endPoint.js";

const router = Router();

router.use("/:id/subcategories", subCategoryRouter);

router
  .route("/")
  .post(auth(endpoints.categoryCRUD), fileUpload(fileValidation.image).single("image"), validation(addCategoryValidator), addCategoryModule)
  .get(getAllCategoriesModule)
router
  .route("/:id")
  .put(auth(endpoints.categoryCRUD), fileUpload(fileValidation.image).single("image"), validation(updateCategoryValidator), updateCategoryModule)
  .delete(auth(endpoints.categoryCRUD), validation(deleteCategoryValidator), deleteCategoryModule)
  .get(validation(getSpecificCategoryValidator), getSpecificCategoryModule);

export default router;
