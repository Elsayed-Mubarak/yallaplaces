const mongoose = require('mongoose');
const Place = require('../place.model');
const { VisitCount } = require('../../shared');
const { getPlaces: getPlacesValidationSchema } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getPlacesByCategory');

async function getPlacesByCategory (req, res, next) {
  try {
    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      logger.error('Invalid Category name');
      return res.status(400).json({ message: 'Invalid Category name' });
    }

    const { error, value } = getPlacesValidationSchema.validate(req.query, { stripUnknown: true });
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).send({ message: error.message.replace(/"/g, '') });
    }

    const searchRegexExp = new RegExp(value.placeName, 'gi');
    const queryLimitNo = Number.parseInt(value.limitNo);
    const querySkipNo = Number.parseInt(value.pageNo) * queryLimitNo;
    // default ? sort by insertion order : sort by rate ascendingly or descendingly
    const sortBy = (value.sortBy === 'rate') ? { rate: value.order } : '';

    const placesCount = await Place.find({ name: searchRegexExp, categoryId }).countDocuments();
    const places = await Place.find({ name: searchRegexExp, categoryId }, '-galleryURLs -menuURLs -addedBy -updatedBy')
      .sort(sortBy)
      .skip(querySkipNo)
      .limit(queryLimitNo);

    if (req.userData.role === 'user') {
      await VisitCount.addVisit(req.userData._id, undefined, categoryId);
    }
    logger.info('getPlacesByCategory Successfully', { req });
    return res.status(200).json({ places, placesCount });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getPlacesByCategory;