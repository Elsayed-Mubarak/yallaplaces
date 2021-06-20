const Event = require('../event.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getAllEventsStatistics');

async function getAllEventsStatistics (req, res, next) {
  try {
    const pipeline = [
      [{
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          type: 1,
          count: 1
        }
      }
      ]
    ];

    const pipeline2 = [
      [{
        $group: {
          _id: '$active',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _active: 1,
          count: 1
        }
      }
      ]
    ];
    const events = await Event.aggregate(pipeline);
    const eventsActivation = await Event.aggregate(pipeline2);
    if (!events || !eventsActivation) {
      logger.error('There not exists event with this id');
      return res.status(400).json({ message: 'There not exists event with this id' });
    }
    logger.info('getAllEventsStatistics Successfully', { req });
    return res.status(200).send({ events, eventsActivation });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getAllEventsStatistics;