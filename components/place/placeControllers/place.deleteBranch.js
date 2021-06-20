const mongoose = require('mongoose');
const Branch = require('../branch.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('deleteBranch');
async function deleteBranch (req, res, next) {
  try {
    // validate place id as mongo id
    const { branchId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(branchId)) {
      logger.error('Invalid branch name');
      return res.status(400).json({ message: 'Invalid branch name' });
    }

    // find the place in DB
    const branch = await Branch.findOneAndDelete({ _id: branchId });
    if (!branch) {
      logger.error('branch not exist');
      return res.status(400).json({ message: 'branch not exist' });
    }
    logger.info('deleteBranch Successfully', { req });
    return res.status(200).json({ branch });

  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = deleteBranch;