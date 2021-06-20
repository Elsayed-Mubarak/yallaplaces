const mongoose = require('mongoose');
const Event = require('../event.model');
const { eventDateAndType2: EventSearchSchema } = require('../event.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getAllPlaceEventsByFilters');

async function getAllPlaceEventsByFilters (req, res, next) {
  try {
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      logger.error('Invalid Place');
      return res.status(400).send({ message: 'Invalid Place' });
    }

    const { error, value } = EventSearchSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    const limitNo = Number.parseInt(value.limitNo);
    const skipQuery = Number.parseInt(value.pageNo) * limitNo;

    const searchQuery = { placeId };
    if (value.type && value.type.length > 0) {
      // let typeArr = [];
      // let arrString = value.type;
      // let answ = arrString.split(',');
      // answ.forEach(function(ele) {
      //     typeArr.push(ele);
      // });
      // const searchRegexExp = new RegExp(value.type, 'gi');
      // searchQuery['type'] = searchRegexExp;
      searchQuery['type'] = { $in: value.type };
    }
    if (value.fromDate) {
      const start = new Date(value.fromDate.setHours(0, 0, 0, 0));
      const end = new Date(value.fromDate.setHours(23, 59, 59, 999));

      searchQuery['$and'] = [
        { startAt: { $gte: start } },
        { startAt: { $lte: end } }
      ];
    }

    if (value.toDate) {
      const start = new Date(value.fromDate.setHours(0, 0, 0, 0));
      const end = new Date(value.toDate.setHours(23, 59, 59, 999));

      searchQuery['$and'] = [
        { startAt: { $gte: start } },
        { startAt: { $lte: end } }
      ];
    }

    if (value.location) {
      // let addressArr = [];
      // let arrString = value.address;
      // let answ = arrString.split(',');
      // answ.forEach(function(ele) {
      //     addressArr.push(ele);
      // });
      searchQuery['location.area'] = {
        $in: value.location
      };
    }

    if (req.userData.role === 'owner') searchQuery['addedBy'] = req.userData._id;
    if (req.userData.role === 'user') searchQuery['active'] = true;

    const events = await Event.find(searchQuery).populate('placeId').skip(skipQuery).limit(limitNo);
    const eventsCount = await Event.find(searchQuery).countDocuments();
    if (!events) {
      logger.error('There not exists event with this type or in this date');
      return res.status(400).json({ message: 'There not exists event with this type or in this date' });
    }
    logger.info('getAllPlaceEventsByFilters Successfully', { req });
    return res.status(200).send({ events, eventsCount });

  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getAllPlaceEventsByFilters;