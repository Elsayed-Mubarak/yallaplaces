const mongoose = require('mongoose');
const Place = require('../place.model');
const MenuItem = require('../menuItem.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getMenuItemsGrouped');

async function getMenuItemsGrouped (req, res, next) {
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


    const pipeline = [
      {
        $match: {
          placeId: place._id
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          items: {
            $push: '$$ROOT'
          }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
          items: 1
        }
      },
      {
        $project: {
          'items._id': 0,
          'items.addedBy': 0,
          'items.__v': 0,
          'items.createdAt': 0,
          'items.updatedAt': 0,
          'items.type': 0,
          'items.placeId': 0,
          'items.category': 0
        }
      }


    ];


    const menuItems = await MenuItem.aggregate(pipeline);
    logger.info('getMenuItemsGrouped Successfully', { req });
    return res.status(200).send({ menuItems });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = getMenuItemsGrouped;