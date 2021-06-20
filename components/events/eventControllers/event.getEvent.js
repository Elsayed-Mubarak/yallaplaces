const mongoose = require('mongoose');
const Event = require('../event.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getEvent');

async function getEvent (req, res, next) {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      logger.error('Invalid Event');
      return res.status(400).send({ message: 'Invalid Event' });
    }

    // const { placeId } = req.params;
    // if (!mongoose.Types.ObjectId.isValid(placeId)) return res.status(400).send({ message: 'Invalid Place' });

    const event = await Event.findOne({ _id: eventId }, '-createdAt -updatedAt -__v  ').populate('placeId', 'name logoURL');
    if (!event) {
      logger.error('Event not exists');
      return res.status(400).json({ message: 'Event not exists' });
    }
    logger.info('getEvent Successfully', { req });
    return res.status(200).send(event);

  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getEvent;