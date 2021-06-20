const express = require('express');
const multer = require('../../modules/multer');
const {
  login,
  signup,
  sendVerification,
  verifyOtp,
  updateEmail,
  editProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  userInfo,
  adminCreate,
  toggleAdminActivation,
  adminGetAll,
  adminUpdate,
  getUserStatistics,
  editProfilePic,
  signUpGmail,
  signUpFacebook,
  guestToken
} = require('./userControllers');
const security = require('../../security');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/user/signup', signup);
router.post('/user/login', login);

router.post('/user/request-verification-code', security.validateTempToken, sendVerification);
router.put('/user/update-email', security.validateTempToken, updateEmail);
router.post('/user/verify', security.validateTempToken, verifyOtp);

router.get('/user/user-profile/:userId', security.auth(['user', 'owner']), userInfo);
router.put('/user/edit-profile', security.auth(['user', 'owner']), editProfile);

router.post('/user/edit-profile-image/:userId',
  security.auth(['user', 'owner']),
  multer.fields([{ name: 'profilePic', maxCount: 1 }]),
  editProfilePic);

router.put('/user/update-password', security.auth(['user', 'owner']), updatePassword);

router.get('/user/get-user-statistics', security.auth(['admin', 'superadmin']), getUserStatistics);

router.post('/user/forgot-password', forgotPassword);
router.put('/user/reset-password', security.validateTempToken, resetPassword);

router.post('/admin/manage/create', security.auth(['superadmin']), adminCreate);
router.get('/admin/manage/get-all', security.auth(['superadmin']), adminGetAll);
router.put('/admin/manage/edit/:adminId', security.auth(['superadmin']), adminUpdate);
router.put('/admin/manage/activate/:adminId', security.auth(['superadmin']), toggleAdminActivation);

// signup from social media
router.post('/user/auth-gmail', signUpGmail);
router.post('/user/auth-facebook', signUpFacebook);

router.get('/user/guest', guestToken);


module.exports = router;