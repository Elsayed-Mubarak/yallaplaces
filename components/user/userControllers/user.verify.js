const User = require('../user.model');
const securityModule = require('../../../security');
const { otp: otpValidationSchema } = require('../user.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('verifyOTP');

async function verifyOTP (req, res, next) {
  try {
    // validate all data felids
    const { error, value } = otpValidationSchema.validate(req.body);
    // there are error in the validation data not valid
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    const user = await User.findOne({ _id: req.userData._id }, '-otpNextResendAt -__v -createdAt -updatedAt -forgotPasswordNextResetAt -forgotPasswordResetCounter');
    if (user.isVerified) {
      logger.error('User is already verified');
      return res.status(401).json({ message: 'User is already verified' });
    }
    // if otp == the code sent
    if (user.otp !== value.code) {
      logger.error('Invalid code');
      return res.status(400).json({ message: 'Invalid code' });
    }

    user.isVerified = true;
    user.otpRequestCounter = 0;
    await user.save();

    // remove data from user
    user.isVerified = user.otpRequestCounter = user.password = user.otp = user.updatedAt = undefined;
    securityModule.buildTicket(user, function (token) {
      logger.info('verifyOTP Successfully', { req });
      return res.status(200).json({ token, userData: user });
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = verifyOTP;