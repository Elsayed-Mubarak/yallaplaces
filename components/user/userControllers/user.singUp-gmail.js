const User = require('../user.model');
const { singUpGmail: signupValidationSchema } = require('../user.validation');
const securityModule = require('../../../security');

async function signUpGmail (req, res, next) {
  try {
    const { error, value } = signupValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });

    const userExists = await User.findOne({ email: value.email });

    if (userExists) {
      const checkUser = await User.findOne({ $and: [{ email: value.email }, { uid: value.uid }] });
      if (!checkUser) return res.status(409).json({ message: 'this email registered before' });
      else {
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
      }
    } else {
      const user = new User();
      await user.adaptToGmailUser(value);
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

module.exports = signUpGmail;