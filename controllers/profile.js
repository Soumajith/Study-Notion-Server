const Profile = require("../models/Profile");
const User = require("../models/User");

exports.editProfile = async (request, response) => {
  try {
    const {
      dateOfBirth = "",
      about = "",
      gender,
      contactNumber,
    } = request.body;

    if (!gender || !contactNumber) {
      return response.status(400).json({
        success: false,
        message: "Empty fields",
      });
    }

    const userId = request.user.id;
    const userDetails = await User.findById(userId);

    const profileDetails = await Profile.findById(
      userDetails.additionalDetails
    );

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    response.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: "Internal Server error",
      error: err.message,
    });
  }
};

// delete account
exports.deleteAccount = async (request, response) => {
  try {
    // get id
    const userId = request.user.id;

    // validation
    if (!userId) {
      return response.status(400).json({
        success: false,
        message: "User id not found",
      });
    }

    //find user
    const userDetails = await User.findById({ _id: userId });
    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    // delete user
    await User.findByIdAndDelete({ _id: userId });
    // response
    response.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: "Internal Server error",
      error: err.message,
    });
  }
};
