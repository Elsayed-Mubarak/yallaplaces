const Branche = require('../branch.model');
const Place = require('../place.model');
const { getPlacesByAreaSchema } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getPlacesByArea');


async function getPlacesByArea (req, res, next) {

  try {
    const { error, value } = getPlacesByAreaSchema.validate(req.query);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).send({ message: error.message.replace(/"/g, '') });
    }
    const queryLimitNo = Number.parseInt(value.limitNo);
    const querySkipNo = Number.parseInt(value.pageNo) * queryLimitNo;

    const pipeline = [
      // match area from req.body
      [
        {
          $match: {
            area: {
              $eq: value.area
            }

          }
        },
        // make join with placeid which in matched area
        {
          $lookup: {
            from: Place.collection.name,
            localField: 'placeId',
            foreignField: '_id',
            as: 'place'
          }
        },
        {
          $unwind: '$place'
        },

        {
          $replaceRoot:
          {
            newRoot: '$place'
          }
        },

        // // skipping for pagination
        {
          $skip: querySkipNo
        },
        // limitation for pagination the number of docs in page
        {
          $limit: queryLimitNo
        }

      ]
    ];

    const areas = await Branche.aggregate(
      pipeline
    );
    // const areas = await Branch.find({ area }, 'placeId').populate('placeId').skip(0).limit(3);
    if (!areas) {
      logger.error('No Places in this  area');
      return res.status(400).json({ message: 'No Places in this  area' });
    }
    logger.info('getPlacesByArea Successfully', { req });
    return res.status(200).json({ areas });


  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getPlacesByArea;