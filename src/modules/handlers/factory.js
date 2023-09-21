import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import { asyncHandler } from "../../utils/errorHandling.js";
import { AppError } from "../../utils/AppError.js";
import { ApiFeatures } from "../../utils/AppFeatures.js";
import cloudinary from "../../utils/cloudinary.js";

export const addOne = (model, moduleName) => {
  return asyncHandler(async (req, res, next) => {
    let { name } = req.body;
    const checkDocument = await model.findOne({ name });
    if (checkDocument) {
      return next(
        new AppError(`${moduleName} already exists`, StatusCodes.CONFLICT)
      );
    }
    const slug = slugify(name);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${moduleName}` }
    );
    if (moduleName === "category") {
      req.body = { name, slug, image: { secure_url, public_id } };
    }
    if (moduleName === "SubCategory") {
      req.body = { name, slug, category: req.body.category };
    }
    const document = await model.create(req.body);
    let response = {};
    response[moduleName] = document;
    return res
      .status(StatusCodes.CREATED)
      .json({ message: `${moduleName} added`, ...response });
  });
};

export const deleteOne = (modelOne, moduleName) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await modelOne.findByIdAndDelete(id);
    if (!document) {
      return next(
        new AppError(`${moduleName} not found`, StatusCodes.NOT_FOUND)
      );
    }
    await cloudinary.uploader.destroy(document.image.public_id);
    let response = {};
    response[moduleName] = document;
    return res
      .status(StatusCodes.OK)
      .json({ message: `${moduleName} deleted`, ...response });
    // !document && res.status(StatusCodes.NOT_FOUND).json({ message: `${moduleName} not found` });
    // document && res.status(StatusCodes.OK).json({ message: `${moduleName} deleted`, document });
  });
};

export const updateOne = (model, moduleName) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const checkDocument = await model.findById(id);
    if (!checkDocument) {
      return next(
        new AppError(`${moduleName} not found`, StatusCodes.NOT_FOUND)
      );
    }
    if (req.body.name) {
      if (checkDocument.name == req.body.name) {
        return next(
          new AppError(
            `New ${moduleName} name must be different from old ${moduleName} name`,
            StatusCodes.CONFLICT
          )
        );
      }
      const checkDuplicate = await model.findOne({
        $and: [{ name: req.body.name }, { _id: { $ne: id } }],
      });
      if (checkDuplicate) {
        return next(new AppError("Duplicate Entry", StatusCodes.CONFLICT));
      }
      req.body.slug = slugify(req.body.name);
    }
    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `${moduleName}` }
      );
      await cloudinary.uploader.destroy(checkDocument.image.public_id);
      req.body.image = { secure_url, public_id };
    }
    // if (req.file.fieldname == 'image') {
    //   req.body.image = req.file.filename;
    // }
    // if (req.file.fieldname == 'logo') {
    //   req.body.logo = req.file.filename;
    // }
    // if (req.file.fieldname == 'imgCover') {
    //   req.body.imgCover = req.file.filename;
    // }
    const document = await model.updateOne({ _id: id }, req.body, {
      new: true,
    });
    let response = {};
    response[moduleName] = document;
    return res
      .status(StatusCodes.OK)
      .json({ message: `${moduleName} updated`, ...response });
  });
};

export const getAll = (model, moduleName) => {
  return asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.params.id) {
      filter = { category: req.params.id };
    }
    let apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .fields()
      .filter()
      .paginate()
      .search()
      .sort();
    let document = await apiFeatures.query;
    let response = {};
    response[moduleName] = document;
    return res
      .status(StatusCodes.OK)
      .json({
        page: apiFeatures.PAGE_NUMBER,
        message: `${moduleName}:`,
        ...response,
      });
  });
};

export const getProductByID = (model, moduleName) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findOne({ _id: id });
    if (!document) {
      return next(
        new AppError(`${moduleName} not found`, StatusCodes.NOT_FOUND)
      );
    }
    let response = {};
    response[moduleName] = document;
    return res
      .status(StatusCodes.OK)
      .json({ message: `${moduleName}:`, ...response });
  });
};
