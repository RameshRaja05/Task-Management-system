import { validationResult } from "express-validator";
import { ExpressError } from "./util/expressError.js";
import jwt from "jsonwebtoken";
import Task from "./models/Task.js";
import Subtask from "./models/Subtask.js";

export const validateError = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return next(new ExpressError(err.errors[0].msg, 422));
  }
  next();
};

export const requireAuth = async (req, res, next) => {
  const Bearertoken = req.header("Authorization");
  if (!(Bearertoken && Bearertoken.startsWith("Bearer "))) {
    throw new ExpressError("Access denied", 403);
  }
  const token = Bearertoken.slice(7);
  const verified = jwt.verify(token, process.env.SECRET_KEY);
  req.user = verified;
  next();
};

export const isOwner = async (req, res, next) => {
  const { taskID } = req.params;
  const task = await Task.findById(taskID);
  if (!task.owner.equals(req.user.id)) {
    throw new ExpressError("Permission Denied", 403);
  }
  next();
};

export const isOwnerOfSubtask=async(req,res,next)=>{
  const {subtaskID} =req.params;
  const subtask=await Subtask.findById(subtaskID);
  if(!subtask){
    throw new ExpressError("task not found");
  }
  const mainTask=await Task.findById(subtask.task_id);
  if(!mainTask.owner.equals(req.user.id)){
    throw new ExpressError("Permission Denied",403)
  }
  next();
}