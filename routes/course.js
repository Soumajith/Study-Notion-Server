const express = require("express");
const router = express.Router();

// Import
const {
  createCourse,
  getAllCourses,
  getCourseDetail,
  getInstructorCourses,
  editCourse,
  deleteCourse,
  getFullCourseContent,
} = require("../controllers/course");

// queries
router.post("/createCourse", createCourse);
router.get("/getAllCourse", getAllCourses);
router.get("/getCourseDetail", getCourseDetail);
router.get("/getInstructorCourses", getInstructorCourses);
router.get("/getFullCourseContent", getFullCourseContent);
router.put("/editCourse", editCourse);
router.delete("/deleteCourse", deleteCourse);

module.exports = router;
