const express = require("express");
const router = express.Router(); //to handle route definitions

const {
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
} = require("../controllers/auth.controller.js"); //becuase we make routes off of these functions in this file
const { authMiddleware } = require("../middlewares/auth.middleware.js"); //to protect routes that require authentication
router.get("/status", checkInitStatus);
router.post("/register", register);
router.post("/login", login);
router.patch("/change-password", authMiddleware, changePassword);
router.post("/logout", logout);
router.get("/:id", authMiddleware, getAuthUserById);
router.get("/", authMiddleware, getAllUsers);
router.delete("/:id", authMiddleware, deleteUserById);
router.post("/reset-password", resetPassword);
router.patch("/reset-password", confirmResetPassword);
module.exports = router;
