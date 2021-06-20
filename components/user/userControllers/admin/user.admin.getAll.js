const User = require('../../user.model');
const Logger = require('../../../../config/winston.services');
const logger = new Logger('adminactivate');

async function activate (req, res, next) {
  try {
    const admins = await User.find({ role: 'admin' }, 'firstName lastName email active').lean();
    if (admins.length < 1) {
      logger.error('no admin exist ');
      return res.status(400).json({ message: 'no admin exist -- you can add --' });
    }
    logger.info('adminactivate', { req });
    return res.status(200).send({ admins });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = activate;