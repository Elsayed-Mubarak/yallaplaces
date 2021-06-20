const mongoose = require('mongoose');
const fs = require('fs');
const cloudinary = require('../../../modules/cloudinary');
const Place = require('../place.model');
// const { Category } = require('../../category');


async function uploadLogoCoverImgs (req, res, next) {
  try {
    // validate place id as mongo id
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) return res.status(400).json({ message: 'Invalid place name' });
    // find the place in DB
    const targetedPlace = await Place.findOne({ _id: placeId });
    if (!targetedPlace) return res.status(400).json({ message: ' place not found' });
    // upload img to cloudinary and save urls to db
    let files = [];
    if (req.files && req.files['logo'] && req.files['cover']) {
      files.push(req.files['logo'][0]);
      files.push(req.files['cover'][0]);
    } else if (req.files && req.files['logo'] && !req.files['cover']) {
      files.push(req.files['logo'][0]);
    } else if (req.files && !req.files['logo'] && req.files['cover']) {
      files.push(req.files['cover'][0]);
    }
    for (const file of files) {
      const { path } = file;
      const newPath = await cloudinary.upload(path, `${targetedPlace.name.replace('&', '')}/brand`);
      // remove old image from cloud
      if (targetedPlace['logoURL'])
        await cloudinary.deleteOldImage(targetedPlace[`${file.fieldname}URL`].name);

      targetedPlace[`${file.fieldname}URL`].url = newPath.url;
      targetedPlace[`${file.fieldname}URL`].name = newPath.name;

      fs.unlink(path, (err) => {
        if (err) console.log('image not deleted ::  ', path);
      });
    }
    // save updated place
    await targetedPlace.save();
    // return with the updated places
    return res.status(200).json({ message: 'Images uploaded successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
}

module.exports = uploadLogoCoverImgs;