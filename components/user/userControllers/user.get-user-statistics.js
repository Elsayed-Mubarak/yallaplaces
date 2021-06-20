const User = require('../user.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getUserStatistics');

async function getUserStatistics (req, res, next) {

  try {
    const userStatistics = await User.aggregate([
      {
        $match: {
          role: 'user'
        }
      },
      {
        $group: {
          _id: '$isVerified',
          count: { $sum: 1 }
        }
      }]);

    if (!userStatistics) {
      logger.error('No User isVerified');
      return res.status(400).json({ message: 'No User isVerified' });
    }
    logger.info('getUserStatistics successfully', { req });
    return res.status(200).json({ userStatistics });

  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getUserStatistics;