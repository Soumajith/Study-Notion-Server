const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { cloudinaryUpload } = require("../utils/imageUploader");
require("dotenv").config();

// create
exports.createSubSection = async (request, response) => {
  try {
    // fetch
    const { title, description, duration } = request.body;
    const { sectionId } = request.params;
    const { video } = request.files.videoFile;

    // Upload
    const videoUploadDetails = await cloudinaryUpload(
      video,
      process.env.VIDEO_FILE_UPLOAD
    );

    // create
    const createdSubSection = await SubSection.create({
      title: title,
      description: description,
      duration: duration,
      videoUrl: videoUploadDetails.secure_url,
    });

    // update section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: createdSubSection._id } },
      { new: true }
    )
      .populate("subSection")
      .exec();

    // response
    response.status(200).json({
      success: true,
      message: "Subsection Created",
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

// update
exports.editSubSection = async (request, response) => {
  try {
    const { subSectionId, title, description } = request.body;
    const { sectionId } = request.params;
  } catch (err) {}
};
// delete
