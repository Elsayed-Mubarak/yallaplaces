const User = require('../user.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('userInfo');
async function userInfo (req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.userId }, 'firstName lastName email phone gender birthday profileImage offers');
    logger.info('userInfo Successfully', { req });
    return res.status(200).send({ user });
  } catch (error) {
    logger.error(error);
    return res.status(500).send('Internal server error');
  }
}

module.exports = userInfo;