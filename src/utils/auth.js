const config = require('../config/config.json');
const jwt = require("jsonwebtoken");
const { User } = require('../models/user');
var authenticate = function authenticate() {
    return async (req, res, next) => {
        var bearerHeader = req.headers['authorization'];
        var token;
        console.log(bearerHeader);
        req.authenticated = false;
        req.user = {}
        if (bearerHeader) {
            console.log("11111");
            var bearer = bearerHeader.split(" ");
            token = bearer[1];
            try {
                const decoded = jwt.verify(token, config.secret);
                req.authenticated = true
                req.decoded = decoded

                if (Date.now() >= decoded.exp * 1000) {
                    res.sendStatus(403).json({
                        message: "Unauthroized access",
                        status: false
                    });
                } else {
                    return User.findById(decoded.user.id)
                        .then(user => {
                            req.user = user
                            next();
                        })
                        .catch(err => {
                            res.status(500).json({ message: e.message, status: false });
                        });
                }

            } catch (e) {
                if (e.name == 'TokenExpiredError') {
                    res.status(403).json({ message: e.message, status: false });
                } else {
                    res.status(500).json({ message: e.message, status: false });
                }
            }
        } else {
            res.sendStatus(403).json({
                message: "Unauthroized access",
                status: false
            });
        }
    };
};

module.exports = authenticate;