const Branch = require('../branch.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getAreas');

async function getAreas (req, res, next) {
  try {
    const pipeline = [
      [
        {
          $group: {
            _id: '$area',
            places: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            area: '$_id',
            places: 1
          }
        }

      ]
    ];

    const areas = await Branch.aggregate(
      pipeline
    );
    if (!areas) {
      logger.error('No Areas');
      return res.status(400).json({ message: 'No Areas' });
    }
    logger.info('getAreas Successfully', { req });
    return res.status(200).json({ areas });


  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getAreas;