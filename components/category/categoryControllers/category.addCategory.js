const fs = require('fs');
const Category = require('../category.model');
const cloudinary = require('../../../modules/cloudinary');
const { category: categoryValidationSchema } = require('../category.validate');
const Logger = require('../../../config/winston.services');
const logger = new Logger('addCategory');

async function addCategory (req, res, next) {
  try {
    const { error, value } = categoryValidationSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    let category = await Category.findOne({ categoryName: value.categoryName });
    if (category) {
      logger.error('Category already exists');
      return res.status(409).json({ message: 'Category already exists' });
    }

    const { path } = req.file;
    const imgUrl = await cloudinary.upload(path, `category/${value.categoryName}`);
    fs.unlink(path, (err) => {
      if (err) {
        console.log('image not deleted ::  ', path);
        logger.error('image not deleted ');
      }
    });

    value.addedBy = req.userData._id;
    value.imgUrl = imgUrl.url;

    category = await Category.create(value);
    logger.info('category added successfully', { req });
    return res.status(200).json({ message: 'category added successfully' });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = addCategory;