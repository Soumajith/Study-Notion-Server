// packages
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
// reset password token

exports.resetPasswordToken = async (request, response) => {
  try {
    // fetch
    const { email } = request.body;

    // validaation
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(400).json({
        success: false,
        message: "Email not registered",
      });
    }

    // generate token
    const token = crypto.randomUUID();

    // update
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        expiresIn: Date.now() + 5 * 60 * 1000,
      },
      {
        new: true,
      }
    );

    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail
    mailSender(
      email,
      "Password reset link",
      `<p>Click here: <a href="${url}">${url}</a></p>`
    );

    // response
    response.status(200).json({
      success: true,
      message: "Reset password link sent",
    });
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// reset password
exports.resetPassword = async (request, response) => {
  try {
    // fetch
    // validate
    // get the userdetail using token
    // validate token
    // token time check
    // hash the password
    // update
    // response
  } catch (err) {}
};
