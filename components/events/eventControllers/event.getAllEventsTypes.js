const Event = require('../event.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getAllEventsTypes');

async function getAllEventsTypes (req, res, next) {
  try {
    const pipeline = [
      [{
        $group: {
          _id: '$type'
        }
      },
      {
        $project: {
          type: 1
        }
      }
      ]
    ];
    const eventTypes = await Event.aggregate(pipeline);
    if (!eventTypes) {
      logger.error('There not exists event with this id');
      return res.status(400).json({ message: 'There not exists event with this id' });
    }
    logger.info('getAllEventsTypes Successfully', { req });
    return res.status(200).send(eventTypes);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getAllEventsTypes;