const express = require("express");
const router = express.Router();

// Import
const {
  editProfile,
  getProfileDetails,
  deleteAccount,
  updateProfilePicture,
  instructorDashboard,
} = require("../controllers/profile");

// queries
router.put("/editProfile", editProfile);
router.get("/getProfileDetails", getProfileDetails);
router.delete("/deleteAccount", deleteAccount);
router.put("/updateProfilePicture", updateProfilePicture);
router.get("/instructorDashboard", instructorDashboard);

module.exports = router;
