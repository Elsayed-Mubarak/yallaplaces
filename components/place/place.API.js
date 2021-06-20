const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const security = require('../../security');
const multer = require('../../modules/multer');

const { getPlacesByCategory, addNewPlace, uploadLogoCoverImgs,
  uploadMenuImgs, uploadGalleryImgs, placeSearch, addBranches,
  addReview, getReviews, editReview, getPlaceInfo, addPlaceToFavorites,
  getFavoritePlaces, removePlaceFromFavorites, editPlace, getBranches,
  editBranch, deleteBranch, toggleDeleteReview, getPlaceStatistics, getTopPlaces,
  getPlaceVisitsStatistics, getAreas, getPlacesByArea, getPlaceByCategoryAndArea,
  addMenuItem, editMenuItem, deleteMenuItem, getMenuItems, getMenuItemsGrouped, getAllAreas, addOffer, getPlaceOffers, deleteOffer, editOffer, getAllOffers } = require('./placeControllers');

router.get('/places/:categoryId', security.auth(['user', 'superadmin', 'admin']), getPlacesByCategory);
router.get('/place/search', security.auth(['user', 'superadmin', 'admin']), placeSearch);
router.get('/place/:placeId/info', security.auth(['user', 'superadmin', 'admin']), getPlaceInfo);

router.post('/place/:placeId/add-review', security.auth(['user']), addReview);
router.get('/place/:placeId/get-reviews', security.auth(['user', 'superadmin', 'admin']), getReviews);
router.put('/place/:reviewId/edit-review', security.auth(['user']), editReview);

router.post('/place/:categoryId/add-new', security.auth(['superadmin', 'admin']), addNewPlace);
router.post('/place/add-branches/:placeId', security.auth(['superadmin', 'admin']), addBranches);

router.post('/place/upload-menu-img/:placeId',
  security.auth(['superadmin', 'admin']),
  multer.fields([{ name: 'menu', maxCount: 30 }]),
  uploadMenuImgs
);
router.post('/place/upload-gallery-img/:placeId',
  security.auth(['superadmin', 'admin']),
  multer.fields([{ name: 'gallery', maxCount: 30 }]),
  uploadGalleryImgs
);
router.post('/place/upload-main-img/:placeId',
  security.auth(['superadmin', 'admin']),
  multer.fields([{ name: 'logo', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
  uploadLogoCoverImgs
);

router.get('/place/favorite/all', security.auth(['user']), getFavoritePlaces);
router.post('/place/:placeId/add-to-favorites', security.auth(['user']), addPlaceToFavorites);
router.put('/place/:placeId/remove-place-from-favorites', security.auth(['user']), removePlaceFromFavorites);

router.put('/place/:categoryId/edit/:placeId', security.auth(['admin', 'superadmin']), editPlace);
router.get('/place/:placeId/branches', security.auth(['admin', 'superadmin', 'owner']), getBranches);
router.put('/place/edit-branches/:branchId', security.auth(['admin', 'superadmin']), editBranch);
router.delete('/place/delete-branch/:branchId', security.auth(['admin', 'superadmin']), deleteBranch); // delete place branch hard delete

router.put('/place/review/toggleDelete/:reviewId', security.auth(['admin', 'superadmin']), toggleDeleteReview);// to hide the user review or show it

router.get('/place/get-place-statistics', security.auth(['admin', 'superadmin']), getPlaceStatistics); // list of place count in each category.
router.get('/place/get-place-visits-statistics', security.auth(['admin', 'superadmin', 'user']), getPlaceVisitsStatistics);// list of place visited count top n .
router.get('/place/statistics/top', security.auth(['admin', 'superadmin']), getTopPlaces);
router.get('/place/get-areas', security.auth(['user']), getAreas);// get all areas
router.get('/place/get-places-by-area', security.auth(['user']), getPlacesByArea); // get all places in specific area
router.post('/place/search/filter', security.auth(['user']), getPlaceByCategoryAndArea);

router.post('/place/addMenuItem', security.auth(['admin', 'superadmin']), addMenuItem);
router.put('/place/editMenuItem', security.auth(['admin', 'superadmin']), editMenuItem);
router.delete('/place/deleteMenuItem/:itemId', security.auth(['admin', 'superadmin']), deleteMenuItem);
router.get('/place/getMenuItems/:placeId', security.auth(['admin', 'superadmin', 'user']), getMenuItems);
router.get('/place/getMenuItems/group/:placeId', security.auth(['admin', 'superadmin', 'user']), getMenuItemsGrouped);

router.get('/place/getAllAreas', security.auth(['user']), getAllAreas);


router.post('/place/add-offer/:placeId',
  security.auth(['superadmin', 'admin', 'owner']),
  multer.single('img'),
  addOffer
);
router.get('/place/get-place-offers/:placeId',
  security.auth(['superadmin', 'admin', 'user', 'owner']),
  getPlaceOffers
);
router.put('/place/edit-offer/:placeId/:offerId',
  security.auth(['superadmin', 'admin', 'owner']),
  multer.single('img'),
  editOffer
);

router.delete('/place/delete-offer/:placeId/:offerId',
  security.auth(['superadmin', 'admin', 'owner']),
  deleteOffer
);

router.get('/place/getAllOffers', security.auth(['superadmin', 'admin', 'user']), getAllOffers);


module.exports = router;