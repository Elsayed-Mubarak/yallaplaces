const User = require('../../components/user/user.model');
// const Roles = require('../../static_arch/roles');
const Logger = require('../../modules/logger.js');


module.exports = async function () {
  try {
    let superadmin = await User.findOne({ role: 'superadmin' });

    if (superadmin) {
      Logger.trace('highlight', 'seeds/superadmin', 'superadmin already initialized', true);
      return false;
    }

    if (!process.env.SUPER_USERNAME || !process.env.SUPER_PASSWORD) {
      Logger.trace('danger', 'seeds/superadmin', 'superadmin not set - no data ', true);
      return false;
    }

    superadmin = new User;
    superadmin.adaptToAdmin({ email: process.env.SUPER_USERNAME, password: process.env.SUPER_PASSWORD }, 'superadmin');
    await superadmin.save();

    Logger.trace('highlight', 'seeds/superadmin', 'superadmin added...', true);
  } catch (error) {
    console.log(error);
    Logger.trace('danger', 'seeds/superadmin', 'superadmin not set - error', true);
  }
};