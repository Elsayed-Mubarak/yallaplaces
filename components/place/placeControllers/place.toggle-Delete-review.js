const mongoose = require('mongoose');
const Review = require('../review.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('toggleDeleteReview');

async function toggleDeleteReview (req, res, next) {
  try {
    const { reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      logger.error('Invalid place');
      return res.status(400).send({ message: 'Invalid place' });
    }

    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
      logger.error('Review not found');
      return res.status(400).send({ message: 'Review not found' });
    }
    review.deleted = !review.deleted;
    await review.save();
    logger.info('toggleDeleteReview Successfully', { req });
    return res.status(200).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = toggleDeleteReview;