const mongoose = require('mongoose');
const Place = require('../place.model');

async function getAllOffers (req, res, next) {
  try {

    const offers = await Place.find({}, '-_id offers');
    const offersArr = [];
    for (let i = 0; i < offers.length; i++) {
      if (offers[i].offers.length >= 1) {
        for (let j = 0; j < offers[i].offers.length; j++) {
          offersArr.push(offers[i].offers[j]);
        }
      }
    }
    return res.status(200).json(offersArr);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getAllOffers;