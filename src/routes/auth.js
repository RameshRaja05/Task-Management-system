import { Router } from "express";
import { validateError } from "../middleware.js";
import {
  requirePassword,
  requirePhoneNumber,
  requirePhoneNumberNotExists,
  requireUserPriority,
} from "./validators.js";
import { login, register } from "../controllers/auth.js";
import { catchAsync } from "../util/catchAsync.js";

const router = Router();

router.post(
  "/login",
  [requirePhoneNumber, requirePassword],
  validateError,
  catchAsync(login)
);

router.post(
  "/register",
  [requirePhoneNumberNotExists, requirePassword, requireUserPriority],
  validateError,
  catchAsync(register)
);

export default router;
