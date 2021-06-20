/* eslint-disable no-multi-spaces */
const signup = require('./user.signup');
const login = require('./user.login');

const sendVerification = require('./user.send-verification'); // send SMS to user with OTP
const updateEmail = require('./user.updateEmail'); // update user's phone and resend OTP
const verifyOtp = require('./user.verify'); // verify user's OTP

const userInfo = require('./user.user-info'); // get user info
const editProfile = require('./user.edit-profile'); // edit user's data
const updatePassword = require('./user.update-password'); // update user's password

const forgotPassword = require('./user.forgot-password'); // send OTP to user to reset password
const resetPassword = require('./user.reset-password'); // verify OTP and reset password

const getUserStatistics = require('./user.get-user-statistics');


const adminCreate = require('./admin/user.admin.create');
const toggleAdminActivation = require('./admin/user.admin.toggleActivation');
const adminGetAll = require('./admin/user.admin.getAll');
const adminUpdate = require('./admin/user.admin.update');

const editProfilePic = require('./user.edit-profile-pic');

const signUpGmail = require('./user.singUp-gmail');
const signUpFacebook = require('./user.singUp-facebook');

const guestToken = require('./user.guestUser');


module.exports = {
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
  getUserStatistics,

  adminCreate,
  adminUpdate,
  adminGetAll,
  toggleAdminActivation,

  editProfilePic,

  signUpGmail,
  signUpFacebook,

  guestToken
};