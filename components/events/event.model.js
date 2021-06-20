const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  type: { type: String, default: '' },
  description: { type: String, default: '' },
  title: { type: String, required: true },
  price: { type: Number, default: 0 },
  eventImage: { type: String, default: '' },

  startAt: { type: Date, default: '' },
  endAt: { type: Date, default: '' },

  location: {
    lat: { type: String, default: '' },
    long: { type: String, default: '' },
    city: { type: String },
    area: { type: String },
    street: { type: String },
    building: { type: String },
    floor: { type: String },
    address: { type: String, default: '' }
  },

  active: { type: Boolean, default: true },

  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,
  usePushEach: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});


module.exports = mongoose.model('Event', eventSchema);