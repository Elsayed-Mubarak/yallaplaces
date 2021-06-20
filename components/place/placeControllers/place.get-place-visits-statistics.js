const Place = require('../place.model');
const { VisitCount } = require('../../shared');
const { paginationSchema: paginationValidationSchema } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getPlaceVisitsStatistics');

async function getPlaceVisitsStatistics (req, res, next) {
  try {
    const { error, value } = paginationValidationSchema.validate(req.query, { stripUnknown: true });
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).send({ message: error.message.replace(/"/g, '') });
    }

    const queryLimitNo = Number.parseInt(value.limitNo);
    const querySkipNo = Number.parseInt(value.pageNo) * queryLimitNo;

    const pipeline = [
      // group the all model with category id and count in each group
      {
        $group: {
          _id: '$placeId',
          count: { $sum: '$visitCount' }
        }
      },
      // to remove groups with id = null (place visit count group)
      {
        $match: {
          _id: {
            $ne: null
          }
        }
      },
      // join with place model to get all cat data (act as join in sql)
      {
        $lookup: {
          from: Place.collection.name,
          localField: 'placeId',
          foreignField: 'id',
          as: 'place'
        }
      },
      // filter the result of lookup to the place of this group
      {
        $project: {
          _id: 1,
          count: 1,
          placeName: {
            $filter: {
              input: '$place',
              as: 'placeName',
              cond: { $eq: ['$$placeName._id', '$_id'] }
            }
          }
        }
      },
      // the result of the previous operation is array contain array contain object of all cat data so
      // should reduce to string felid of cat name only
      {
        $project: {
          _id: 1,
          count: 1,
          place: {
            $arrayElemAt: ['$placeName', 0]
          }
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          'place._id': 1,
          'place.name': 1,
          'place.logoURL': 1,
          'place.coverURL': 1,
          'place.rate': 1,
          'place.reviewsCount': 1
        }
      },
      // sorting by count
      {
        $sort: { count: -1, place: -1 }
      },
      // skipping for pagination
      {
        $skip: querySkipNo
      },
      // limitation for pagination the number of docs in page
      {
        $limit: queryLimitNo
      }
    ];

    const placeVisitsStatistics = await VisitCount.aggregate(pipeline);
    if (!placeVisitsStatistics) {
      logger.error('No placeVisitsStatistics');
      return res.status(400).json({ message: 'No placeVisitsStatistics' });
    }
    logger.info('getPlaceVisitsStatistics Successfully', { req });
    return res.status(200).json({ placeVisitsStatistics });

  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getPlaceVisitsStatistics;