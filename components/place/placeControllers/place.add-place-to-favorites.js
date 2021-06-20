const mongoose = require('mongoose');
const { User, Place } = require('mongoose').models;
const Logger = require('../../../config/winston.services');
const logger = new Logger('addPlaceToFavorites');

async function addPlaceToFavorites (req, res, next) {
  try {
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      logger.error('Invalid place');
      return res.status(400).send({ message: 'Invalid place' });
    }

    const place = await Place.findOne({ _id: placeId }).lean();
    if (!place) {
      logger.error('Invalid place');
      return res.status(400).send({ message: 'Invalid place' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userData._id, favoritePlaces: { $ne: placeId } },
      { $push: { favoritePlaces: placeId } },
      { new: true }
    );

    if (!updatedUser) {
      logger.error('place already added');
      return res.status(400).json({ message: 'place already added' });
    }
    logger.info('addPlaceToFavorites Successfully', { req });
    return res.status(200).json({ favoritePlaces: updatedUser.favoritePlaces });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = addPlaceToFavorites;