'use strict';
const nodemailer = require('nodemailer');
var config = require('../config/config');

let transporter = nodemailer.createTransport({
    host: config.SMTP_HOST, // '',
    port: config.SMTP_PORT ,//2525,
    secure: false, // true for 465, false for other ports
    auth: { 
        user: config.SMTP_USER, // "apikey", // generated ethereal user
        pass: config.SMTP_PASSWORD //""  // generated ethereal password
    }
});
transporter.verify(function(error, success) {
    if (error) {
         console.log(error);
    }
 });


module.exports.transporter = transporter;