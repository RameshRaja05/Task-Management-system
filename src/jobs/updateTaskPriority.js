import Task from "../models/Task.js";
import { calculatePriority } from "../util/calculatePriority.js";

const updateTaskPriorities = async () => {
  try {
    const tasks=await Task.find({});
    const updates = tasks.map(task => ({
      updateOne: {
        filter: { _id: task._id },
        update: { $set: { priority: calculatePriority(task.due_date) } }
      }
    }));
  
    await Task.bulkWrite(updates);
    console.log("Task priorities updated successfully.");
  } catch (error) {
    console.error("Error updating task priorities:", error);
  }
};

export default updateTaskPriorities;

// Update priority based on due date
// await Task.updateMany(
//   {
//     due_date: { $lte: currentDate }, // Due date is today or earlier
//   },
//   { $set: { priority: 0 } }
// );

// await Task.updateMany(
//   {
//     due_date: {
//       $gte: currentDate,
//       $lt: new Date(currentDate.getDate() + 2),
//     }, // Due date is tomorrow or the day after tomorrow
//   },
//   { $set: { priority: 1 } }
// );

// await Task.updateMany(
//   {
//     due_date: {
//       $gte: new Date(currentDate.getDate() + 3),
//       $lt: new Date(currentDate.getDate() + 5),
//     }, // Due date is 3-4 days from now
//   },
//   { $set: { priority: 2 } }
// );

// await Task.updateMany(
//   {
//     due_date: { $gte: new Date(currentDate.getDate() + 5) }, // Due date is 5+ days from now
//   },
//   { $set: { priority: 3 } }
// );