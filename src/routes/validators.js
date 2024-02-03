import { body, param, query } from "express-validator";
import User from "../models/User.js";
import { dateExtracter } from "../util/dateExtracter.js";
import { ExpressError } from "../util/expressError.js";

export const requirePhoneNumber = body("phone_number")
  .trim()
  .isMobilePhone("en-IN")
  .toInt()
  .withMessage("Phone Number must be valid");

export const requirePassword = body("password")
  .trim()
  .isLength({ min: 8, max: 20 })
  .not()
  .contains(" ")
  .withMessage(
    "Must be between 8 and 20 characters long and not contains spaces"
  );

export const requirePhoneNumberNotExists = body("phone_number")
  .trim()
  .isMobilePhone("en-IN")
  .withMessage("not a valid number")
  .toInt()
  .custom(async (phone_number) => {
    const existinguser = await User.findOne({ phoneNumber: phone_number });
    if (existinguser) {
      throw new ExpressError("User already exists", 422);
    }
  });

export const requireTitle = body("title")
  .trim()
  .isLength({ min: 5, max: 50 })
  .withMessage("title must contains atleast 5 characters long");

export const requireDesc = body("description")
  .trim()
  .isLength({ min: 5 })
  .withMessage("description must contains 5 characters long");

//took date input as a string becoz we don't have any client side interface like Js here we uses PostMan for client side
//sample date format : 05/11/2018 or 05-11-2018 dd/mm/yyyy
export const requireDueDate = body("due_date")
  .trim()
  .notEmpty()
  .withMessage("can't be empty")
  .isLength({ min: 9, max: 10 })
  .isDate({ format: "DD/MM/YYYY" })
  .withMessage("date must be in dd/mm/yyyy")
  .customSanitizer(dateExtracter);

export const requiresubTaskStatus = body("status")
  .trim()
  .toInt()
  .isInt({ min: 0, max: 1 })
  .withMessage("must be 0 or 1");

export const optionalFilterPriority = query("priority")
  .optional()
  .toInt()
  .isInt({ min: 0, max: 3 })
  .withMessage("priority value must be between 0 to 5");

export const optionalFilterDueDate = query("due_date")
  .optional()
  .isDate({ format: "DD/MM/YYYY" })
  .withMessage("date must be in dd/mm/yyyy")
  .customSanitizer(dateExtracter);

export const updateBodyStatus = body("status")
  .trim()
  .isString()
  .isIn(["TODO", "DONE"])
  .withMessage("Invalid status value it only accepts 'TODO' or 'DONE'");

export const validMongoTaskParam = param("taskID")
  .isMongoId()
  .withMessage("Must be valid Mongo ID");

export const validMongoSubTaskParam = param("subtaskID")
  .isMongoId()
  .withMessage("Must be valid Mongo ID");

export const requireSubtaskStatus = body("status")
  .trim()
  .toInt()
  .isInt({ min: 0, max: 1 })
  .withMessage("status Value must be 0 or 1");

export const validMongoTaskIDBody = body("taskID")
  .isMongoId()
  .withMessage("Must be valid Mongo ID");

export const requireUserPriority = body("priority")
  .trim()
  .toInt()
  .isInt({ min: 0, max: 2 })
  .withMessage("User priority must be valid");
