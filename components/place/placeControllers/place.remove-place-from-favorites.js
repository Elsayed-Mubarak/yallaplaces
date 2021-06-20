const { User, Place } = require('mongoose').models;
const Logger = require('../../../config/winston.services');
const logger = new Logger('removePlaceFromFavorites');

async function removePlaceFromFavorites (req, res, next) {
  try {
    const { placeId } = req.params;
    const place = await Place.findOne({ _id: placeId });
    if (!place) {
      logger.error('Invalid place');
      return res.status(400).send('Invalid place');
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.userData._id },
      { $pull: { favoritePlaces: placeId } },
      { new: true });
    if (!updatedUser) {
      logger.error('place not added');
      return res.status(400).json({ message: 'place not added' });
    }
    logger.info('removePlaceFromFavorites', { req });
    return res.status(200).json({ favoritePlaces: updatedUser.favoritePlaces });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = removePlaceFromFavorites;