/* eslint-disable no-multi-spaces */
const getPlacesByCategory = require('./place.getPlacesByCategory');     // get all places for a specific category
const placeSearch = require('./place.search');                          // find all places that match search criteria
const getPlaceInfo = require('./place.get-place-info');                 // place home page -> get all place's info

const addReview = require('./place.add-review');                        // add user's review to a place
const getReviews = require('./place.get-reviews');                      // get users reviews for a place
const editReview = require('./place.edit-review');

const addNewPlace = require('./place.addNewPlace');                     // add new place (admin)
const addBranches = require('./place.addBranches');                     // add branch to a place (admin)

const uploadMenuImgs = require('./place.uploadMenuImgs');               // upload place menu images (admin)
const uploadGalleryImgs = require('./place.uploadGalleryImgs');         // upload place gallery images (admin)
const uploadLogoCoverImgs = require('./place.uploadLogoCover');         // upload logo and cover images (admin)

const getFavoritePlaces = require('./place.get-favorite-places');       // get user's favorite places list
const addPlaceToFavorites = require('./place.add-place-to-favorites');  // add place to user's favorites list
const removePlaceFromFavorites = require('./place.remove-place-from-favorites');  // remove place from user's favorite list
const editPlace = require('./place.edit');
const getBranches = require('./place.get-branches');
const editBranch = require('./place.editBranch');
const deleteBranch = require('./place.deleteBranch');
const toggleDeleteReview = require('./place.toggle-Delete-review');
const getPlaceStatistics = require('./place.get-place-statistics');
const getPlaceVisitsStatistics = require('./place.get-place-visits-statistics');
const getTopPlaces = require('./place.get-top-places');
const getAreas = require('./place.group.by.area');
const getPlacesByArea = require('./place.get.places.by.area');
const getPlaceByCategoryAndArea = require('./place.get.place.by.category.and.area');
const addMenuItem = require('./place.addMenuItem');
const editMenuItem = require('./place.editMenuItem');
const deleteMenuItem = require('./place.deleteMenuItem');
const getMenuItems = require('./place.get-menu-items');
const getMenuItemsGrouped = require('./place.get-menu-items-grouped');
const getAllAreas = require('./place.getAllAreas');
const addOffer = require('./place.add-offer');
const getPlaceOffers = require('./place.get-place-offers');
const editOffer = require('./place.edit-offer');
const deleteOffer = require('./place.remove-offer');
const getAllOffers = require('./place.getAllOffers');


module.exports = {
  getPlacesByCategory,
  addNewPlace,
  uploadLogoCoverImgs,
  placeSearch,
  uploadMenuImgs,
  uploadGalleryImgs,
  addReview,
  addBranches,
  getReviews,
  getPlaceInfo,
  editReview,
  addPlaceToFavorites,
  getFavoritePlaces,
  removePlaceFromFavorites,
  editPlace,
  getBranches,
  editBranch,
  deleteBranch,
  toggleDeleteReview,
  getPlaceStatistics,
  getPlaceVisitsStatistics,
  getTopPlaces,
  getAreas,
  getPlacesByArea,
  getPlaceByCategoryAndArea,
  addMenuItem,
  editMenuItem,
  deleteMenuItem,
  getMenuItems,
  getMenuItemsGrouped,
  getAllAreas,
  addOffer,
  getPlaceOffers,
  editOffer,
  deleteOffer,
  getAllOffers
};