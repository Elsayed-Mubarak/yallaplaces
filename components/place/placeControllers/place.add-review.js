const mongoose = require('mongoose');
const Place = require('../place.model');
const Review = require('../review.model');
const { addReview: addReviewValidationSchema } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('addReview');

async function addReview (req, res, next) {
  try {
    const { placeId } = req.params;
    const { error, value } = addReviewValidationSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message.replace(/"/g, '') });
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      logger.error('Invalid place');
      return res.status(400).send({ message: 'Invalid place' });
    }

    const place = await Place.findOne({ _id: placeId });
    if (!place) {
      logger.error('Invalid place');
      return res.status(400).send({ message: 'Invalid place' });
    }

    let review = await Review.findOne({ userId: req.userData._id, placeId });
    if (review) {
      logger.error('Only one review is allowed');
      return res.status(409).send({ message: 'Only one review is allowed' });
    }

    // should be a transaction
    review = await Review.create({ userId: req.userData._id, placeId, ...value });
    place.totalRate += value.rate;
    place.reviewsCount++;
    place.rate = (place.reviewsCount !== 0) ? (place.totalRate / place.reviewsCount).toFixed(1) : 0;
    await place.save();
    logger.info('addReview Successfully', { req });
    return res.status(201).send({ review });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = addReview;