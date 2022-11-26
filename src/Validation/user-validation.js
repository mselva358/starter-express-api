module.exports = function (app) {
    const { check, header, validationResult } = require('express-validator');

    var validator = {};

    // Create a new User
    validator.register = [
        check("name", "Please Enter Valid Name").not().isEmpty(),
        check("email", "Please enter your email").not().isEmpty(),
        check("mobileNo", "Please enter mobile number").not().isEmpty(),
        check("mobileNo", "Please enter valid mobile number").isMobilePhone(),
        check("countryCode", "Country code cannot be empty").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Password cannot be empty").not().isEmpty(),
        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
            return next();
        }];

    //Login
    validator.login = [
        check("password", "Please enter a your password").not().isEmpty(),
        check("email", "Please enter a your email").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 8
        }),
        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
            return next();
        }];

    //sociallogin
    validator.sociallogin = [
        check("email", "Please enter your email").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("login_type", "Login Type should not be empty").not().isEmpty(),
        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
            return next();
        }];

    //Forgot password
    validator.forgotpassword = [
        check("email", "Please enter your email id to recover").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
            return next();
        }];

    // Resend reset password code
    validator.resend = [
        check("email", "Please enter your email id to recover").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("code", "Code should not be empty").not().isEmpty(),
        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
            return next();
        }];

    // Reset password
    validator.resetpassword = [
        check("email", "Please enter your email id to recover").not().isEmpty(),
        check("password", "Please enter a your password").not().isEmpty(),
        check("password", "Please enter a valid password").isLength({
            min: 8
        }),
        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
            return next();
        }];

    // Change password
    validator.changepassword = [
        header('Authorization', 'Authorization header missing').not().isEmpty(),
        check("old_password", "Please enter a your password").not().isEmpty(),
        check("old_password", "Please enter a correct old password").isLength({
            min: 8
        }),
        check("new_password", "Please enter a your password").not().isEmpty(),
        check("new_password", "Please enter a valid password").isLength({
            min: 8
        }),
        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
            return next();
        }];

        // Refresh Authentication token
    validator.refresh_token = [
        check('token', 'Token field should not be empty').not().isEmpty(),
        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
            return next();
        }];

    return validator;
}