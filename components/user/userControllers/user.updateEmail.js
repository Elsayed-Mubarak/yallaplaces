const User = require('../user.model');
const { email: emailValidationSchema } = require('../user.validation');
const sendOtp = require('../../../modules/sms.API');
const Logger = require('../../../config/winston.services');
const logger = new Logger('updatePhone');
const Email = require('../../../modules/email');

async function updateEmail (req, res, next) {
  try {
    // validate all data felids
    const { error, value } = emailValidationSchema.validate(req.body);
    // there are error in the validation data not valid
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    const user = await User.findOne({ _id: req.userData._id });
    if (user.isVerified) {
      logger.error('User is already verified');
      return res.status(401).json({ message: 'User is already verified' });
    }

    let timeInSeconds = (user.otpNextResendAt - new Date()) / 1000;
    const responseBody = {
      timeInSeconds,
      email: user.email,
      message: 'To update email or resend verification please try again in'
    };
    if (user.otpNextResendAt > Date.now()) return res.status(400).json(responseBody);

    if (user.email === value.email) {
      logger.error('Email already exists');
      return res.status(409).send({ message: 'Email already exists' });
    }
    const isEmailExist = await User.findOne({ email: value.email });
    if (isEmailExist) {
      logger.error('Email already exists');
      return res.status(409).send({ message: 'Email already exists' });
    }

    user.email = value.email;
    user.updateOtp();
    await user.save();
    // sendOtp(user.phone, user.otp);
    await new Email(user, user.otp).sendWelcome();

    timeInSeconds = (user.otpNextResendAt - new Date()) / 1000;
    responseBody.timeInSeconds = timeInSeconds;
    responseBody.email = user.email;
    logger.info('update Email Successfully', { req });
    return res.status(200).send(responseBody);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = updateEmail;