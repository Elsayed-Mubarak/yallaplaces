const Config = require('../../config');
const Session = require('../../security/session.model');
const timeFactory = require('../../modules/time-factory.js');
const Logger = require('../../modules/logger.js');

module.exports = function (CronJob) {


  const job = new CronJob({
    // runs every day at 3:00:00 AM
    // cronTime: '00 00 03 * * 6'
    // running on Sundays of September 
    // cronTime: '* * * Sep Sun'

    // delete every hour blocked sessions
    cronTime: '0 */59 * * * *',
    onTick () {
      Logger.trace('highlight', 'SESSION/ CRONJOB', `cronjob 🕒 ${new Date()}`);
      Logger.trace('info', 'session/cronjob', `removeling less than ${timeFactory.cal('remove', 5, 'minutes', new Date())}`);

      // keep active session during the last 5000 hours
      // const d = timeFactory.cal('remove', 5000, 'hours', new Date()).toISOString();
      Session.find({ $or: [{ 'usage.blocked': true }, { 'usage.total': { $gte : 1500 } }] }).remove().exec();
      // Session.find({ updatedAt: { $lt: d } }).remove().exec();
    },
    start: false,
    timeZone: Config.timeZone
  });
  job.start();

};