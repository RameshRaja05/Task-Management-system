import { Router } from "express";
import { requireAuth } from "../middleware.js";
import {
  validMongoSubTaskParam,
  requireSubtaskStatus,
  validMongoTaskIDBody,
} from "./validators.js";
import { validateError,isOwnerOfSubtask } from "../middleware.js";
import {
  createSubtask,
  getSubtasks,
  updateSubTask,
  deleteSubTask,
} from "../controllers/subtasks.js";
import { catchAsync } from "../util/catchAsync.js";

const router = Router({ mergeParams: true });

router.use(catchAsync(requireAuth));

router.post(
  "/create",
  [validMongoTaskIDBody],
  validateError,
  catchAsync(createSubtask)
);

router.get("/", catchAsync(getSubtasks));

router.patch(
  "/:subtaskID",
  [validMongoSubTaskParam, requireSubtaskStatus],
  validateError,
  catchAsync(isOwnerOfSubtask),
  catchAsync(updateSubTask)
);

router.delete(
  "/:subtaskID",
  [validMongoSubTaskParam],
  validateError,
  catchAsync(isOwnerOfSubtask),
  catchAsync(deleteSubTask)
);

export default router;
