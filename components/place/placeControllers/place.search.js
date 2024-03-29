const Place = require('../place.model');
const { Category } = require('../../category');
const { search: searchValidationSchema } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('placeSearch');

async function placeSearch (req, res, next) {
  try {
    const { error, value } = searchValidationSchema.validate(req.query, { stripUnknown: true });
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).send({ message: error.message.replace(/"/g, '') });
    }

    const searchRegexExp = new RegExp(value.placeName, 'gi');
    const queryLimitNo = Number.parseInt(value.limitNo);
    const querySkipNo = Number.parseInt(value.pageNo) * queryLimitNo;

    // if we found a category, get all places that belong to that category
    // else get all places
    const category = await Category.findOne({ categoryName: value.categoryName });
    const placeQueryCriteria = category ? { categoryId: category._id } : {};
    const placesCount = await Place.find({ name: searchRegexExp, ...placeQueryCriteria }).countDocuments();
    const places = await Place.find({ name: searchRegexExp, ...placeQueryCriteria })
      .sort({ name: 'asc' })
      .skip(querySkipNo)
      .limit(queryLimitNo);
    logger.info('placeSearch Successfully', { req });
    return res.status(200).send({ places, placesCount });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = placeSearch;