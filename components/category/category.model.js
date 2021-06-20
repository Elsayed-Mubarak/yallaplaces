const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  imgUrl: { type: String, required: true },
  icon: { type: String }, // url of icon
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastEditBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);