import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addSubCategoryValidator = {
  body: joi.object().required().keys({
    name: generalFields.name.required(),
    category: generalFields.id.required(),
  }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const updateSubCategoryValidator = {
  body: joi.object().required().min(1).keys({
    name: generalFields.name,
    category: generalFields.id
  }),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};

export const deleteSubCategoryValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};

export const getSpecificCategoryValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};

export const searchSubCategoryValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({
    keyword: generalFields.name,
  }),
};
