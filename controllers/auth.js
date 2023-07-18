const User = require("../models/User");
const OTP = require("../models/otp");
const Profile = require("../models/Profile");
const otpGenerate = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

// send OTP
exports.sendOTP = async (request, response) => {
  try {
    const { email } = request.body;
    const checkAccount = await User.find({ email });
    if (checkAccount) {
      return response.status(401).json({
        success: false,
        message: "Account already exist",
      });
    }

    var otp = otpGenerate.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const otpBody = await OTP.create({
      email,
      otp,
    });

    console.log(otpBody);

    return response.status(200).json({
      success: true,
      message: "OTP successfully sent",
      otp,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//sign up
exports.signUp = async (request, response) => {
  try {
    //fetch
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      accountType,
      password,
      confirmPassword,
      otp,
    } = request.body;

    // validate
    if (
      !firstName ||
      !lastName ||
      !email ||
      !contactNumber ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return response.status(403).json({
        success: false,
        message: "Fill out all the details",
      });
    }

    // password check
    if (password === confirmPassword) {
      return response.status(401).json({
        success: false,
        message: "Password did not match",
      });
    }

    //  check account
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(401).json({
        success: false,
        message: "Account already exist",
      });
    }

    // find OTP
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOtp.length === 0) {
      return response.status(404).json({
        success: false,
        message: "OTP not found",
      });
    }

    // OTP check
    if (recentOtp !== otp) {
      return response.status(400).json({
        success: false,
        message: "OTP did not match",
      });
    }

    // create hashpassword
    const hashedPassword = await bcrypt.hash(password, 10);

    // create Profile
    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      contactNumber: contactNumber,
      about: null,
    });

    // create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      additionalDetails: profile._id,
      accountType,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    response.status(200).json({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

//login
exports.login = async (request, response) => {
  try {
    // fetch
    const { email, password } = request.body;
    // validation
    if (!email || !password) {
      return response.status(403).json({
        success: false,
        message: "Fill out credentials",
      });
    }
    //find
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //password match and token
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.toObject();
      user.token = token;
      user.password = undefined;

      //cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 100),
        httpOnly: true,
      };
      response.cookie("token", token, options).status(200).json({
        success: true,
        user,
        token,
        message: "User Logged in",
      });
    } else {
      return response.status(401).json({
        success: false,
        message: "Password incorrect",
      });
    }
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// change password
exports.changePassword = async (request, response) => {
  try {
    //fetch
    const { oldpassword, newPassword, confirmNewPassword } = request.body;

    // validation
    if (newPassword != confirmNewPassword) {
      return response.status(401).json({
        success: false,
        message: "Password did not match",
      });
    }

    // update in DB

    // send mail - password updated

    // return response
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: "Something went wrong! Try again",
    });
  }
};
