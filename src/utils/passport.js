const passport = require('passport');
const { User } = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const config = require('../config/config.json')
const error = require('../error/error');

passport.use(new LocalStrategy({
    usernameField: 'email',
},
    function (email, cb) {
        return User.findOne({ email })
            .then(user => {
                if (!user) {
                    return cb(null, false, { message: 'Incorrect email' });
                }
                return cb(null, user, { message: 'Logged In Successfully' });
            })
            .catch(err => cb(err));
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
},
    function (jwtPayload, cb) {
        if (Date.now() >= jwtPayload.exp * 1000) {
            return cb(new error.Unauthorized('Unauthorized access'), null);
        } else {
            return User.findById(jwtPayload.user.id)
                .then(user => {
                    return cb(null, user);
                })
                .catch(err => {
                    return cb(err);
                });
        }
    }
));