/* eslint-disable no-var */
const Place = require('../place.model');
const { Category } = require('../../category');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getTopPlaces');

async function getTopPlaces (req, res, next) {
  const { typeOfSort = 'rate', sort = -1 } = req.query;
  const sortArray = ['rate', 'reviewsCount'];
  const sortTypeArray = [-1, 1];
  const sortQuery = {};
  sortQuery[typeOfSort] = Number.parseInt(sort);


  try {
    if (!sortArray.includes(typeOfSort) || !sortTypeArray.includes(Number.parseInt(sort))) {
      logger.error('select a valid type of sort');
      return res.status(400).json({ message: 'select a valid type of sort' });
    }

    const pipeline = [
      {
        $sort: sortQuery
      },
      {
        $group: {
          _id: '$categoryId',
          count: { $sum: 1 },
          places: {
            $push: { _id: '$_id', rate: '$rate', reviewsCount: '$reviewsCount', totalRate: '$totalRate', name: '$name' }
          }
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
          places: {
            $slice: ['$places', 5]
          },
          categoryName: {
            $filter: {
              input: '$category',
              as: 'categoryNAME',
              cond: { $eq: ['$$categoryNAME._id', '$_id'] }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          places: 1,
          category: {
            $reduce: {
              input: '$categoryName.categoryName',
              initialValue: '',
              in: { $concat: ['$$value', '$$this'] }
            }
          }
        }
      },
      {
        $sort: { category: -1 }
      }
    ];

    const topPlaceRate = await Place.aggregate(pipeline);
    if (!topPlaceRate) {
      logger.error('No topPlaceRate');
      return res.status(400).json({ message: 'No topPlaceRate' });
    }
    logger.info('getTopPlaces sucessfully', { req });
    return res.status(200).json(topPlaceRate);

  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getTopPlaces;