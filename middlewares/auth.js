const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// Auth
exports.auth = async (request, response, next) => {
  try {
    const token =
      request.cookies?.token ||
      request.body?.token ||
      request.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return response.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.user = decoded;
    } catch (err) {
      return response.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    next();
  } catch (err) {
    console.error(err);
    return response.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// isStudent
exports.isStudent = async (request, response, next) => {
  try {
    if (request.user.accountType !== "Student") {
      return response.status(400).json({
        success: false,
        message: "This is a protected route for student only",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return response.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// isInstructor
exports.isInstructor = async (request, response, next) => {
  try {
    if (request.user.accountType !== "Instructor") {
      return response.status(400).json({
        success: false,
        message: "This is a protected route for instructor only",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return response.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// isAdmin
exports.isAdmin = async (request, response, next) => {
  try {
    if (request.user.accountType !== "Admin") {
      return response.status(400).json({
        success: false,
        message: "This is a protected route for admin only",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return response.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
