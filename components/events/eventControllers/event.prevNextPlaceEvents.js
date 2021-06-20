const Event = require('../event.model');
const { eventType: EventSearchSchema } = require('../event.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('getAllPrevNextPlaceEvents');

async function getAllPrevNextPlaceEvents (req, res, next) {
  try {

    const { error, value } = EventSearchSchema.validate(req.query);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    const limitNo = Number.parseInt(value.limitNo);
    const skipQuery = Number.parseInt(value.pageNo) * limitNo;

    const searchQuery = {};

    const date1 = new Date();

    if (req.userData.role === 'owner')
      searchQuery['addedBy'] = req.userData._id;
    if (req.userData.role === 'user')
      searchQuery['active'] = true;

    if (req.query.type === 'prev') {
      searchQuery['endAt'] = { $lt: date1 };
    } else searchQuery['endAt'] = { $gte: date1 };


    const events = await Event.find(searchQuery).populate('placeId').skip(skipQuery).limit(limitNo).sort({ startAt: -1 });
    const eventsCount = await Event.find(searchQuery).countDocuments();

    if (!events) {
      logger.error('There not exists event with this type or in this date');
      return res.status(400).json({ message: 'There not exists event with this type or in this date' });
    }
    logger.info('getAllPrevNextPlaceEvents Successfully', { req });
    return res.status(200).send({ events, eventsCount });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = getAllPrevNextPlaceEvents;