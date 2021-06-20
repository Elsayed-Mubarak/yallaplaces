const mongoose = require('mongoose');
const Place = require('../place.model');
const cloudinary = require('./../../../modules/cloudinary');
const fs = require('fs');
const { addOffer: offerValidationSchema } = require('../place.validation');

async function addOffer (req, res, next) {
  try {
    const { placeId } = req.params;
    const { error, value } = offerValidationSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message.replace(/"/g, '') });
    if (!mongoose.Types.ObjectId.isValid(placeId)) return res.status(400).send({ message: 'Invalid place' });

    const place = await Place.findOne({ _id: placeId });
    if (!place) return res.status(400).send({ message: 'Invalid place' });

    if (req.file) {
      const { path } = req.file;
      const imgUrl = await cloudinary.upload(path, `offers/${value.title}`);
      fs.unlink(path, (err) => { if (err) console.log('image not deleted ::  ', path); });
      value.offerImage = imgUrl.url;
    } else value.offerImage = place.logoURL['url'];


    place.offers.push({ title: value.title, description: value.description, price: value.price, offerImage: value.offerImage });
    await place.save();
    return res.status(200).send({ place });

  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = addOffer;