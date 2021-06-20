const mongoose = require('mongoose');
const Place = require('../place.model');

async function getPlaceOffers (req, res, next) {
  try {
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) return res.status(400).send({ message: 'Invalid place' });

    const offers = await Place.findOne({ _id: placeId }, '-_id offers');
    if (!offers) return res.status(400).send({ message: 'Invalid place' });
    return res.status(200).json({ offers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getPlaceOffers;