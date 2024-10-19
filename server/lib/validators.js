import { body, validationResult } from "express-validator";
import { ApiError } from "./apiError.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");

    return next(new ApiError(errorMessages, 400));
  }
  return next();
};

const registerValidator = () => [
  body("name").notEmpty().withMessage("name is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("gender").notEmpty().withMessage("gender is required"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),
];

const loginValidator = () => [
  body("username").notEmpty().withMessage("username is required"),
  body("password").notEmpty().withMessage("password is required"),
];

export { validateHandler, registerValidator, loginValidator };
