const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  placeId: { type: mongoose.Types.ObjectId, ref: 'Place', required: true },
  rate: { type: Number, required: true },
  comment: { type: String },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);