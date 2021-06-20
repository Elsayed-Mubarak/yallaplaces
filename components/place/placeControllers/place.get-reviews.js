const mongoose = require('mongoose');
const Place = require('../place.model');
const Review = require('../review.model');
const { getReviews: getReviewsValidationSchema } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getReviews');

async function getReviews (req, res, next) {
  try {
    let filter = {};
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      logger.error('Invalid place');
      return res.status(400).send({ message: 'Invalid place' });
    }

    const { error, value } = getReviewsValidationSchema.validate(req.query, { stripUnknown: true });
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).send({ message: error.message.replace(/"/g, '') });
    }

    const queryLimitNo = Number.parseInt(value.limitNo);
    const querySkipNo = Number.parseInt(value.pageNo) * queryLimitNo;

    const place = await Place.findOne({ _id: placeId });
    if (!place) {
      logger.error('Invalid place');
      return res.status(400).send({ message: 'Invalid place' });
    }

    const userReview = await Review.findOne({ userId: req.userData._id, placeId }, '-__v')
      .populate('userId', '-_id firstName lastName profileImage');
    const otherReviews = await Review.find({ userId: { $ne: req.userData._id }, placeId }, '-__v')
      .sort({ updatedAt: 'desc' })
      .skip(querySkipNo)
      .limit(queryLimitNo)
      .populate('userId', 'firstName lastName profileImage')
      .lean();

    if (req.userData.role === 'user') filter = { deleted: false };

    const otherReviewsCount = await Review.find({ userId: { $ne: req.userData._id }, placeId, ...filter }).countDocuments();
    logger.info('getReviews Successfully', { req });
    return res.status(200).send({ userReview, otherReviews, otherReviewsCount });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = getReviews;