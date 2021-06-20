const mongoose = require('mongoose');
const { isValidLatitude, isValidLongitude } = require('is-valid-geo-coordinates');
const Event = require('../event.model');
const fs = require('fs');
const cloudinary = require('./../../../modules/cloudinary');
const { newEvent: eventValidationSchema } = require('../event.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('editEvent');

async function editEvent (req, res, next) {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      logger.error('Invalid Event');
      return res.status(400).send({ message: 'Invalid Event' });
    }

    const { error, value } = eventValidationSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }
    value.location = {};

    if (value.branchId !== undefined) {
      value.location['address'] = value.address;
      value.location['city'] = value.city;
      value.location['street'] = value.street;
      value.location['area'] = value.area;
      value.location['building'] = value.building;
      value.location['floor'] = value.floor;
      value.location['lat'] = 0;
      value.location['long'] = 0;
    } else if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
      if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
        if (!isValidLatitude(req.body.latitude) || !isValidLongitude(req.body.longitude)) {
          logger.error('longitude or latitude invalid');
          return res.status(400).json({ message: 'longitude or latitude invalid' });
        }
        else {
          value.location['lat'] = req.body.latitude;
          value.location['long'] = req.body.longitude;
        }
      }
      if (value.address) value.location['address'] = value.address;
      if (value.city) value.location['city'] = value.city;
      if (value.street) value.location['street'] = value.street;
      if (value.area) value.location['area'] = value.area;
      if (value.building) value.location['building'] = value.building;
      if (value.floor) value.location['floor'] = value.floor;
    } else {
      if (value.address) value.location['address'] = value.address;
      if (value.city) value.location['city'] = value.city;
      if (value.street) value.location['street'] = value.street;
      if (value.area) value.location['area'] = value.area;
      if (value.building) value.location['building'] = value.building;
      if (value.floor) value.location['floor'] = value.floor;
    }

    const event = await Event.findOne({ _id: eventId });
    if (!event) {
      logger.error('Invalid Event');
      return res.status(400).json({ message: 'Invalid Event' });
    }

    if (req.userData._id.toString() !== event.addedBy.toString()) {
      logger.error('you not have permission to edit event');
      return res.status(401).json({ message: 'you not have permission to edit event' });
    }
    let startTime = new Date(value.date);
    startTime = startTime.setHours(value.startTime, 0, 0);
    let endTime = new Date(value.date);
    endTime = endTime.setHours(value.endTime, 0, 0);

    // let startTimeNew = new Date(value.date);
    // let startTimePlus = startTimeNew.getTime() + 86400000;
    // let startTime = new Date(startTimePlus);
    // startTime = startTime.setHours(value.startTime);
    // let endTime = new Date(startTimePlus);
    // endTime = endTime.setHours(value.endTime);

    value.startAt = startTime;
    value.endAt = endTime;

    let imgUrl;
    if (req.file) {
      const { path } = req.file;
      imgUrl = await cloudinary.upload(path, `event/${value.title}`);
      fs.unlink(path, (err) => {
        if (err) {
          logger.error('image not deleted ');
          console.log('image not deleted ::  ', path);
        }
      });
      value.eventImage = imgUrl.url;
    }

    const updatedEvent = await Event.findByIdAndUpdate({ _id: eventId }, value);
    if (!updatedEvent) {
      logger.error('Event edit failed');
      return res.status(400).json({ message: 'Event edit failed' });
    }
    logger.info('Event edited successfully', { req });
    return res.status(200).json({ message: 'Event edited successfully' });

  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = editEvent;