const User = require('../user.model');
const { editProfile: editProfileValidationSchema } = require('../user.validation');
const Logger = require('../../../config/winston.services');
const logger = new Logger('editProfilePic');

async function editProfile (req, res, next) {
  try {
    const { error, value } = editProfileValidationSchema.validate(req.body);
    if (error) {
      logger.error(error.message.replace(/"/g, ''));
      return res.status(400).json({ message: error.message.replace(/"/g, '') });
    }

    const user = await User.findOneAndUpdate({ _id: req.userData._id }, value, { new: true });
    if (!user) {
      logger.error('User is not updated, try again later');
      return res.status(400).json({ message: 'User is not updated, try again later' });
    }
    logger.info('editProfile Successfully', { req });
    return res.status(200).json({
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
        role: user.role
      }
    });

  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = editProfile;