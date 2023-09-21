import joi from 'joi';


export const addCouponValidator = {
  body: joi.object().required().keys({
    numberOfUses: joi.number().integer().positive().min(0),
    code: joi.string().required(),
    amount: joi.number().min(0).max(100).positive(),
    expiresIn: joi.date().iso().greater(Date.now()).required()
  }),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};