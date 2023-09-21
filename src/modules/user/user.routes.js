import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { addToFavorites, confirmEmailModule, getUserFavorites, loginModule, resetPasswordModule, sendCodeModule, signupModule } from "./controller/user.js";
import { validation } from "../../middleware/validation.js";
import { addToFavoritesValidator, confirmEmailValidator, loginValidator, resetPasswordValidator, sendCodeValidator, signupValidator } from "./user.validation.js";
import auth from "../../middleware/auth.js";
import { endpoints } from "./user.endPoint.js";


const router = Router();

router.post('/signup', fileUpload(fileValidation.image).single('image'), validation(signupValidator), signupModule);
router.post('/login', validation(loginValidator), loginModule);
router.post('/sendCode', validation(sendCodeValidator), sendCodeModule);
router.post('/resetPassword', validation(resetPasswordValidator), resetPasswordModule);
router.patch('/confirmEmail', validation(confirmEmailValidator), confirmEmailModule);
router.post('/addToFavorites', auth(endpoints.user), validation(addToFavoritesValidator), addToFavorites);
router.get('/getUserFavorites', auth(endpoints.user), getUserFavorites);


export default router;