const { User } = require('mongoose').models;
const Logger = require('../../../config/winston.services');
const logger = new Logger('getFavoriteEvents');

async function getFavoriteEvents (req, res, next) {
  try {
    const { favoriteEvents } = await User.findOne({ _id: req.userData._id }, '-_id favoriteEvents')
      .populate({
        path: 'favoriteEvents',
        select: '-createdAt -updatedAt -__v',
        populate: {
          path: 'placeId',
          select: 'name logoURL'
        }
      }).lean();
    logger.info('getFavoriteEvents Successfully', { req });
    return res.status(200).json({ events: favoriteEvents });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getFavoriteEvents;