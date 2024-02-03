import Task from "../models/Task.js";
import { ExpressError } from "../util/expressError.js";

export const createTask = async (req, res) => {
  const { title, description, due_date } = req.body;
  const task = new Task({ title, description, due_date });
  task.owner = req.user.id;
  await task.save();
  res.status(201).json({ message: "task created successfully", task });
};

export const updateTask = async (req, res) => {
  const { taskID } = req.params;
  const { due_date, status } = req.body;
  const task = await Task.findById(taskID);
  if (!task) {
    throw new ExpressError("Task not found", 404);
  }
  if (task.isDeleted) {
    throw new ExpressError("Task already been deleted", 404);
  }
  if (due_date) {
    task.due_date = due_date;
  }
  if (status) {
    task.status = status;
  }
  await task.save();
  res.status(200).json(task);
};

export const deleteTask = async (req, res) => {
  const { taskID } = req.params;
  const task = await Task.findByIdAndUpdate(
    taskID,
    { isDeleted: true, deleted_at: new Date() },
    { new: true }
  );
  if (!task) {
    throw new ExpressError("Task not found", 404);
  }
  res.status(200).json({ message: "task deleted successfully", task });
};

export const getTasks = async (req, res) => {
  const { page, due_date, priority } = req.query;
  if (!(page || due_date || priority)) {
    const tasks = await Task.paginate({});
    return res.status(200).json({ tasks });
  }
  const query = {};
  if (due_date) {
    query.due_date = due_date;
  }
  if (priority) {
    query.priority = priority;
  }
  const Page = page || 1;
  const tasks = await Task.paginate(query, { Page });
  return res.status(200).json({ tasks });
};
