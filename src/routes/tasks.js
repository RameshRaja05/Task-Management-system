import { Router } from "express";
import {
  requireTitle,
  requireDesc,
  requireDueDate,
  optionalFilterDueDate,
  optionalFilterPriority,
  updateBodyStatus,
  validMongoTaskParam,
} from "./validators.js";
import { validateError, requireAuth, isOwner } from "../middleware.js";
import { catchAsync } from "../util/catchAsync.js";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} from "../controllers/tasks.js";

const router = Router();

router.use(catchAsync(requireAuth));

router.post(
  "/create",
  [requireTitle, requireDesc, requireDueDate],
  validateError,
  catchAsync(createTask)
);

router.get(
  "/",
  [optionalFilterDueDate, optionalFilterPriority],
  validateError,
  catchAsync(getTasks)
);

router.delete(
  "/:taskID",
  validMongoTaskParam,
  validateError,
  catchAsync(isOwner),
  catchAsync(deleteTask)
);

router.patch(
  "/:taskID",
  [requireDueDate, updateBodyStatus, validMongoTaskParam],
  validateError,
  catchAsync(isOwner),
  catchAsync(updateTask)
);

export default router;
