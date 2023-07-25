const express = require("express");
const router = express.Router();

// Import
const {
  editProfile,
  getProfileDetails,
  deleteAccount,
} = require("../controllers/profile");

// queries
router.post("/editProfile", editProfile);
router.get("/getProfileDetails", getProfileDetails);
router.post("/deleteAccount", deleteAccount);

module.exports = router;
