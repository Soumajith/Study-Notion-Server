const Tag = require("../models/Tag");

// create tag
exports.createTag = async (request, response) => {
  try {
    const { name, description } = request.body;
    if (!name || !description) {
      return response.status(400).json({
        success: false,
        message: "Empty field",
      });
    }

    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });

    return response.status(200).json({
      success: true,
      message: "Tag created successfully",
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

// get all tag
exports.getALlTags = async (request, response) => {
  try {
    const tags = await Tag.find({}, { name: true, description: true });
    response.status(200).json({
      success: true,
      message: "Fetched all the tags",
      data: tags,
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
