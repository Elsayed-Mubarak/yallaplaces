const Branch = require('../branch.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getAllAreas');

async function getAllAreas (req, res, next) {
  try {
    const pipeline = [
      [
        {
          $group: {
            _id: '$area'
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

    const areas = await Branch.aggregate(pipeline);
    if (!areas) {
      logger.error('No areas');
      return res.status(400).json({ message: 'No areas' });
    }
    logger.info('getAllAreas Successfully', { req });
    return res.status(200).json({ areas });


  } catch (error) {
    logger.error(error);
    console.log(error);

    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getAllAreas;