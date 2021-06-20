const mongoose = require('mongoose');
const Place = require('../place.model');
const Branch = require('../branch.model');
const { VisitCount } = require('../../shared');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getPlaceInfo');

async function getPlaceInfo (req, res, next) {
  try {
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      logger.error('Invalid place');
      return res.status(400).send({ message: 'Invalid place' });
    }

    const place = await Place.findOne({ _id: placeId }, '-categoryId -addedBy -createdAt -updatedAt -__v');
    if (!place) {
      logger.error('Invalid place');
      return res.status(400).send({ message: 'Invalid place' });
    }
    const locations = await Branch.find({ placeId }, '-_id city area street building floor otherDetails').lean();

    if (req.userData.role === 'user') {
      await VisitCount.addVisit(req.userData._id, placeId);
    }
    logger.info('getPlaceInfo Successfully', { req });
    return res.status(200).json({ place, locations });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getPlaceInfo;