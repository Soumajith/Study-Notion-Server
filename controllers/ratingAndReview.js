const RatingAndReviw = require("../models/RatingAndReview");

exports.createRatingAndReview = async (request, review) => {
  try {
    const { userId, rating, review } = request.body;
  } catch (err) {}
};
