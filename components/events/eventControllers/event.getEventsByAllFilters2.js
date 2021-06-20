const Event = require('../event.model');
const { eventDateAndType2: EventSearchSchema } = require('../event.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getAllEventsByFilters');

async function getAllEventsByFilters (req, res, next) {
  try {
    const { error, value } = EventSearchSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    const limitNo = Number.parseInt(value.limitNo);
    const skipQuery = Number.parseInt(value.pageNo) * limitNo;

    const searchQuery = {};
    if (value.title) {
      searchQuery['title'] = new RegExp(value.title, 'gi');
    }
    if (value.type && value.type.length > 0) {
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

    if (value.location && value.location.length > 0) {

      searchQuery['location.area'] = {
        $in: value.location
      };
    }
    if (req.userData.role === 'owner')
      searchQuery['addedBy'] = req.userData._id;
    if (req.userData.role === 'user')
      searchQuery['active'] = true;

    console.log(searchQuery);

    const events = await Event.find(searchQuery).populate('placeId', 'name logoURL').skip(skipQuery).limit(limitNo);
    const eventsCount = await Event.find(searchQuery).countDocuments();

    if (!events) {
      logger.error('There not exists event with this type or in this date');
      return res.status(400).json({ message: 'There not exists event with this type or in this date' });
    }
    logger.info('getAllEventsByFilters Successfully', { req });
    return res.status(200).send({ events, eventsCount });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getAllEventsByFilters;