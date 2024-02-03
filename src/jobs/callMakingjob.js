import twilio from "twilio";
import Task from "../models/Task.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const waitForCallStatus = async (callSid) => {
  return new Promise((resolve, reject) => {
    const checkStatus = setInterval(async () => {
      const call = await client.calls(callSid).fetch();
      if (call.status === "completed" || call.status === "failed") {
        clearInterval(checkStatus);
        resolve(call.status);
      }
    }, 5000); // Check every 5 seconds
  });
};

//implement the logic for calling user based on prioriy and if their tasks are overdue



//apologies for my curry buggy function 
// I can't find the better approach for this
const callMakingJob = async () => {
  const users = await User.find().sort({ status: 1 });
  for (let user of users) {
    const tasks = await Task.find({ owner: user._id });
    //check if tasks is overdue
    for (let task of tasks) {
      const curDate = new Date();
      const dayDiff = Math.floor(
        (task.due_date - curDate) / (24 * 60 * 60 * 1000)
      );
      if (dayDiff <= 0 && task.status != "DONE" && !task.isDeleted) {
        const call = await client.calls.create({
          url: "http://demo.twilio.com/docs/voice.xml",
          to: "91" + user.phoneNumber,
          from: process.env.TWILIO_FROM_NUMBER,
        });
        console.log(`Calling ${phoneNumber}. SID: ${call.sid}`);
        const callStatus = await waitForCallStatus(call.sid);
        console.log(
          `Call with SID ${call.sid} ended with status: ${callStatus}`
        );
        // If the call was answered, stop making calls
        if (callStatus === "completed") {
          return;
        }
      }
    }
  }
};

export default callMakingJob;
