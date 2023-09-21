import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { addBrandValidator, deleteBrandValidator, getSpecificBrandValidator, updateBrandValidator } from "./brand.validation.js";
import { addBrandModule, deleteBrandModule, getAllBrandsModule, getSpecificBrandModule, updateBrandModule } from "./controller/brand.js";
import auth, { roles } from "../../middleware/auth.js";
import { endpoints } from "./brand.endPoint.js";


const router = Router();

// router.use("/:categoryID/subcategories", subCategoryRouter)
router
  .route("/")
  .post(auth(endpoints.brandCRUD), fileUpload(fileValidation.image).single("image"), validation(addBrandValidator), addBrandModule)
  .get(getAllBrandsModule)
router
  .route("/:id")
  .put(auth(endpoints.brandCRUD), fileUpload(fileValidation.image).single("image"), validation(updateBrandValidator), updateBrandModule)
  .delete(auth(endpoints.brandCRUD), validation(deleteBrandValidator), deleteBrandModule)
  .get(validation(getSpecificBrandValidator), getSpecificBrandModule);

export default router;
