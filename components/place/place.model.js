const mongoose = require('mongoose');
const placeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

  logoURL: { url: { type: String }, name: { type: String } },
  coverURL: { url: { type: String }, name: { type: String } },

  galleryURLs: [{
    url: { type: String },
    name: { type: String } // as cloudinary id for removing
  }],
  menuURLs: [{
    url: { type: String },
    name: { type: String } // as cloudinary id for removing
  }],

  offers: [{
    title: { type: String },
    description: { type: String },
    offerImage: { type: String },
    price: { type: Number }
  }],

  contact: {}, // object of contacts like {fb:"link to fb page" , ....}

  totalRate: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },

  rate: {
    type: Number,
    default: 0
  },

  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, {
  timestamps: true,
  usePushEach: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});


// placeSchema.virtual('rate').get(function () {
//   return (this.reviewsCount !== 0) ? (this.totalRate / this.reviewsCount).toFixed(1) : 0;
// });


module.exports = mongoose.model('Place', placeSchema);