import jwt from "jsonwebtoken";
import { ExpressError } from "../util/expressError.js";
import User from "../models/User.js";

const createToken=(user)=>{
  return jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  }); 
}

export const login = async (req, res, next) => {
  const { phone_number, password } = req.body;
  const user = await User.findOne({ phoneNumber: phone_number });
  if (!user) {
    throw new ExpressError("Incorrect Phone number", 401);
  }
  const isMatch = await user.isValidPassword(password);
  if (!isMatch) {
    throw new ExpressError("Invalid password", 401);
  }
  const token = createToken(user);
  res.status(200).json({ message: "user login successful", token });
};

export const register = async (req, res, next) => {
  const { phone_number, password, priority } = req.body;
  const user = new User({ phoneNumber: phone_number, password, priority });
  await user.save();
  const token = createToken(user);
  res.status(201).send({ message: "User created successfully", token });
};
