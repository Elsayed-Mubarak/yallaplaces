const mongoose = require('mongoose');
const User = require('../../user.model');
const Logger = require('../../../../config/winston.services');
const logger = new Logger('toggleActivation');
async function toggleActivation (req, res, next) {
  try {
    const { adminId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      logger.error('Invalid user ID');
      return res.status(400).send({ message: 'Invalid user ID' });
    }

    const admin = await User.findOne({ _id: adminId, role: 'admin' });
    if (!admin) {
      logger.error('username is invalid');
      return res.status(400).json({ message: 'username is invalid' });
    }

    admin.active = !admin.active;
    // if (method === 'deactive' && admin.active) { admin.active = false; }
    // else if (method === 'active' && !admin.active) { admin.active = true; }
    // else { return res.status(400).json({ message: `admin already ${method}` }); }

    await admin.save();
    logger.info('toggleActivation Successfully', { req });
    return res.status(200).send({ message: `Admin ${(admin.active) ? 'activated' : 'deactivated'} successfully` });

  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = toggleActivation;