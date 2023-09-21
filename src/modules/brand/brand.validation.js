import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addBrandValidator = {
  body: joi.object().required().keys({
    name: generalFields.name.required(),
  }),
  file: generalFields.file.required(),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const updateBrandValidator = {
  body: joi.object().required().min(1).keys({
    name: generalFields.name,
  }),
  file: generalFields.file,
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};

export const deleteBrandValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};

export const getSpecificBrandValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};

export const searchBrandValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({
    keyword: generalFields.name,
  }),
};
