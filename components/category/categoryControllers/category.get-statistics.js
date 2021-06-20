const { VisitCount } = require('../../shared');
const Category = require('../category.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getCategoryStatistics');

async function getCategoryStatistics (req, res, next) {
  try {
    const pipeline = [
      // group the all model with category id and count in each group
      {
        $group: {
          _id: '$categoryId',
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
      // join with category model to get all cat data (act as join in sql)
      {
        $lookup: {
          from: Category.collection.name,
          localField: 'categoryId',
          foreignField: 'id',
          as: 'category'
        }
      },
      // filter the result of lookup to the cat of this group
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
    ];

    const categoryStatistics = await VisitCount.aggregate(pipeline);
    if (!categoryStatistics) {
      logger.error('No categoryStatistics');
      return res.status(400).json({ message: 'No categoryStatistics' });
    }
    logger.info('getCategoryStatistics', { req });
    return res.status(200).json({ categoryStatistics });

  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getCategoryStatistics;