const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../../config');

const userSchema = new mongoose.Schema({
  // sign up
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: null },
  gender: { type: String, default: null },
  birthday: { type: Date, default: null },

  offers: [{ type: String }],
  profileImage: { type: String },
  favoriteCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  favoritePlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
  favoriteEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],

  // owner
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },

  // verification
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpNextResendAt: { type: Date, default: Date.now },
  otpRequestCounter: { type: Number, default: 0 },

  forgotPasswordNextResetAt: { type: Date, default: Date.now },
  forgotPasswordResetCounter: { type: Number, default: 0 },

  // for security
  role: { type: String, default: 'user' },
  authFromGmail: { type: Boolean, default: false },
  authFromFacebook: { type: Boolean, default: false },
  authFromApple: { type: Boolean, default: false },
  uid: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true, usePushEach: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.password) return next();
  this._update.password = await bcrypt.hash(this._update.password, 10);
});

// check Password Validation
userSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.signTempJWT = function () {
  return jwt.sign({ _id: this._id }, config.tempTokenSecret, { expiresIn: `${config.tempTokenDurationInHours}h` });
};

userSchema.methods.updateOtp = function () {
  let blockTimeInMinutes = 1;

  // block user for 1h if he made 5 requests
  // otherwise block user for 1 minute
  if (this.otpRequestCounter === 4) {
    blockTimeInMinutes = 60;
    this.otpRequestCounter = -1;
  }
  // generate 6-digits OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  // add 60 seconds to next resend time
  const nextResendTime = new Date().getTime() + blockTimeInMinutes * 60000;

  this.otp = otp;
  this.otpNextResendAt = new Date(nextResendTime);
  this.otpRequestCounter++;
};

userSchema.methods.updateResetPasswordCounter = function () {
  let blockTimeInMinutes = 3;

  // block user for 3h if he made 3 requests
  // otherwise block user for 3 minutes
  if (this.forgotPasswordResetCounter === 2) {
    blockTimeInMinutes = 3 * 24 * 60; // 3Days
    this.forgotPasswordResetCounter = -1;
  }
  // add 3 minutes to next resend time
  const nextResendTime = new Date().getTime() + blockTimeInMinutes * 60000;

  this.forgotPasswordNextResetAt = new Date(nextResendTime);
  this.forgotPasswordResetCounter++;
};

userSchema.methods.adaptToAdmin = function (obj, role) {
  this.email = obj.email;
  this.password = obj.password;
  this.role = role || 'admin';

  this.firstName = obj.firstName || 'Super';
  this.lastName = obj.lastName || 'admin';

  this.phone = obj.email;
  this.gender = 'male';
  this.birthday = new Date();

  this.isVerified = true;
};

userSchema.methods.adaptToOwner = function (obj) {
  console.log(obj);
  this.email = obj.email;
  this.password = obj.password;
  this.role = 'owner';
  this.placeId = obj.placeId;

  this.firstName = obj.firstName || 'owner';
  this.lastName = obj.lastName || 'place';

  this.phone = obj.email;
  this.gender = 'male';
  this.birthday = new Date();
  this.isVerified = true;
};

userSchema.methods.adaptToGmailUser = function (obj) {
  this.firstName = obj.firstName;
  this.lastName = obj.lastName;
  this.email = obj.email;
  this.password = obj.accessToken;
  this.profileImage = obj.profileImage;
  this.isVerified = true;
  this.authFromGmail = true;
  this.uid = obj.uid;
};

userSchema.methods.adaptToFacebookUser = function (obj) {
  this.firstName = obj.firstName;
  this.lastName = obj.lastName;
  this.email = obj.email;
  this.password = obj.accessToken;
  this.profileImage = obj.profileImage;
  this.isVerified = true;
  this.authFromFacebook = true;
  this.uid = obj.uid;
};

module.exports = mongoose.model('User', userSchema);