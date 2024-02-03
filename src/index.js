import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import taskRouter from "./routes/tasks.js";
import subtaskRouter from "./routes/subtasks.js";
import { ExpressError } from "./util/expressError.js";
import cron from "node-cron";
import updateTaskPriorities from "./jobs/updateTaskPriority.js";
import callMakingJob from "./jobs/callMakingjob.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const DB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/subtasks", subtaskRouter);

app.get("/", async (req, res, next) => {
  res.json("hello there").status(200);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("not found", 404));
});

//custom error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no something went wrong";
  return res.status(statusCode).json({ message: err.message });
});

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("DB is connected");
    app.listen(PORT, () => {
      console.log(`App listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

cron.schedule("0 0 * * *", async () => {
  console.log("jobs are starting now");
  //update the task priorities
  await updateTaskPriorities();
  await callMakingJob();
  console.log("Jobs are ended");
});
