const mongoose = require('mongoose');
const Event = require('../event.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('deleteEvent');

async function deleteEvent (req, res, next) {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      logger.error('Invalid Event');
      return res.status(400).json({ message: 'Invalid Event' });
    }

    const query = { _id: eventId };
    // if the user is owner check the place is added by him
    // this only usable if the place have multiple owner accounts
    if (req.userData.role === 'owner') { query['addedBy'] = req.userData._id; }

    const event = await Event.findOneAndDelete(query);
    if (!event) {
      logger.error('Event not or not have permission to delete event');
      return res.status(400).json({ message: 'Event not or not have permission to delete event' });
    }
    logger.info('Event deleted successfully', { req });
    return res.status(200).json({ message: 'Event deleted successfully' });

  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = deleteEvent;