const User = require('../user.model');
const fs = require('fs');
const cloudinary = require('../../../modules/cloudinary');
const Logger = require('../../../config/winston.services');
const logger = new Logger('editProfilePic');

async function editProfilePic (req, res, next) {
  try {
    const targetedUser = await User.findOne({ _id: req.userData._id });
    if (!targetedUser) {
      logger.error(' User not found');
      return res.status(400).json({ message: ' User not found' });
    }

    if (!req.files || !req.files['profilePic']) {
      logger.error('insert images');
      return res.status(400).json({ message: 'insert images' });
    }

    // upload img to cloudinary and save urls to db
    const [file] = req.files['profilePic'];
    const { path } = file;
    const newPath = await cloudinary.upload(path, `${targetedUser.email}/user`);

    targetedUser.profileImage = newPath.url;
    console.log(targetedUser);

    fs.unlink(path, (err) => {
      if (err) {
        logger.error('image not deleted');
        console.log('image not deleted ::  ', path);
      }
    });

    await targetedUser.save();
    logger.info('Image uploaded successfully', { req });
    return res.status(200).json({ message: 'Image uploaded successfully', profileImage: targetedUser.profileImage });


  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = editProfilePic;