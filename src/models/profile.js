var mongoose = require('mongoose');

const Counter = require('../models/counter');

// const Sport = require('../models/sport');

var profileSchema = mongoose.Schema({
  _id: { type: Number },
  user_id: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String },
  profile_image: { type: String },
  dob: { type: Date },
  current_location: { type: String },
  user_role: { type: mongoose.Schema.Types.ObjectId, ref: 'UserRole' },
  interested_sports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sport' }],
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now }
});

profileSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.id
  }
});

const error = require('../error/error');

profileSchema.pre('save', function (next) {
  var doc = this;
  Profile.find({ user_id: doc.user_id }, function (err, docs) {
    if (!docs.length) {
      Counter.findByIdAndUpdate('profile_id', { $inc: { seq: 1 } }, { "upsert": true, "new": true }, function (err, counter) {
        if (err)
          return next(error);
        doc._id = counter.seq;
        next();
      });
    } else {
      if (docs[0]._id == doc._id) {
        doc.updated_at = Date.now();
        next();
      } else {
        console.log('Profile already exists: ', doc.user_id);
      }
    }
  });
});

var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;