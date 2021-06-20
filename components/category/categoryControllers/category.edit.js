const fs = require('fs');
const mongoose = require('mongoose');
const Category = require('../category.model');
const cloudinary = require('../../../modules/cloudinary');
const { category: categoryValidationSchema } = require('../category.validate');
const Logger = require('../../../config/winston.services');
const logger = new Logger('EditCategory');

async function editCategory (req, res, next) {
  try {
    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      logger.error('Invalid category');
      return res.status(400).send({ message: 'Invalid category' });
    }

    console.log(req.body);
    const { error, value } = categoryValidationSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    const category = await Category.findOne({ _id: categoryId });
    if (!category) {
      logger.error('Invalid category');
      return res.status(400).json({ message: 'Invalid category' });
    }


    let imgUrl;

    if (req.file) {
      const { path } = req.file;
      imgUrl = await cloudinary.upload(path, `category/${value.categoryName.replace(/\s&/g, '')}`);
      fs.unlink(path, (err) => {
        if (err) {
          logger.error('image not deleted');
          console.log('image not deleted ::  ', path);
        }
      });
      category.imgUrl = imgUrl.url;
    }

    category.categoryName = value.categoryName;
    category.color = value.color;
    category.icon = value.icon;
    category.lastEditBy = req.userData._id;

    await category.save();
    logger.info('category edited successfully', { req });
    return res.status(200).json({ message: 'category edited successfully' });

  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = editCategory;