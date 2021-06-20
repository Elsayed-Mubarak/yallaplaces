const Event = require('../event.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getSearchOptions');

async function getSearchOptions (req, res, next) {
  try {
    const pipeline = [
      [
        {
          $group: {
            _id: '$location.area'
          }
        },
        {
          $project: {
            _id: 0,
            area: '$_id'
          }
        }
      ]
    ];
    const pipeline2 = [
      [
        {
          $group: {
            _id: '$type'
          }
        },
        {
          $project: {
            _id: 0,
            type: '$_id'
          }
        }
      ]
    ];

    const areas = await Event.aggregate(pipeline);
    const types = await Event.aggregate(pipeline2);
    if (!areas) {
      logger.error('No areas');
      return res.status(400).json({ message: 'No areas' });
    }
    logger.info('getSearchOptions Successfully', { req });
    return res.status(200).json({ areas, types });


  } catch (error) {
    logger.error(error);
    console.log(error);

    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getSearchOptions;