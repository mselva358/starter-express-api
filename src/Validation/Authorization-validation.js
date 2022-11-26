module.exports = function (app) {
    const { check,header, validationResult } = require('express-validator');

    var validator = {};

    // Retrieve profile by id
    validator.Authorization = [
        header('Authorization', 'Authorization header missing').not().isEmpty(),
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