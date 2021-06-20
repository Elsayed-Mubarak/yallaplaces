const User = require('../user.model');
const { forgotPassword: forgotPasswordValidationSchema } = require('../user.validation');
const sendOtp = require('../../../modules/sms.API');
const Logger = require('../../../config/winston.services');
const logger = new Logger('forgotPassword');
const Email = require('./../../../modules/email');
async function forgotPassword (req, res, next) {
  try {
    const { error, value } = forgotPasswordValidationSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    const user = await User.findOne().or([{ email: value.email }, { phone: value.email }]);

    if (!user) {
      logger.error('User not found, enter a valid email or phone');
      return res.status(404).send({ message: 'User not found, enter a valid email or phone' });
    }
    if (user.forgotPasswordNextResetAt > Date.now()) {
      logger.error('Try again in a few minutes');
      return res.status(400).send({ message: 'Try again in a few minutes' });
    }
    if (user.otpNextResendAt > Date.now()) {
      logger.error('Try again in a few minutes');
      return res.status(400).send({ message: 'Try again in a few minutes' });
    }

    user.updateOtp();
    user.updateResetPasswordCounter();
    await user.save();

    // sendOtp(user.phone, user.otp);
    await new Email(user, user.otp).sendPasswordReset();
  
    const token = user.signTempJWT();
    logger.info('forgotPassword Successfully', { req });
    return res.status(200).send({ token, email: value.email });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = forgotPassword;