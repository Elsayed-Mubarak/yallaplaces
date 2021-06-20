const mongoose = require('mongoose');
const Event = require('../event.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('toggleEvent');

async function toggleEvent (req, res, next) {
  try {
    const { eventId } = req.params;
    console.log('***********************************', eventId);
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      logger.error('Invalid Event');
      return res.status(400).send({ message: 'Invalid Event' });
    }

    const event = await Event.findOne({ _id: eventId });
    if (!event) {
      logger.error('Event not exists');
      return res.status(400).json({ message: 'Event not exists' });
    }

    event.active = !event.active;
    event.save();
    logger.info('toggleEvent successfully', { req });
    return res.status(200).json({ message: `event ${(event.active) ? 'activated' : 'deactivated'} successfully` });

  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = toggleEvent;