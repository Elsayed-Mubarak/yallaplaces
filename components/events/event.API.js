const express = require('express');
const security = require('../../security');
const multer = require('../../modules/multer');
const addNewEvent = require('./eventControllers/event.addEvent');
const editEvent = require('./eventControllers/event.editEvent');
const deleteEvent = require('./eventControllers/event.deleteEvent');
const getEvent = require('./eventControllers/event.getEvent');
const toggleEvent = require('./eventControllers/event.toggleEvent');
const getAllEventsTypes = require('./eventControllers/event.getAllEventsTypes');
const getAllEventsStatistics = require('./eventControllers/event.get-statistics');
const getAllPlaceEventsByFilters = require('./eventControllers/event.getPlaceEventsByAllFilters');
const getPrevNextPlaceEvents = require('./eventControllers/event.prevNextPlaceEvents');
const addEventToFavorites = require('../events/eventControllers/event.add-Event-To-Fav');
const getFavoriteEvents = require('../events/eventControllers/event.get-favorite-events');
const removeEventFromFavorites = require('../events/eventControllers/event.remove-event-from-favorites');
const getSearchFiltersOptions = require('./eventControllers/event.getSearchFiltersOptions');

const getAllEventsByFilters = require('./eventControllers/event.getEventsByAllFilters2');
// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/event/add-event/:placeId',
  security.auth(['owner']),
  multer.single('img'),
  addNewEvent
);

router.post('/event/update-event/:eventId',
  multer.single('img'),
  security.auth(['owner']),
  editEvent
);

router.delete('/event/delete-event/:eventId',
  security.auth(['owner']),
  deleteEvent
);

router.get('/event/get-event/:eventId',
  security.auth(['owner', 'user']),
  getEvent
);




router.post('/event/toggleEvent/:eventId',
  security.auth(['superadmin', 'admin', 'owner']),
  toggleEvent
);


router.get('/event/get-all-types',
  security.auth(['superadmin', 'admin', 'user', 'owner']),
  getAllEventsTypes
);

router.get('/event/get-events-statistics',
  security.auth(['superadmin', 'admin']),
  getAllEventsStatistics
);

router.post('/event/get-filtered-place-events/:placeId',
  security.auth(['superadmin', 'admin', 'user', 'owner']),
  getAllPlaceEventsByFilters
);

router.get('/event/get-prevNext-place-events/:placeId',
  security.auth(['superadmin', 'admin', 'user', 'owner']),
  getPrevNextPlaceEvents
);

router.post('/event/get-filtered-events',
  security.auth(['superadmin', 'admin', 'user', 'owner']),
  getAllEventsByFilters
);

router.post('/event/:eventId/add-to-favorites', security.auth(['user']), addEventToFavorites);
router.put('/event/:eventId/remove-event-from-favorites', security.auth(['user']), removeEventFromFavorites);
router.get('/event/favorite/all', security.auth(['user']), getFavoriteEvents);
router.get('/event/search/option', security.auth(['user']), getSearchFiltersOptions);


module.exports = router;