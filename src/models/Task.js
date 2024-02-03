import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import SubTask from "./Subtask.js";
import { calculatePriority } from "../util/calculatePriority.js";

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  due_date: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    default: "TODO",
  },
  priority: {
    type: Number,
    min: 0,
    max: 3,
    default: 0,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
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
  subTasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "subtask",
    },
  ],
});

taskSchema.plugin(mongoosePaginate);

//todo update the priority based on due_date field in taskschema

taskSchema.pre("save", function (next) {
  //calculate the priority based on due date
  this.priority = calculatePriority(this.due_date);
  this.updated_at = new Date();
  next();
});

//if one main task is deleted then other subtasks will be marked as deleted
taskSchema.post("findOneAndUpdate", async function (task) {
  if (!task.isDeleted) {
    return;
  }
  if (task.subTasks.length > 0) {
    await SubTask.updateMany(
      { _id: { $in: task.subTasks } },
      { isDeleted: true, deleted_at: new Date() }
    );
  }
});

const Task = new model("task", taskSchema);

export default Task;

// let priority;
//   // set priority 0 if duedate is today
//   if (this.due_date <= curDate) {
//     priority = 0;
//     // set priority 1 if date is between tomorrow and day after tomorrow
//   } else if (
//     this.due_date <= new Date(curDate.getDate() + 2)
//   ) {
//     priority = 1;
//     // set priority 2 if date is between three and four days after
//   } else if (
//     this.due_date <= new Date(curDate.getDate() + 4 )
//   ) {
//     priority = 2;
//     // set priority 3 if date is five days after
//   } else if (
//     this.due_date <= new Date(curDate.getDate() + 5 )
//   ) {
//     priority = 3;
//   } else {
//     priority = 5;
//   }
//   return priority;
