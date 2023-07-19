const { instance } = require("razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const { courseEnrollmentEmail } = require("../mail/courseEnrollment");
const mailSender = require("../utils/mailSender");

//capture the payment

exports.capturePayment = async (request, request) => {
  try {
    // get courseId and UserId
    // Validation
    // Validation of UserId
    // Validation of CourseId
    // Check if already paid
    // create order
    // return order
  } catch (err) {}
};
