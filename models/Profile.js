const mongoose = require("mongoose");

const Profile = new mongoose.Schema({
  gender: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("profile", Profile);
