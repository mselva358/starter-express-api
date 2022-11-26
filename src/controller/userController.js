
module.exports = app => {

    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");
    const generator = require('generate-password');
    const UserModels = require('../models/user');
    const config = require('../config/config.json');
    const tokenList = {};
    const Transporter = require('../utils/email_transporter');
    const randomize = require('randomatic');

    var controller = {};

    controller.register = async (req, res) => {
        const newUser = new UserModels.User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
            mobileNo: req.body.mobileNo,
            deviceId: req.body.deviceId,
            deviceToken: req.body.deviceToken,
            countryCode: req.body.countryCode,
            type: req.body.type,
            referredCode: req.body.referredCode,
        });

        const salt = await bcrypt.genSalt(10);

        if (!req.body.password) {
            newUser.password = await bcrypt.hash(generator.generate({
                length: 30,
                numbers: true
            }), salt);
        } else {
            newUser.password = await bcrypt.hash(req.body.password, salt);
        }

        try {
            const result = await newUser.save();
            const payload = {
                user: {
                    id: result._id
                }
            };

            const token = jwt.sign(payload, config.secret, { expiresIn: config.tokenLife });
            const refreshToken = jwt.sign(payload, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife });

            const response = {
                token: token,
                refreshToken: refreshToken
            };
            tokenList[refreshToken] = response;
            res.status(201).json({
                message: "Your account has been created successfully",
                // data: result,
                // token: response.token,
                // refreshToken: response.refreshToken,
                data: {

                },
                status: true,
                statusCode: 201
            });

        } catch (err) {
            console.log(err);
            res.status(err.status).json({
                message: err.message,
                status: false,
                statusCode: err.statusCode
            });
        }
    };

    controller.Login = async (req, res) => {
        let user = await UserModels.User.findOne({
            email: req.body.email
        });

        if (!user)
            return res.status(400).json({
                message: "User Not Exists",
                status: false
            });
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch)
            return res.status(403).json({
                message: "Please enter the correct password",
                statusCode: 403,
                type: "INCORRECT_PASSWORD"
            });

        const payload = {
            user: {
                id: user._id
            }
        };

        const token = jwt.sign(payload, config.secret, { expiresIn: config.tokenLife });
        const refreshToken = jwt.sign(payload, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife });

        const response = {
            token: token,
            refreshToken: refreshToken
        };
        tokenList[refreshToken] = response;
        user.fullMobileNo = user.countryCode+user.mobileNo;

        Object.keys(user).forEach(function (key) {
            if (user[key] === 'deviceId' || user[key] === 'deviceToken' || user[key] === 'password') {
                delete user[key];
            }
        });

        res.status(200).json({
            message: "Logged In successfully.",
            data: {
                token: response.token,
                refreshToken: response.refreshToken,
                result: user
            },
            statusCode: 200
        });
    };

    controller.sociallogin = async (req, res) => {
        let user = await UserModels.User.findOne({
            email: req.body.email
        });

        if (!user)
            return res.status(400).json({
                message: "User Not Exists",
                status: false
            });

        const payload = {
            user: {
                id: user._id
            }
        };

        const token = jwt.sign(payload, config.secret, { expiresIn: config.tokenLife });
        const refreshToken = jwt.sign(payload, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife });

        const response = {
            token: token,
            refreshToken: refreshToken
        };
        tokenList[refreshToken] = response;
        res.status(200).json({
            message: "User loggedin successfully",
            data: user,
            token: response.token,
            refreshToken: response.refreshToken,
            status: true
        });
    };

    // Forgot password
    controller.forgotpassword = async (req, res) => {
        let user = await UserModels.User.findOne({
            email: req.body.email
        });

        if (!user)
            return res.status(400).json({
                message: "Email address not exists in our database",
                status: false
            });

        const code = randomize('0', 6);

        let mailDetails = {
            from: config.SMTP_EMAIL,
            to: user.email,
            subject: 'SPORTSCREW Reset password code',
            text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
                'Please use the reset password code ' + code + '\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        Transporter.sendMail(mailDetails);

        return res.status(200).json({
            message: "Please check your inbox to reset your password",
            status: true,
            data: code
        });
    };

    // Resend reset password code
    controller.resend = async (req, res) => {
        let mailDetails = {
            from: config.SMTP_EMAIL,
            to: req.body.email,
            subject: 'SPORTSCREW Reset password code',
            text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
                'Please use the reset password code ' + req.body.code + '\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        Transporter.sendMail(mailDetails);

        return res.status(200).json({
            message: "Please check your inbox to reset your password",
            status: true,
            data: req.body.code
        });
    };

    controller.resetpassword = async (req, res) => {
        const salt = await bcrypt.genSalt(10);

        const newPassword = await bcrypt.hash(req.body.password, salt);

        UserModels.User.findOneAndUpdate(
            { "email": req.body.email },
            {
                "$set": {
                    "password": newPassword
                }
            },
            function (err, doc) {
                if (err)
                    return res.status(400).json({
                        message: "Passeord not updated",
                        error: err,
                        status: false
                    });

                return res.status(200).json({
                    message: "Your account password has been reset successfully",
                    status: true
                });
            }
        );
    };

    // Change password
    controller.changepassword = async (req, res) => {
        if (req.authenticated) {

            req.user.password

            const isMatch = await bcrypt.compare(req.body.old_password, req.user.password);

            if (!isMatch)
                return res.status(400).json({
                    message: "Invalid old password",
                    status: false
                });

            const salt = await bcrypt.genSalt(10);

            const newPassword = await bcrypt.hash(req.body.new_password, salt);

            UserModels.User.findOneAndUpdate(
                { "_id": user._id },
                {
                    "$set": {
                        "password": newPassword
                    }
                },
                function (err, doc) {
                    if (err)
                        return res.status(400).json({
                            message: "Passeord not updated",
                            error: err,
                            status: false
                        });

                    return res.status(200).json({
                        message: "Your account password has been changed successfully",
                        status: true
                    });
                }
            );
        } else {
            res.sendStatus(403).json({
                message: "Unauthroized access",
                status: false
            });
        }
    };
    // Refresh Authentication token
    controller.refresh_token = async (req, res) => {
        const token = req.body.token;

        jwt.verify(token, config.refreshTokenSecret, (err, info) => {
            console.log(err)
            if (err) return res.sendStatus(403).json({
                message: "Session expired please login again",
                status: false
            });

            UserModels.User.findById(info.user.id)
                .then(user => {
                    const payload = {
                        user: {
                            id: user._id
                        }
                    };

                    const token = jwt.sign(payload, config.secret, { expiresIn: config.tokenLife });
                    const refreshToken = jwt.sign(payload, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife });

                    const response = {
                        token: token,
                        refreshToken: refreshToken
                    };
                    tokenList[refreshToken] = response;
                    res.status(200).json({
                        token: response.token,
                        refreshToken: response.refreshToken,
                        message: "Token generated",
                        status: true
                    });
                })
                .catch(err => {
                    return res.status(400).json({
                        message: err.message,
                        status: false
                    });
                });
        });
    };

    // Retrieve all users
    controller.userlist = async (req, res) => {
        if (req.authenticated) {
            res.paginatedResults.status = true
            res.paginatedResults.message = "User list"
            res.status(200).json(res.paginatedResults);
        } else {
            res.sendStatus(403).json({
                message: "Unauthroized access",
                status: false
            });
        }
    };

    // Retrieve a single User with userId
    controller.singleUser = async (req, res) => {
        if (req.authenticated) {
            UserModels.User.findById(req.params.id)
                .then(user => {
                    if (!user)
                        return res.status(400).json({
                            message: "User not exists in our database",
                            status: false
                        });
                    return res.status(200).json({
                        message: "User Information",
                        status: true,
                        data: user
                    });
                })
                .catch(err => {
                    return res.status(400).json({
                        message: err.message,
                        status: false
                    });
                });
        } else {
            res.sendStatus(403).json({
                message: "Unauthroized access",
                status: false
            });
        }
    };

    // Logout User
    controller.logout = async (req, res) => {
        res.send({
            message: "Logout Data",
            status: true
        });
    }
    // Delete a User with userId
    controller.deletesingleuser = async (req, res) => {
        res.send({
            message: "Delete user Data =" + req.params,
            status: true
        });
    }
    // Delete all Users
    controller.deleteusers = async (req, res) => {
        res.send(200).json({
            message: "Delete Users Data",
            status: true
        });
    }
    return controller;
}