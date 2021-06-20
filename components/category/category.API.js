const express = require('express');
const security = require('../../security');
const multer = require('../../modules/multer');
const { getAllCategories, addCategory, editCategory, categoryStatistics } = require('./categoryControllers');
// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/category/add-category',
  multer.single('img'),
  security.auth(['superadmin', 'superadmin', 'admin']),
  addCategory);

router.get('/category/home',
  security.auth(['user', 'superadmin', 'admin']),
  getAllCategories);

router.get('/category/statistics',
  security.auth(['superadmin', 'admin']),
  categoryStatistics);

router.put('/category/edit/:categoryId',
  multer.single('img'),
  security.auth(['superadmin', 'superadmin', 'admin']),
  editCategory);


module.exports = router;