const User = require('../../user.model');
const { adminCreate: adminCreateValidationSchema } = require('../../user.validation');
const Logger = require('../../../../config/winston.services');
const logger = new Logger('adminCreate');

async function adminCreate (req, res, next) {
  try {
    const { error, value } = adminCreateValidationSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    let user = await User.findOne({ email: value.email });

    if (user) {
      logger.error('Email already exists');
      return res.status(409).json({ message: 'Email already exists' });
    }

    user = new User();
    await user.adaptToAdmin(value);
    await user.save();
    logger.info('admin added successfully', { req });
    return res.status(200).send({ message: 'admin added successfully' });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error', error });
  }
}

module.exports = adminCreate;