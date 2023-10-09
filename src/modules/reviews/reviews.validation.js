import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addReviewValidator = {
  body: joi.object().required().keys({
    comment: generalFields.name,
    product: generalFields.id.required(),
    rating: joi.number().integer().min(1).max(5).required()
  }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const updateReviewValidator = {
  body: joi.object().required().keys({
    comment: generalFields.name,
    rating: joi.number().integer().min(1).max(5)
  }),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};

export const deleteReviewValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};

export const getProductReviewValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};