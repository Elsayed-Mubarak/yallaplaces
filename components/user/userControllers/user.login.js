const { login: loginValidationSchema } = require('../user.validation');
const User = require('../user.model');
const securityModule = require('../../../security');
const Logger = require('../../../config/winston.services');
const logger = new Logger('login');

async function login (req, res, next) {

  try {
    const { error, value } = loginValidationSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }
    console.log(value);
    const user = await User.findOne({ $or: [{ email: value.email }, { phone: value.email }] });
    if (!user) {
      logger.error('Invalid username or password');
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    if (!user.active && user.role === 'admin') {
      logger.error('user not active right now Call the admin');
      return res.status(400).json({ message: 'user not active right now Call the admin' });
    }


    const isPasswordValid = await user.isPasswordValid(value.password);
    if (!isPasswordValid) {
      logger.error('Invalid username or password');
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    if (!user.isVerified) return res.status(403).json({ token: user.signTempJWT() });

    securityModule.buildTicket(user, function (token) {
      logger.info('Login Successfully', { req });
      return res.status(200).json(
        {
          token,
          userData: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.profileImage,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            birthday: user.birthday,
            offers: user.offers,
            favoritePlaces: user.favoritePlaces,
            favoriteEvents: user.favoriteEvents,
            role: user.role,
            placeId: user.placeId ? user.placeId : undefined
          }
        });
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = login;