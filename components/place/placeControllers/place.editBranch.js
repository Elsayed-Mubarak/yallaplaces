const mongoose = require('mongoose');
const Branch = require('../branch.model');
const { editBranch: editBranchValidationSchema } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('editBranch');

async function editBranch (req, res, next) {
  try {
    // validate place id as mongo id
    const { branchId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(branchId)) {
      logger.error('Invalid branch name');
      return res.status(400).json({ message: 'Invalid branch name' });
    }

    // valid req body fields
    const { error, value } = editBranchValidationSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    // find the place in DB
    const branch = await Branch.findOneAndUpdate({ _id: branchId }, value, { new: true });
    if (!branch) {
      logger.error('branch not exist');
      return res.status(400).json({ message: 'branch not exist' });
    }
    logger.info('editBranch Successfully', { req });
    return res.status(200).json({ branch });

  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = editBranch;