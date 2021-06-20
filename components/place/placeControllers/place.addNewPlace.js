const mongoose = require('mongoose');
const Place = require('../place.model');
const User = require('../../user/user.model');
const { Category } = require('../../category');
const { addPlace: addPlaceValidationSchema } = require('../place.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('addNewPlace');

async function addNewPlace (req, res, next) {
  try {

    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      logger.error('Invalid Category name');
      return res.status(400).json({ message: 'Invalid Category name' });

    }
    const { error, value } = addPlaceValidationSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    const existPlace = await Place.findOne({ name: value.name });
    if (existPlace) {
      logger.error('place exist , duplicated name');
      return res.status(409).json({ message: 'place exist , duplicated name' });
    }

    const existCategory = await Category.findOne({ _id: categoryId });
    if (!existCategory) {
      logger.error('Invalid Category Id');
      return res.status(400).json({ message: 'Invalid Category Id' });
    }

    const SearchedUser = await User.findOne({ email: value.owner.email });
    if (SearchedUser) {
      logger.error('email already exists');
      return res.status(400).json({ message: 'email already exists' });
    }

    value.categoryId = categoryId;
    value.contact = req.body.contacts;
    value.addedBy = req.userData._id;

    const newPlace = await Place.create(value);

    const user = new User();
    value.owner.placeId = newPlace.id;
    await user.adaptToOwner(value.owner);
    await user.save();
    logger.info('addNewPlace Successfully', { req });
    return res.status(200).json({ Place: newPlace });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = addNewPlace;