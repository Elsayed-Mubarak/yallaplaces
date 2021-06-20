const Category = require('../category.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getAllCategories');


async function getAllCategories (req, res, next) {
  try {
    const categories = await Category.find({}, '-createdAt -updatedAt -__v -addedBy').lean();
    logger.info('Get All Category', { req });

    return res.status(200).send(categories);
  } catch (error) {
    logger.error('Internal server error');
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = getAllCategories;