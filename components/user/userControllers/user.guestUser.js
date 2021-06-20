const securityModule = require('../../../security');
const User = require('./../user.model');

async function guestToken (req, res, next) {
  try {
    const value = {
      firstName: 'guest',
      lastName: 'guest',
      profileImage: '',
      email: 'guest@guest.com',
      phone: 'guest@guest.com',
      password: 'guest@guest@guest!',
      gender: 'anon',
      offers: [],
      favoriteCategories: [],
      favoritePlaces: [],
      favoriteEvents: [],
      role: 'user'
    };

    let user = await User.findOne({ email: value.email });
    if (!user) {
     user = await User.create(value);
     console.log(user);
    }
    
    await securityModule.buildTicket(user, function (token) {
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
            offers: user.offers,
            favoritePlaces: user.favoritePlaces,
            favoriteEvents: user.favoriteEvents,
            role: user.role,
            placeId: user.placeId ? user.placeId : undefined
          }
        });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = guestToken;