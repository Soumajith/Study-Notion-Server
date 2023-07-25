const express = require("express");
const router = express.Router();

// Import
const {
  sendOtp,
  signUp,
  login,
  changePassword,
} = require("../controllers/auth");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword");

// queries
router.post("/sendOTP", sendOtp);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/changePassword", changePassword);
router.post("/resetPasswordToken", resetPasswordToken);
router.post("/resetPassword", resetPassword);

module.exports = router;
