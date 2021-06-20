const mongoose = require('mongoose');
const fs = require('fs');
const cloudinary = require('../../../modules/cloudinary');
const Place = require('../place.model');
// const { Category } = require('../../category');
const Logger = require('../../../config/winston.services');
const logger = new Logger('uploadMenuImgs');

async function uploadMenuImgs (req, res, next) {
  try {
    // validate place id as mongo id
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      logger.error('Invalid place name');
      return res.status(400).json({ message: 'Invalid place name' });
    }
    if (!req.files || !req.files['menu']) {
      logger.error('insert images');
      return res.status(400).json({ message: 'insert images' });
    }

    // find the place in DB
    const targetedPlace = await Place.findOne({ _id: placeId });
    if (!targetedPlace) {
      logger.error(' place not found');
      return res.status(400).json({ message: ' place not found' });
    }

    // upload img to cloudinary and save urls to
    const menuImages = req.files['menu'];
    const menuImagesURLs = [];
    const oldMenuImageURLs = targetedPlace.menuURLs;

    for (const img of menuImages) {
      const { path } = img;
      const newPath = await cloudinary.upload(path, `${targetedPlace.name}/menu`);
      // remove old image from cloud
      menuImagesURLs.push(newPath);
      fs.unlink(path, (err) => {
        if (err) {
          logger.error('image not deleted ::  ');
          console.log('image not deleted ::  ', path);
        }
      });
    }
    targetedPlace.menuURLs = menuImagesURLs;
    // save updated place
    await targetedPlace.save();

    for (let i = 0; i < oldMenuImageURLs.length; i++) {
      await cloudinary.deleteOldImage(oldMenuImageURLs[i].name);
    }
    logger.info('uploadMenuImgs Successfully', { req });
    return res.status(200).json({ menuImagesURLs });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = uploadMenuImgs;