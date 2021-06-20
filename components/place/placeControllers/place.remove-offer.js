const mongoose = require('mongoose');
const Place = require('../place.model');

async function deleteOffer (req, res, next) {
  try {
    const { placeId, offerId } = req.params;
    console.log(placeId, offerId);
    if (!mongoose.Types.ObjectId.isValid(placeId)) return res.status(400).send({ message: 'Invalid place' });

    const place = await Place.findOne({ _id: placeId });
    if (!place) return res.status(400).send({ message: 'Invalid place' });

    // find the index of offer
    const offerIndex = place.offers.findIndex(ele => ele.id === offerId);
    // remove this offer
    place.offers.splice(offerIndex, 1);

    await place.save();
    return res.status(200).send({ place });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = deleteOffer;