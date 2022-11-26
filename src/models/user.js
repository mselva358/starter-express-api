var mongoose = require('mongoose');

const Counter = require('../models/counter');

var generator = require('generate-password');

var userSchema = mongoose.Schema({
  sno: { type: Number },
  mobileNo: { type: String, required: true, length: 10, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String, required: true, default: generator.generate({
      length: 30,
      numbers: true
    })
  },
  deviceId: { type: String },
  deviceToken: { type: String },
  countryCode: { type: String },
  type: { type: String },
  referredCode: { type: String },
  isFacebookLogin: {type: Boolean, default: false},
  isGoogleLogin: {type: Boolean, default: false},
  isAppleLogin: {type: Boolean, default: false},
  isEmailVerified: {type: Boolean, default: false},
  isCOD: {type: Boolean, default: true},
  isPushNotification: {type: Boolean, default: true},
  isInstalled: {type: Boolean, default: false},
  isReferred: {type: Boolean, default: false},
  created: {type: Number},
  notificationUnreadCount: {type: Number},
  wallet: {type: Number},
  avgRating: {type: Number},
  profilePicture: {type: String},
  status: {type: String},
  codBlockComment: {type: String},
  referralCode: {type: String},
  referredBy: {type: String},
  fullMobileNo: {type: String},
  addresses: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  preferedHawkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hawker' }],
  reseller: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reseller' }],
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now }
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.id
  }
});

const error = require('../error/error');

const Profile = require('../models/profile');
const { update } = require('../models/counter');

userSchema.pre('save', function (next) {
  var doc = this;
  User.find( { $or: [{ email: doc.email} , { mobileNo: doc.mobileNo }] }, function (err, docs) {
    if (!docs.length) {
      Counter.findByIdAndUpdate('user_id', { $inc: { seq: 1 } }, { "upsert": true, "new": true }, function (err, counter) {
        if (err)
          return next(error);
        doc.sno = counter.seq;
        doc.created = Date.now();
        next();

        // const newProfile = new Profile({
        //   name: doc.name,
        //   email: doc.email,
        //   user_id: counter.seq
        // });

        // newProfile
        //   .save()
        //   .then(result => {
        //   })
        //   .catch(err => {
        //     console.log('Error', err);
        //   });
      });
    } else {
      if (docs[0]._id == doc._id) {
        doc.updated_at = Date.now();
        next();
      } else {
        console.log('User already exists: ', doc.email);
        next(new error.AlreadyReported('User already exists'));
      }
    }
  });
});

var User = mongoose.model('User', userSchema);

module.exports = { User };