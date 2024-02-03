import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: String,
  priority: {
    type: Number,
    min: 0,
    max: 2,
  },
});

userSchema.index({ phoneNumber: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const passwordHash = await bcrypt.hash(this.password, 10);
  this.password = passwordHash;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

const User = new model("user", userSchema);

export default User;
