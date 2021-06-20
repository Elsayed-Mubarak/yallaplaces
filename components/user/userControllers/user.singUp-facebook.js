const User = require('../user.model');
// const { singUpGmail: signupValidationSchema } = require('../user.validation');
const securityModule = require('../../../security');

async function signUpFacebook (req, res, next) {
  try {

    const checkUser = await User.findOne({ uid: req.body.uid });

    if (checkUser) {
      securityModule.buildTicket(checkUser, function (token) {
        return res.status(200).json(
          {
            token,
            userData: {
              _id: checkUser._id,
              firstName: checkUser.firstName,
              lastName: checkUser.lastName,
              profileImage: checkUser.profileImage,
              email: checkUser.email,
              phone: checkUser.phone,
              gender: checkUser.gender,
              birthday: checkUser.birthday,
              offers: checkUser.offers,
              favoritePlaces: checkUser.favoritePlaces,
              favoriteEvents: checkUser.favoriteEvents,
              placeId: checkUser.placeId ? checkUser.placeId : undefined
            }
          });
      });
    } else {
      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) return res.status(409).json({ message: 'this email registered before' });
      const user = new User();
      await user.adaptToFacebookUser(req.body);
      await user.save();

      securityModule.buildTicket(user, function (token) {
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
              placeId: user.placeId ? user.placeId : undefined
            }
          });
      });
    }


  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = signUpFacebook;