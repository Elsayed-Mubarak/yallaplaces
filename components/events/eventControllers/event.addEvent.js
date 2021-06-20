const mongoose = require('mongoose');
const { isValidLatitude, isValidLongitude } = require('is-valid-geo-coordinates');
const Event = require('../event.model');
const Branch = require('../../place/branch.model');
const fs = require('fs');
const Place = require('../../place/place.model');
const cloudinary = require('./../../../modules/cloudinary');
const { addEvent: addEventSchema } = require('../event.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('addNewEvent');

async function addNewEvent (req, res, next) {
  try {
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      logger.error('Invalid Place name');
      return res.status(400).json({ message: 'Invalid Place name' });
    }
    const { error, value } = addEventSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }
    value.location = {};

    if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
      if (!isValidLatitude(req.body.latitude) || !isValidLongitude(req.body.longitude)) {
        logger.error('longitude or latitude invalid');
        return res.status(400).json({ message: 'longitude or latitude invalid' });
      }
      else {
        value.location['lat'] = req.body.latitude;
        value.location['long'] = req.body.longitude;
        if (value.address) value.location['address'] = value.address;
        if (value.city) value.location['city'] = value.city;
        if (value.street) value.location['street'] = value.street;
        if (value.area) value.location['area'] = value.area;
        if (value.building) value.location['building'] = value.building;
        if (value.floor) value.location['floor'] = value.floor;
      }
    } else if (!req.body.longitude || !req.body.latitude) {
      const exitBranch = await Branch.findOne({ _id: value.branchId });
      if (exitBranch) {
        value.location['address'] = exitBranch.address;
        value.location['city'] = exitBranch.city;
        value.location['street'] = exitBranch.street;
        value.location['area'] = exitBranch.area;
        value.location['building'] = exitBranch.building;
        value.location['floor'] = exitBranch.floor;
      } else {
        logger.error('Enter Location For this Event');
        return res.status(400).json({ message: 'Enter Location For this Event' });
      }
    }

    const existPlace = await Place.findOne({ _id: placeId });
    if (!existPlace) {
      logger.error('place not exist');
      return res.status(400).json({ message: 'place not exist' });
    }

    let startTime = new Date(value.date);
    startTime = startTime.setHours(value.startTime, 0, 0);
    let endTime = new Date(value.date);
    endTime = endTime.setHours(value.endTime, 0, 0);

    // let startTimeNew = new Date(value.date);
    // let startTimePlus = startTimeNew.getTime() + 86400000;
    // let startTime = new Date(startTimePlus);
    // startTime = startTimeNew.setHours(value.startTime);
    // let endTime = new Date(value.date);
    // endTime = endTime.setHours(value.endTime);


    if (req.file) {
      const { path } = req.file;
      const imgUrl = await cloudinary.upload(path, `event/${value.title}`);
      fs.unlink(path, (err) => {
        if (err) {
          logger.error('image not deleted');
          console.log('image not deleted ::  ', path);
        }
      });
      value.eventImage = imgUrl.url;
    } else value.eventImage = existPlace.logoURL['url'];

    value.placeId = placeId;
    value.addedBy = req.userData._id;
    value.startAt = startTime;
    value.endAt = endTime;

    // console.log(value);
    const newEvent = await Event.create(value);
    logger.info('Add New Event Successfully', { req });
    return res.status(200).json({ Event: newEvent });


  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = addNewEvent;