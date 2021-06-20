const mongoose = require('mongoose');
const User = require('../../user/user.model');
const Event = require('../event.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('addEventToFavorites');

async function addEventToFavorites (req, res, next) {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      logger.error('Invalid Event');
      return res.status(400).send({ message: 'Invalid Event' });
    }

    const event = await Event.findOne({ _id: eventId }).lean();
    if (!event) {
      logger.error('Invalid Event');
      return res.status(400).send({ message: 'Invalid Event' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userData._id, favoriteEvents: { $ne: eventId } },
      { $push: { favoriteEvents: eventId } },
      { new: true }
    );

    if (!updatedUser) {
      logger.error('Event already added');
      return res.status(400).json({ message: 'Event already added' });
    }
    logger.info('Event Add TO Favorite Successfully', { req });
    return res.status(200).json({ favoriteEvents: updatedUser.favoriteEvents });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = addEventToFavorites;