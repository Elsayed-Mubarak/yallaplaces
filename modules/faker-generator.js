// Share mongoose instance and models with faker generator app
const mongoose = require('mongoose');
const config = require('../config');


module.exports = {
  mongoose,
  dbURI: config.dbURI
};