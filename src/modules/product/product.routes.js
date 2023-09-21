import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { addProductModule, getAllProductsModule, getSpecificProductModule } from './controller/product.js';
import { addProductValidator, getSpecificProductValidator } from "./product.validation.js";
import auth, { roles } from "../../middleware/auth.js";
import { endpoints } from './product.endPoint.js';


const router = Router();


router.route("/")
  .post(auth(endpoints.productCRUD), fileUpload(fileValidation.image).fields([{ name: 'imgCover', maxCount: 1 }, { name: 'images', maxCount: 10 }]),
    validation(addProductValidator), addProductModule)
  .get(getAllProductsModule);
router
  .route("/:id")
  .get(validation(getSpecificProductValidator), getSpecificProductModule);

export default router;
