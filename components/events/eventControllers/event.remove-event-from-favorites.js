const { User, Event } = require('mongoose').models;
const Logger = require('../../../config/winston.services');
const logger = new Logger('removeEventFromFavorites');

async function removeEventFromFavorites (req, res, next) {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({ _id: eventId });
    if (!event) {
      logger.error('Invalid Event');
      return res.status(400).send('Invalid Event');
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.userData._id },
      { $pull: { favoriteEvents: eventId } },
      { new: true });
    if (!updatedUser) {
      logger.error('Event not added');
      return res.status(400).json({ message: 'Event not added' });
    }
    logger.info('removeEventFromFavorites Successfully', { req });
    return res.status(200).json({ favoriteEvents: updatedUser.favoriteEvents });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = removeEventFromFavorites;