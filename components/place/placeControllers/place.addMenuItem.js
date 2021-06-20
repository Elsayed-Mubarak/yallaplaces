const mongoose = require('mongoose');
const MenuItem = require('../menuItem.model');
const Place = require('../place.model');
const { getMenuItemValidation2 } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('addMenuItem');

const types = ['history', 'health', 'co-working spaces', 'entertainment', 'restaurants'];
async function addMenuItem (req, res, next) {
  try {
    /**
     * place id to attach it to item
     */
    const { placeId, type } = req.query;
    // validate place id as mongo id
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      logger.error('Invalid place');
      return res.status(400).json({ message: 'Invalid place' });
    }
    if (types.indexOf(type.toString().trim()) === -1) {
      logger.error('Invalid category name');
      return res.status(400).json({ message: 'Invalid category name' });
    }

    // valid req body fields
    const { error, value } = getMenuItemValidation2(type.toString().trim()).validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    // find the place in DB
    const targetedPlace = await Place.findOne({ _id: placeId });
    if (!targetedPlace) {
      logger.error('place not found');
      return res.status(400).json({ message: 'place not found' });
    }

    for (let i = 0; i < value.length; i++) {
      value[i].placeId = placeId;
      value[i].addedBy = req.userData._id;
      value[i].type = type;
    }

    // value.placeId = placeId;
    // value.addedBy = req.userData._id;
    // value.type = type;

    const menuItemAdded = await MenuItem.insertMany(value);
    logger.info('addMenuItem Successfully', { req });
    return res.status(200).json({ menuItem: menuItemAdded });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = addMenuItem;