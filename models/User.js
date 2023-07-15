const mongoose = require("mongoose");

const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lasName: {
    type: String,
    requried: true,
    trim: true,
  },
  email: {
    type: String,
    requried: true,
  },
  password: {
    type: String,
    requried: true,
  },
  //   confirmPassword: {
  //     type: String,
  //     requried: true,
  //   },
  accountType: {
    type: String,
    enum: ["Admin", "Student", "Instructor"],
    required: true,
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      requried: true,
    },
  ],
  image: {
    type: String,
    required: true,
  },
  courseProgress: [
    {
      type: mongoose.Schema.types.ObjectId,
      ref: "courseProgress",
    },
  ],
});

module.exports = mongoose.model("user", User);
