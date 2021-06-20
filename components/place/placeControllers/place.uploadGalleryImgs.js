const mongoose = require('mongoose');
const fs = require('fs');
const cloudinary = require('../../../modules/cloudinary');
const Place = require('../place.model');
// const { Category } = require('../../category');
const Logger = require('../../../config/winston.services');
const logger = new Logger('uploadGalleryImgs');

async function uploadGalleryImgs (req, res, next) {
  try {
    // validate place id as mongo id
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      logger.error('Invalid place name');
      return res.status(400).json({ message: 'Invalid place name' });
    }
    if (!req.files || !req.files['gallery']) {
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
    const galleryImages = req.files['gallery'];
    const galleryImagesURLs = [];
    const oldGalleryImageURLs = targetedPlace.galleryURLs;

    for (const img of galleryImages) {
      const { path } = img;
      const newPath = await cloudinary.upload(path, `${targetedPlace.name.replace('&', '')}/gallery`);
      // remove old image from cloud
      galleryImagesURLs.push(newPath);
      fs.unlink(path, (err) => {
        if (err) {
          logger.error('image not deleted ::  ');
          console.log('image not deleted ::  ', path);
        }
      });
    }
    targetedPlace.galleryURLs = galleryImagesURLs;
    // save updated place
    await targetedPlace.save();

    for (let i = 0; i < oldGalleryImageURLs.length; i++) {
      await cloudinary.deleteOldImage(oldGalleryImageURLs[i].name);
    }
    logger.info('uploadGalleryImgs Successfully', { req });
    return res.status(200).json({ galleryImagesURLs });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = uploadGalleryImgs;