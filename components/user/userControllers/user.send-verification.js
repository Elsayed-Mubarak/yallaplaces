const User = require('../user.model');
const sendOtp = require('../../../modules/sms.API');
const Logger = require('../../../config/winston.services');
const logger = new Logger('sendVerification');
const Email = require('./../../../modules/email');
async function sendVerification (req, res, next) {
  try {
    const user = await User.findOne({ _id: req.userData._id });
    if (user.isVerified) {
      logger.error('User is already verified');
      return res.status(401).json({ message: 'User is already verified' });
    }
    // if otp next resend time didn't expire
    let timeInSeconds = (user.otpNextResendAt - new Date()) / 1000;
    const responseBody = {
      timeInSeconds,
      email: user.email,
      message: 'To update email or resend verification please try again in'
    };
    if (user.otpNextResendAt > Date.now()) return res.status(400).json(responseBody);

    user.updateOtp();
    await user.save();

    await new Email(user, user.otp).sendWelcome();
    // sendOtp(user.phone, user.otp);

    timeInSeconds = (user.otpNextResendAt - new Date()) / 1000;
    responseBody.timeInSeconds = timeInSeconds;
    logger.info('sendVerification Successfully', { req });
    return res.status(200).send(responseBody);
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = sendVerification;