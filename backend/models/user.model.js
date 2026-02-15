const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userSchema = new schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
      minlength: 2,
    },
    middlename: {
      type: String,
      required: false,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 2,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user", "moderator"],
    },
    resetPasswordToken: String,
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema); //defining a model named 'User' based on the userSchema
module.exports = User;
