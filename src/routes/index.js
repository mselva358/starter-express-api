module.exports = (app) => {

    //--------Express validation ---------//
    const { check, header, validationResult } = require('express-validator');

    //------Common file -----------//
    const auth = require('../utils/auth');
    const AuthorizationValidation = require("../Validation/Authorization-validation")(app);
    const pagination = require('../utils/pagination');

    //------Profile file -----------//
    var ProfileValidation = require('../Validation/profile-validation')(app);
    var ProfileController = require("../controller/profileController")(app);

    //------User file -----------//
    var UserValidation = require("../Validation/user-validation")(app);
    var UserController = require("../controller/userController")(app);
    const UserModels = require('../models/user');

    try {
        //-------Profile controller ------------//
        // Retrieve profile by id
        app.get("/user/profile/:id", AuthorizationValidation.Authorization, auth(), ProfileController.findoneprofile);
        // Update profile by id
        app.put("/user/profile/:id", auth(), ProfileController.updateprofile);

        //-------User controller ------------//
        // Create a new User
        app.post("/user/register", UserValidation.register, UserController.register);
        // Login
        app.post("/user/login", UserValidation.login, UserController.Login);
        // Social Login
        app.post("/user/sociallogin", UserValidation.sociallogin, UserController.sociallogin);
        // Forgot password
        app.post("/user/forgotpassword", UserValidation.forgotpassword, UserController.forgotpassword);
        // Resend reset password code
        app.post("/user/resend", UserValidation.resend, UserController.resend);
        // Reset password
        app.put("/user/resetpassword", UserValidation.resetpassword, UserController.resetpassword);
        // Change password
        app.put("/user/changepassword", UserValidation.changepassword, auth(), UserController.changepassword);
        // Refresh Authentication token
        app.post("/refresh_token", UserValidation.refresh_token, UserController.refresh_token);
        // Retrieve all users
        app.get("/users", AuthorizationValidation.Authorization, auth(), pagination(UserModels.User), UserController.userlist);
        // Retrieve a single User with userId
        app.get("/user/:id", auth(), UserController.singleUser);
        // Logout User
        app.post("/user/logout", UserController.logout);
        // Delete a User with userId
        app.delete("/user/:id", UserController.deletesingleuser);
        // Delete all Users
        app.delete("/users", UserController.deleteusers);

    } catch (error) {
        res.sendStatus(403).json({
            message: "Unauthroized access",
            status: false
        });
    }
}