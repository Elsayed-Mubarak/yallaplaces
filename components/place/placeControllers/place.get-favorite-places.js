const { User } = require('mongoose').models;
const Logger = require('../../../config/winston.services');
const logger = new Logger('getFavoritePlaces');

async function getFavoritePlaces (req, res, next) {
  try {
    const { favoritePlaces } = await User.findOne({ _id: req.userData._id }, '-_id favoritePlaces')
      .populate('favoritePlaces', 'name logoURL rate reviewsCount').lean();
    logger.info('getFavoritePlaces Successfully', { req });
    return res.status(200).json({ places: favoritePlaces });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getFavoritePlaces;