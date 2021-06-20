const mongoose = require('mongoose');
const menuItemSchema = new mongoose.Schema({
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  category: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  price: { type: String },
  duration: { type: String },
  restrictions: { type: String },
  roomType: { type: String },
  roomSize: { type: String },
  membershipType: { type: String },
  coach: { type: String },
  policies: { type: String },

  type: { type: String },


  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  usePushEach: true
});



module.exports = mongoose.model('menuItem', menuItemSchema);