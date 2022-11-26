module.exports = (app) => {
    const Profile = require('../models/profile');

    var controller = {};

    // Retrieve profile by id
    controller.findoneprofile = async (req, res) => {
        if (req.authenticated) {
            let profile = await Profile.findOne({
                user_id: req.params.id
            });
            if (!profile)
                return res.status(400).json({
                    message: "User not exists in our database",
                    status: false
                });
            return res.status(200).json({
                message: "User Profile",
                status: true,
                data: profile
            });
        } else {
            res.sendStatus(403).json({
                message: "Unauthroized access",
                status: false
            });
        }
    }

    controller.updateprofile = async (req, res) => {
        if (req.authenticated) {
            Profile.findById(req.params.id).then(profile => {
                profile.name = req.body.name != null ? req.body.name : profile.name;
                profile.gender = req.body.gender != null ? req.body.gender : profile.gender;
                profile.profile_image = req.body.profile_image != null ? req.body.profile_image : profile.profile_image;
                if (req.body.dob != null) {
                    let dob = new Date(req.body.dob);
                    profile.dob = dob;
                }
                profile.current_location = req.body.current_location != null ? req.body.current_location : profile.current_location;
                profile.save();
            }).then(result => {
                console.log('Profile updated');
                return res.status(200).json({
                    message: "Your profile has been updated successfully",
                    data: result,
                    status: true
                });
            }).catch(err => {
                return res.status(400).json({
                    message: "Profile not updated",
                    error: err,
                    status: false
                });
            })
        } else {
            res.sendStatus(403).json({
                message: "Unauthroized access",
                status: false
            });
        }
    }

    return controller;
}