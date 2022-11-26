const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const config = require('./config/config.json');

const InitiateMongoServer = require("./db.js");

// Initiate Mongo Server
InitiateMongoServer();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// default route
app.get('/', function (req, res) {
  return res.send({ error: true, message: 'Hello' })
});

// require('./utils/passport.js');

// require('./utils/pagination.js');

// require("./routes/users.js")(app);
// require("./routes/profiles.js")(app);
require("./routes/index")(app);

// environment variables
process.env.NODE_ENV = 'development';

// set port, listen for requests
const PORT = process.env.PORT || config.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// var ffi = require('ffi-napi');
// var ref = require("ref");

// typedefs
// var myobj = ffi.types.void;// we don't know what the layout of "myobj" looks like
// var myobjPtr =  ref (myobj);
 
// var libm = ffi.Library('B2R', {
//   "print_usage":[ [] ]
// });
// libm.print_usage();
 
// // You can also access just functions in the current process by passing a null
// var current = ffi.Library(null, {
//   'atoi': [ 'int', [ 'string' ] ]
// });
// current.atoi('1234'); // 1234