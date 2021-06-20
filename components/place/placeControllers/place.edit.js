const mongoose = require('mongoose');
const Place = require('../place.model');
const { Category } = require('../../category');
const { addPlace: addPlaceValidationSchema } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('editPlace');

async function editPlace (req, res, next) {
  try {

    const { categoryId, placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      logger.error('Invalid Category');
      return res.status(400).json({ message: 'Invalid Category' });
    }
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      logger.error('Invalid place');
      return res.status(400).json({ message: 'Invalid place' });
    }

    const { error, value } = addPlaceValidationSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    const existCategory = await Category.findOne({ _id: categoryId });
    if (!existCategory) {
      logger.error('Invalid Category Id');
      return res.status(400).json({ message: 'Invalid Category Id' });
    }

    value.categoryId = categoryId;
    if (req.body.contacts) {
      value.contact = req.body.contacts || undefined;
    }
    value.updatedBy = req.userData._id;

    const place = await Place.findOneAndUpdate({ _id: placeId }, value, { new: true });
    if (!place) {
      logger.error('place not exist');
      return res.status(400).json({ message: 'place not exist' });
    }
    logger.info('editPlace Successfully', { req });
    return res.status(200).json({ place });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = editPlace;