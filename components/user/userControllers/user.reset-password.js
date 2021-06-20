const User = require('../user.model');
const { otp: otpValidationSchema } = require('../user.validation');
const { resetPassword: resetPasswordValidationSchema } = require('../user.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('resetPassword');

async function resetPassword (req, res, next) {
  try {
    const { error, value } = otpValidationSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    const user = await User.findOne({ _id: req.userData._id });
    if (user.otp !== value.code) {
      logger.error('Invalid code');
      return res.status(400).json({ message: 'Invalid code' });

    }
    const { error: passwordError, value: passwordValue } = resetPasswordValidationSchema.validate(req.body, { stripUnknown: true });
    if (passwordError) {
      logger.error(passwordError.message.replace(/"/g, ''));
      return res.status(400).send({ message: passwordError.message.replace(/"/g, '') });
    }

    user.password = passwordValue.password;
    user.otpRequestCounter = 0;
    await user.save();
    logger.info('resetPassword Successfully', { req });
    return res.status(204).send();
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = resetPassword;