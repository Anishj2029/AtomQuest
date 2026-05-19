import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";

/**
 * Reads express-validator results and throws a 422 AppError if any fail.
 * Place after validation chain in route definition.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(", ");
    return next(new AppError(message, 422));
  }
  next();
};

export default validate;
