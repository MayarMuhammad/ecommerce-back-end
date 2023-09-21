import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addCategoryValidator = {
  body: joi.object().required().keys({
    name: generalFields.name.required(),
  }),
  file: generalFields.file.required(),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const updateCategoryValidator = {
  body: joi.object().required().min(1).keys({
    name: generalFields.name,
  }),
  file: generalFields.file,
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};

export const deleteCategoryValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};

export const getSpecificCategoryValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};

export const searchCategoryValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({
    keyword: generalFields.name,
  }),
};
