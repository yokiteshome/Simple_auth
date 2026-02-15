const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const { generateTokenandSetCookie } = require("../utils/generatetoken.js");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/mailer.js");

const checkInitStatus = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    return res.status(200).json({ hasUsers: userCount > 0 });
  } catch (err) {
    console.error("Status check error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const register = async (req, res) => {
  try {
    const { username, firstname, middlename, lastname, password, email } =
      req.body;
    const exisitngUser = await User.findOne({ $or: [{ email }, { username }] });
    if (exisitngUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    //if the user is new,backend prepares the password for storage by hashing it,
    //the real password is destroyed and replaced with a secure hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      firstname,
      middlename,
      lastname,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    //create an auth token for the new user and attach it to an httpOnly cookie in the response
    await generateTokenandSetCookie(res, newUser);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const userexists = await User.findOne({ $or: [{ email }, { username }] });
    //Compares the entered password with the stored hashed password safely.
    //password is the entered password and userexists?.password is the stored hashed password or null if user does not exist
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userexists?.password || "",
      //userexists?.password tells JavaScript: "Only try to read .password if userexists is not null."
    );

    if (!userexists || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    //If authentication is successful, generate a token and set it in an httpOnly cookie
    generateTokenandSetCookie(res, userexists);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: userexists._id,
        email: userexists.email,
        username: userexists.username,
        role: userexists.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const changePassword = async (req, res) => {
  try {
    const { newPassword, password } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    const currentPasswordMatch = await bcrypt.compare(
      password,
      user?.password || "",
    );
    if (!currentPasswordMatch) {
      return res.status(400).json({ message: "Password Incorrect" });
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      user?.password || "",
    );
    if (samePassword) {
      return res
        .status(400)
        .json({ message: "You can't use the same password as the same one" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
    });
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
const getAuthUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      id !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "moderator"
    ) {
      return res.status(403).json({ message: "Unauthorized User" });
    }
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "User does not exist" });
    }
    console.error("Get error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "moderator") {
      return res.status(403).json({ message: "Unauthorized User" });
    }

    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(users);
  } catch (err) {
    console.error("Get error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (
      id !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "moderator"
    ) {
      return res.status(403).json({ message: "Unauthorized User" });
    }
    const usertoDelete = await User.findByIdAndDelete(id);
    if (!usertoDelete) {
      return res.status(404).json({ message: "User not found" });
    }
    if (id === req.user._id.toString()) {
      res.cookie("jwt", "", {
        maxAge: 0,
        httpOnly: true,
      });
    }
    return res.status(200).json({ message: "User successfully deleted" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "User does not exist" });
    }
    console.error("deletion error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Request" });
    }
    const token = jwt.sign(
      { id: user._id, type: "resetPasswordToken" },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );
    user.resetPasswordToken = token; //
    await user.save();
    await sendEmail(
      email,
      "reset password",
      "Here is your reset link:\n" +
        `${process.env.PUBLIC_ADDRESS}/reset-password?token=` +
        token,
    );
    return res.status(200).json({ message: "reset link sent successfully" });
  } catch (err) {
    console.error("Get error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
const confirmResetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    if (!decoded) {
      return res.status(400).json({ message: "Unauthorized User" });
    }

    if (decoded.type !== "resetPasswordToken") {
      return res.status(400).json({ message: "Invalid token" });
    }
    const user = await User.findById(decoded.id);
    if (token !== user.resetPasswordToken) {
      return res.status(400).json({ message: "Token expired" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    await user.save();
    return res.status(200).json({ message: "password reset successfully" });
  } catch (err) {
    console.error("Get error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  changePassword,
  logout,
  getAuthUserById,
  getAllUsers,
  deleteUserById,
  resetPassword,
  confirmResetPassword,
  checkInitStatus,
};
