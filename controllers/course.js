const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
const { cloudinaryUpload } = require("../utils/imageUploader");
require("dotenv").config();

exports.createCourse = async (request, response) => {
  try {
    const { courseName, courseDescription, whatWillYouLearn, price, tag } =
      request.body;

    const thumbnail = request.files.thumbnail;

    if (
      !courseName ||
      !courseDescription ||
      !whatWillYouLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return response.status(400).json({
        success: false,
        message: "Missing input field",
      });
    }

    const userId = request.user.id;
    const instructor = await User.findById({ userId });

    if (!instructor) {
      return response.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    const tagDetails = await Tag.findById({ tag });

    if (!tagDetails) {
      return response.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    // thumbnail upload

    const thumbnailDetails = await cloudinaryUpload(
      thumbnail,
      process.env.FOLDER_NAME,
      50,
      50
    ); // returns a secret url

    //creat a entry

    const courseDetails = await Course.create({
      courseName: courseName,
      courseDescription: courseDescription,
      whatWillYouLearn: whatWillYouLearn,
      price: price,
      instructor: instructor._id,
      thumbnail: thumbnailDetails.secure_url,
      tag: tagDetails._id,
    });

    // update the user
    const updatedUser = await User.findByIdAndUpdate(
      { _id: instructor._id },
      { $push: { courses: courseDetails._id } },
      { new: true }
    );

    // update the tag
    const updatedTag = await Tag.findByIdAndUpdate(
      { id: tagDetails._id },
      { $push: { courses: courseDetails._id } },
      { new: true }
    );

    // response
    response.status(200).json({
      success: true,
      message: "Course Added",
      courseDetails,
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: "Internal server error, try again",
    });
  }
};

exports.getAllCourses = async (request, response) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReview: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    response.status(200).json({
      success: true,
      message: "All courses fetched",
      courses: allCourses,
    });
  } catch (err) {
    response.status(500).json({
      success: false,
      message: "Internal Server error, Try again",
      error: err.message,
    });
  }
};
