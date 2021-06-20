const mongoose = require('mongoose');
const Place = require('../place.model');
const Branch = require('../branch.model');
const { addBranches: addBranchesValidationSchema } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('addBranches');
async function addBranches (req, res, next) {
  try {
    // validate place id as mongo id
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      logger.error('Invalid place name');
      return res.status(400).json({ message: 'Invalid place name' });
    }

    // valid req body fields
    const { error, value } = addBranchesValidationSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    // find the place in DB
    const targetedPlace = await Place.findOne({ _id: placeId });
    if (!targetedPlace) {
      logger.error('place not found');
      return res.status(400).json({ message: 'place not found' });
    }

    for (let i = 0; i < value.length; i++) {
      value[i].placeId = placeId;
      value[i].categoryId = targetedPlace.categoryId;
    }

    const branches = await Branch.insertMany(value);
    logger.info('addBranches Successfully', { req });
    return res.status(200).json({ branches });
  } catch (error) {
    console.log(error);
    logger.info(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = addBranches;