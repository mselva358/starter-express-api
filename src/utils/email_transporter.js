var nodemailer = require('nodemailer');
const config = require('../config/config.json')

var Transporter = nodemailer.createTransport({
    service: config.SMTP_SERVICE,
    auth: {
        user: config.SMTP_EMAIL,
        pass: config.SMTP_PWD
    }
});

module.exports = Transporter;