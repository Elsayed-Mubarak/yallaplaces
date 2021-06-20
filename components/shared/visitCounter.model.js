const mongoose = require('mongoose');

const visitCountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  visitCount: { type: Number, default: 1 },
  incVisitCountAt: { type: Date, required: true }
});

visitCountSchema.statics.addVisit = async function (userId, placeId = undefined, categoryId = undefined) {
  try {
    let counter = await this.findOne({ userId, placeId, categoryId });
    if (!counter) {
      counter = new this();
      counter.userId = userId;
      counter.placeId = placeId;
      counter.categoryId = categoryId;
      counter.incVisitCountAt = new Date();
      await counter.save();
    } else if (Date.now() - counter.incVisitCountAt > 86400000) { // 86400000 =>day in millisecond
      counter.visitCount = counter.visitCount + 1;
      counter.incVisitCountAt = new Date();
      await counter.save();
    }
  } catch (error) {
    console.log('error from counter:::>>>>:::', error);
  }

};

module.exports = mongoose.model('Visit-Count', visitCountSchema);