import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

const arrayParsing = (value, helper) => {
  value = JSON.parse(value);
  const valueSchema = joi.object({
    value: joi.array().items(joi.string().alphanum())
  });
  const validationResult = valueSchema.validate({ value }, { abortEarly: false });
  if (validationResult.error) {
    return helper.message({ error: validationResult.error.details });
  }
  else {
    return true;
  }
}

export const addProductValidator = {
  body: joi.object().required().keys({
    name: generalFields.name.min(10).required(),
    description: generalFields.name.min(20).required(),
    price: joi.number().min(0).positive().required(),
    discount: joi.number().min(0).max(100).positive(),
    quantity: joi.number().min(0).positive().integer(),
    colors: joi.custom(arrayParsing),
    sizes: joi.custom(arrayParsing),
    category: generalFields.id.required(),
    subCategory: generalFields.id.required(),
    brand: generalFields.id.required(),
  }),
  files: joi.object().required().keys({
    imgCover: joi.array().items(generalFields.file).length(1).required(),
    images: joi.array().items(generalFields.file).max(10)
  }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const getSpecificProductValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};
