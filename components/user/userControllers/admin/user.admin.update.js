const mongoose = require('mongoose');
const User = require('../../user.model');
const { adminEdit: adminEditValidationSchema } = require('../../user.validation');
const Logger = require('../../../../config/winston.services');
const logger = new Logger('adminUpdate');

async function adminUpdate (req, res, next) {
  try {
    const { error, value } = adminEditValidationSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    const { adminId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      logger.error('Invalid User');
      return res.status(400).send({ message: 'Invalid User' });
    }

    const checkMailExist = await User.findOne({ email: value.email, _id: { $ne: adminId } });
    if (checkMailExist) {
      logger.error('you cannot use this mail use another one');
      return res.status(400).json({ message: 'you cannot use this mail use another one' });
    }


    const admin = await User.findOneAndUpdate({ _id: adminId }, value, { new: true });
    if (!admin) {
      logger.error('User is not updated, try again later');
      return res.status(400).json({ message: 'User is not updated, try again later' });
    }


    logger.info('admin updated successfully', { req });
    return res.status(200).send({ message: 'user updated successfully' });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error', error });
  }
}

module.exports = adminUpdate;