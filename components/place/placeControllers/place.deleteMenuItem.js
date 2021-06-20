const mongoose = require('mongoose');
const MenuItem = require('../menuItem.model');
const Logger = require('../../../config/winston.services');
const logger = new Logger('deleteMenuItem');
async function deleteMenuItem (req, res, next) {
  try {

    const { itemId } = req.params;
    // validate place id as mongo id
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      logger.error('Invalid place');
      return res.status(400).json({ message: 'Invalid place' });
    }

    await MenuItem.deleteOne({ _id: itemId });
    logger.info('item deleted successfully', { req });
    return res.status(200).json({ message: 'item deleted successfully' });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = deleteMenuItem;