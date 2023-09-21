import { generalFields } from './../../middleware/validation.js';
import joi from 'joi';


export const addToCartValidator = {
  body: joi.object().required().keys({
    quantity: joi.number().min(0).positive().integer(),
    productID: generalFields.id.required(),
  }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const removeFromCartValidator = {
  body: joi.object().required().keys({}),
  params: joi.object().required().keys({ id: generalFields.id.required() }),
  query: joi.object().required().keys({}),
};