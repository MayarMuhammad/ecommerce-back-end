import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { StatusCodes } from "http-status-codes";
import userModel from './../../Database/models/User.model.js';


export const roles = { admin: 'admin', user: "user" };
Object.freeze(roles);

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization?.startsWith(process.env.TOKEN_BEARER)) {
        return next(new AppError("Authorization header is required or Invalid bearer key", StatusCodes.BAD_REQUEST));
      }
      const token = authorization.split(process.env.TOKEN_BEARER)[1]
      if (!token) {
        return next(new AppError("Token is required", StatusCodes.BAD_REQUEST));
      }
      const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
      if (!decoded?.id) {
        return next(new AppError("Invalid token payload", StatusCodes.BAD_REQUEST));
      }
      const authUser = await userModel.findById(decoded.id);
      if (!authUser) {
        next(new AppError("Not a registered account", StatusCodes.UNAUTHORIZED));
      }
      if (!authUser.isVerified) {
        next(new AppError("Confirm your email first", StatusCodes.UNAUTHORIZED));
      }
      if (!roles.includes(authUser.role)) {
        next(new AppError("Not authorized to access endpoint", StatusCodes.UNAUTHORIZED));
      }
      req.user = authUser;
      return next()
    } catch (error) {
      next(new AppError(error?.message, StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
}

export default auth