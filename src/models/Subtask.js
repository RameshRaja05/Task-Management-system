import { Schema, model } from "mongoose";
import Task from "./Task.js";

const subtaskSchema = new Schema({
  task_id: {
    type: Schema.Types.ObjectId,
    ref: "task",
  },
  status: {
    type: Number,
    min: 0,
    max: 1,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deleted_at: {
    type: Date,
  },
});

subtaskSchema.post("findOneAndUpdate", async function (subtask) {
  if (!subtask.status) {
    return;
  }
  //assign task status value based on completed subtasks
  const task = await Task.findById(subtask.task_id);
  const completedSubTasks = await this.model.countDocuments({
    _id: { $in: task.subTasks },
    status: 1,
  });
  if (task.subTasks.length == completedSubTasks) {
    task.status = "DONE";
  } else if (completedSubTasks >= 1) {
    task.status = "IN_PROGRESS";
  }
  await task.save();
});

const Subtask = new model("subtask", subtaskSchema);

export default Subtask;
