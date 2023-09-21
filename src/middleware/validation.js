import joi from "joi";
import { Types } from "mongoose";
import { StatusCodes } from "http-status-codes";

const dataMethods = ["body", "params", "query", "headers", "file"];

const validateObjectId = (value, helper) => {
  // console.log({ value });
  // console.log(helper);
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("In-valid objectId");
};
export const generalFields = {
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: joi.string(),
  cPassword: joi.string().valid(joi.ref("password")).required(),
  id: joi.string().custom(validateObjectId),
  name: joi.string(),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    // console.log({ body: req.body });
    const validationErr = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErr.push(validationResult.error.details);
        }
      }
    });

    if (validationErr.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Validation Error",
        error: validationErr,
      });
    }
    return next();
  };
};
