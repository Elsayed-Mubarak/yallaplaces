const mongoose = require('mongoose');
const Place = require('../place.model');
const MenuItem = require('../menuItem.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getMenuItems');

async function getMenuItems (req, res, next) {
  try {
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      logger.error('Invalid place');
      return res.status(400).send({ message: 'Invalid place' });
    }

    const place = await Place.findOne({ _id: placeId }).populate('categoryId', 'categoryName');
    if (!place) {
      logger.error('Invalid place');
      return res.status(400).send({ message: 'Invalid place' });
    }

    const menuItems = await MenuItem.find({ placeId }, '-placeId -addedBy -__v	-createdAt	-updatedAt -updatedBy -type');

    logger.info('getMenuItems Successfully', { req });
    return res.status(200).send({ menuItems, category: place.categoryId.categoryName });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = getMenuItems;