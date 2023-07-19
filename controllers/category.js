const Category = require("../models/Category");

// create tag
exports.createCategory = async (request, response) => {
  try {
    const { name, description } = request.body;
    if (!name || !description) {
      return response.status(400).json({
        success: false,
        message: "Empty field",
      });
    }

    const CategoryDetails = await Category.create({
      name: name,
      description: description,
    });

    return response.status(200).json({
      success: true,
      message: "Category created successfully",
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
exports.getAllCategory = async (request, response) => {
  try {
    const categories = await Category.find(
      {},
      { name: true, description: true }
    );
    response.status(200).json({
      success: true,
      message: "Fetched all the Categories",
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
