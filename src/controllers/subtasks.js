import Task from "../models/Task.js";
import Subtask from "../models/Subtask.js";
import { ExpressError } from "../util/expressError.js";

//helper functions
const extractSubtasks = async (tasks) => {
  const filteredSubtasksPromises = tasks
    .filter((userTask) => !userTask.isDeleted)
    .map((userTask) => userTask.populate("subTasks"));

  const subtasksArrays = await Promise.all(filteredSubtasksPromises);
  const flattenedSubtasks = subtasksArrays.flatMap(
    (subtasks) => subtasks.subTasks
  );
  return flattenedSubtasks;
};

export const createSubtask = async (req, res) => {
  const { taskID } = req.body;
  const task = await Task.findById(taskID);
  if (!task || task.isDeleted) {
    throw new ExpressError("Task not found", 404);
  }
  const subtask = new Subtask({ task_id: taskID });
  task.subTasks.push(subtask);
  await subtask.save();
  await task.save();
  res.status(201).json({ subtask });
};

export const getSubtasks = async (req, res) => {
  const { taskID } = req.query;
  if (taskID) {
    const filteredTasksByID = await Task.find({
      _id: taskID,
      owner: req.user.id,
    });
    const subtasks = await extractSubtasks(filteredTasksByID);

    return res.status(200).json({ subtasks });
  }
  const userTasks = await Task.find({ owner: req.user.id });

  const subtasks = await extractSubtasks(userTasks);
  return res.status(200).json({ subtasks });
};

export const updateSubTask = async (req, res) => {
  const { subtaskID } = req.params;
  const { status } = req.body;
  const subtask = await Subtask.findByIdAndUpdate(
    subtaskID,
    { status },
    { new: true }
  );
  res.status(200).json({ message: "subtask updated successfully", subtask });
};

export const deleteSubTask = async (req, res) => {
  const { subtaskID } = req.params;
  const subtask = await Subtask.findByIdAndUpdate(
    subtaskID,
    { isDeleted: true, deleted_at: new Date() },
    { new: true }
  );
  res.status(200).json({ message: "subtask deleted successfully", subtask });
};
