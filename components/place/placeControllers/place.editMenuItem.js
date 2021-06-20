const mongoose = require('mongoose');
const MenuItem = require('../menuItem.model');
const { getMenuItemValidationEdit } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('editMenuItem');

async function editMenuItem (req, res, next) {
  try {
    /**
     * place id to attach it to item
     */
    const { itemId } = req.query;
    // validate place id as mongo id
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      logger.error('Invalid item');
      return res.status(400).json({ message: 'Invalid item' });
    }



    // find the place in DB
    const targetedItem = await MenuItem.findOne({ _id: itemId });
    if (!targetedItem) {
      logger.error('item not found');
      return res.status(400).json({ message: 'item not found' });
    }

    // valid req body fields
    const { error, value } = getMenuItemValidationEdit(targetedItem.type.toString().trim()).validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    value.updatedBy = req.userData._id;

    const menuItemAdded = await MenuItem.findOneAndUpdate({ _id: itemId }, value, { new: true });
    logger.info('editMenuItem Successfully', { req });
    return res.status(200).json({ menuItem: menuItemAdded });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = editMenuItem;