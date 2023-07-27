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

router.put("/:userId/editProfile", editProfile);
router.get("/:userId/getProfileDetails", getProfileDetails);
router.delete("/:userId/deleteAccount", deleteAccount);
router.put("/:userId/updateProfilePicture", updateProfilePicture);
router.get("/:userId/instructorDashboard", instructorDashboard);

module.exports = router;
