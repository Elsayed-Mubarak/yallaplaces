const mongoose = require('mongoose');
const Place = require('../place.model');
const Branch = require('../branch.model');
const { getReviews: getReviewsValidationSchema } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getBranches');

async function getBranches (req, res, next) {
  try {
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

    const placeBranches = await Branch.find({ placeId }, '-__v')
      .skip(querySkipNo)
      .limit(queryLimitNo)
      .lean();

    const placeBranchesCount = await Branch.find({ placeId }).countDocuments();
    logger.info('getBranches Successfully', { req });
    return res.status(200).send({ placeBranches, placeBranchesCount });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = getBranches;