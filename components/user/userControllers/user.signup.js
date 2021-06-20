const User = require('../user.model');
const { signup: signupValidationSchema } = require('../user.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('signup');

async function signup (req, res, next) {
  try {
    const { error, value } = signupValidationSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    let user = await User.findOne().or([{ email: value.email }, { phone: value.phone }]);

    if (user) {
      logger.error((user.email === value.email) ? 'Email already exists' : 'Phone already exists');
      return res.status(409).json({ message: (user.email === value.email) ? 'Email already exists' : 'Phone already exists' });
    }

    user = await User.create(value);
    const token = user.signTempJWT();
    logger.info('signup Successfully', { req });
    return res.status(201).send({ token });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = signup;