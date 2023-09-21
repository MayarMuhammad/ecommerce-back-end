import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import {
  addSubCategoryValidator,
  deleteSubCategoryValidator,
  getSpecificCategoryValidator,
  updateSubCategoryValidator,
} from "./subcategory.validation.js";
import {
  addSubCategoryModule,
  deleteSubCategoryModule,
  getAllSubCategoriesModule,
  getSpecificSubCategoryModule,
  updateSubCategoryModule,
} from "./controller/subcategory.js";
import auth, { roles } from "../../middleware/auth.js";
import { endpoints } from './subcategory.endPoint.js';

const router = Router({ mergeParams: true });

// router.use("/:SubCategoryID/subcategories", subSubCategoryRouter)
router
  .route("/")
  .post(auth(endpoints.subCategoryCRUD), validation(addSubCategoryValidator), addSubCategoryModule)
  .get(getAllSubCategoriesModule);
router
  .route("/:id")
  .put(auth(endpoints.subCategoryCRUD), validation(updateSubCategoryValidator), updateSubCategoryModule)
  .delete(auth(endpoints.subCategoryCRUD), validation(deleteSubCategoryValidator), deleteSubCategoryModule)
  .get(validation(getSpecificCategoryValidator), getSpecificSubCategoryModule);;

export default router;
