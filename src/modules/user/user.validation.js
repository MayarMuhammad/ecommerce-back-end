import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signupValidator = {
  body: joi.object().required().keys({
    name: generalFields.name.required(),
    email: generalFields.email,
    password: generalFields.password.required(),
    confirmPassword: generalFields.cPassword,
    phone: joi.string().pattern(new RegExp(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/)).required(),
    DOB: joi.date().iso().max('now').required()
  }),
  file: generalFields.file,
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const confirmEmailValidator = {
  body: joi.object().required().keys({
    email: generalFields.email,
    code: joi.string().length(6).required()
  }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const loginValidator = {
  body: joi.object().required().keys({
    email: generalFields.email,
    password: generalFields.password.required(),
  }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const sendCodeValidator = {
  body: joi.object().required().keys({
    email: generalFields.email,
  }),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};

export const resetPasswordValidator = {
  body: joi.object().required().keys({
    email: generalFields.email,
    password: generalFields.password.required(),
    confirmPassword: generalFields.cPassword,
  }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const addToFavoritesValidator = {
  body: joi.object().required().keys({
    productID: generalFields.id.required(),
  }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};
