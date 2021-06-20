const mongoose = require('mongoose');
const Place = require('../place.model');
const cloudinary = require('./../../../modules/cloudinary');
const fs = require('fs');
const { addOffer: offerValidationSchema } = require('../place.validation');

async function editOffer (req, res, next) {
  try {
    const { placeId, offerId } = req.params;
    console.log(placeId, offerId);
    const { error, value } = offerValidationSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.message.replace(/"/g, '') });
    if (!mongoose.Types.ObjectId.isValid(placeId)) return res.status(400).send({ message: 'Invalid place' });

    const place = await Place.findOne({ _id: placeId });
    if (!place) return res.status(400).send({ message: 'Invalid place' });

    // find the index of offer
    const offerIndex = place.offers.findIndex(ele => ele.id === offerId);

    if (req.file) {
      const { path } = req.file;
      const imgUrl = await cloudinary.upload(path, `offers/${value.title}`);
      fs.unlink(path, (err) => { if (err) console.log('image not deleted ::  ', path); });
      place.offers[offerIndex].offerImage = imgUrl.url;
    }

    place.offers[offerIndex].title = value.title;
    place.offers[offerIndex].price = value.price;
    place.offers[offerIndex].description = value.description;

    await place.save();
    return res.status(200).send({ place });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = editOffer;