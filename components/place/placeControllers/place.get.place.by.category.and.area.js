const mongoose = require('mongoose');
const placeModel = require('../place.model');
const branchModel = require('../branch.model');
const { getPlacesByCategoryAndArea } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getPlaceByCategoryAndArea');

async function getPlaceByCategoryAndArea (req, res, next) {

  try {
    const { error, value } = getPlacesByCategoryAndArea.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).send({ message: error.message.replace(/"/g, '') });
    }

    const searchRegexExp = new RegExp(value.placeName, 'gi');
    const queryLimitNo = Number.parseInt(value.limitNo);
    const querySkipNo = Number.parseInt(value.pageNo) * queryLimitNo;

    const matchQuery = {};

    if (value.category && value.category.length > 0) {
      const arr = [];
      for (let i = 0; i < value.category.length; i++) {
        const id = value.category[i];
        if (!mongoose.Types.ObjectId.isValid(id)) {
          logger.error(`Invalid cat ${i + 1}`);
          return res.status(400).send({ message: `Invalid cat ${i + 1}` });
        }
        arr.push(mongoose.Types.ObjectId(id));
      }
      matchQuery['categoryId'] = { $in: arr };
    }

    if (value.area && value.area.length > 0) {
      matchQuery['area'] = { $in: value.area };
    }

    const pipeline = [
      [
        {
          $match: matchQuery
        },
        {
          $group: {
            _id: '$placeId'
          }
        },
        {
          $lookup: {
            from: placeModel.collection.name,
            localField: '_id',
            foreignField: '_id',
            as: 'place'
          }
        },
        {
          $unwind: '$place'
        },
        {
          $match: {
            'place.name': { $regex: searchRegexExp }
          }
        },
        {
          $project: {
            'place._id': 1,
            'place.name': 1,
            'place.rate': 1,
            'place.reviewsCount': 1,
            'place.logoURL': 1,
            'place.categoryId': 1
          }
        },
        {
          $replaceRoot: { newRoot: '$place' }
        },
        {
          $facet: {
            paginatedResults: [{ $skip: querySkipNo }, { $limit: queryLimitNo }],
            totalCount: [{ $count: 'count' }]
          }
        },
        {
          $project: {
            paginatedResults: 1,
            totalCount: '$totalCount.count'
          }
        },
        {
          $unwind: '$totalCount'
        }
      ]
    ];

    const places = await branchModel.aggregate(pipeline);
    if (!places) {
      logger.error('No places');
      return res.status(400).json({ message: 'No places' });
    }
    console.log(places);
    logger.info('getPlaceByCategoryAndArea Successfully', { req });
    return res.status(200).send({
      places: (places[0]) ? places[0].paginatedResults : [],
      totalCount: (places[0]) ? places[0].totalCount : 0
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error', error });
  }
}

module.exports = getPlaceByCategoryAndArea;