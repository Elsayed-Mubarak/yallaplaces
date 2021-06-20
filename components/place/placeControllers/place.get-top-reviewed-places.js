const Place = require('../place.model');
const { Category } = require('../../category');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getTopReviewedPlaces');

async function getTopReviewedPlaces (req, res, next) {
  try {

    const pipeline = [
      {
        $sort: {
          reviewsCount: -1
        }
      },
      { $limit: 20 },
      {
        $lookup: {
          from: Category.collection.name,
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $project: {
          _id: 1,
          totalRate: 1,
          reviewsCount: 1,
          rate: 1,
          name: 1,
          category: {
            $reduce: {
              input: '$category.categoryName',
              initialValue: '',
              in: { $concat: ['$$value', '$$this'] }
            }
          }
        }
      }

    ];

    const topReviewedPlaces = await Place.aggregate(pipeline);
    if (!topReviewedPlaces) {
      logger.error('No topReviewedPlaces');
      return res.status(400).json({ message: 'No topReviewedPlaces' });
    }
    logger.info('getTopReviewedPlaces Successfully', { req });
    return res.status(200).json(topReviewedPlaces);

  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getTopReviewedPlaces;