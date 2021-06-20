const Place = require('../place.model');
const { Category } = require('../../category');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getPlaceStatistics');

async function getPlaceStatistics (req, res, next) {
  try {
    const pipeline = [
      [
        {
          $group: {
            _id: '$categoryId',
            count: { $sum: 1 }
          }
        },

        {
          $lookup: {
            from: Category.collection.name,
            localField: 'categoryId',
            foreignField: 'id',
            as: 'category'
          }
        },
        {
          $project: {
            _id: 1,
            count: 1,
            categoryName: {
              $filter: {
                input: '$category',
                as: 'categoryNAME',
                cond: { $eq: ['$$categoryNAME._id', '$_id'] }
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
            category: {
              $reduce: {
                input: '$categoryName.categoryName',
                initialValue: '',
                in: { $concat: ['$$value', '$$this'] }
              }
            }
          }
        },
        // sorting by count
        {
          $sort: { count: -1 }
        }

      ]
    ];

    const placeStatistics = await Place.aggregate(
      pipeline
    );
    if (!placeStatistics) {
      logger.error('No Statistics');
      return res.status(400).json({ message: 'No placeStatistics' });
    }
    logger.info('getPlaceStatistics Successfully', { req });
    return res.status(200).json({ placeStatistics });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getPlaceStatistics;