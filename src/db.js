const mongoose = require('mongoose');
const config = require('./config/config.json');

// const MONGOURI = 'mongodb+srv://admin:'+config.MONGO_ATLAS_PW+'@sportscrew-1cknl.mongodb.net/sportscrew?retryWrites=true&w=majority';

// const InitiateMongoServer = async () => {
//   try {
//     await mongoose.connect(MONGOURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: false
//     });
//     console.log("Connected to DB !!");
//   } catch (e) {
//     console.log(e);
//     throw e;
//   }
// };
const MONGOURI = 'mongodb+srv://newveg:'+config.MONGO_ATLAS_PW+'@cluster0.9ie3yzx.mongodb.net/test';
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
const InitiateMongoServer = () => {
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log("Connected to DB !!");
  });
};

module.exports = InitiateMongoServer;