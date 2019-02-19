var config = require('../../../../config/config')
var request = require('request');
var TBL_USER = require('../schemas/userSchema');
var bcrypt = require('bcryptjs');
var user = {
    verificationUrl: function(req) {
        return "https://www.google.com/recaptcha/api/siteverify?secret=" + config.GOOGLE_CAPTCHA_KEY + "&response=" + req.body.google_auth_token + "&remoteip=" + req.connection.remoteAddress;
    },

    register : function(req,res,next){

        req.checkBody('email').notEmpty().withMessage('email is required.')
                            .isEmail().withMessage('Please add correct email format.')
                            .isUnique('email').withMessage('Email already in use.');
        req.checkBody('password').notEmpty().withMessage('Password is required.')
        .isLength({min:5,max:15}).withMessage('Password should be at least 5 characters but not more than 15.');
        
        //req.checkBody('google_auth_token').notEmpty().withMessage('Google captcha authenticated is required.');
        
        req.getValidationResult().then(function(result){
            var errorArr = [];
            if (result.isEmpty() === false) {
                result.array().forEach((error) => {
                    errorArr.push(error.msg);
                });
                let send_data = { success: false, message: "Input validation Error",error: errorArr };
                return res.status(400).json(send_data);
            }else{
                // var verificationUrl = module.exports.verificationUrl(req);
                // request(verificationUrl,function(error,response,body) {
                //     var body = JSON.parse(body);
                //     if(body.success !== undefined && !body.success) {
                //         let send_data = { success:false, message: "Captcha verification failed.",error: "Captcha verification failed" };
                //         return res.status(400).json(send_data);
                //     }else{
                //         next();
                //     }
                // })
                next();
            }
        });
        const unhandledRejections = new Map();
        process.on('unhandledRejection', (reason, p) => {
            unhandledRejections.set(p, reason);
        });
        process.on('rejectionHandled', (p) => {
            unhandledRejections.delete(p);
        });
    },

    login : function(req,res,next){
        req.checkBody('useremail').notEmpty().withMessage('email is required.')
        .isEmail().withMessage('Please enter valid email format.');        
        req.checkBody('userpass').notEmpty().withMessage('Password is required.')
            .isLength({min:5,max:15}).withMessage('Password should be at least 5 characters but not more than 15.');        
        // req.checkBody('google_auth_token').notEmpty().withMessage('You must will authenticated by captcha to access login.');        
            req.getValidationResult().then(async function(result){
            var errorArr = [];
            if (result.isEmpty() === false) {
                result.array().forEach((error) => {
                    errorArr.push(error.msg);
                });
                let send_data = {success:false,status:400,message:"Input validation Error",error:errorArr};
                return res.json(send_data);
            }else{
                var verificationUrl = module.exports.verificationUrl(req);

                var isEmailExist = await TBL_USER.count({where: {email: req.body.useremail}});
                if(!isEmailExist){
                    let send_data = {success:false,status:400,message:"This email doesn't exist.",error:"This email doesn't exist."};
                    return res.send(send_data);
                }

                var uData = await TBL_USER.findOne({where: {email_status: 1,email: req.body.useremail}});
                if(uData == null){
                    let send_data = {success:false,status:400,message:"Your email has not been verified.",error:"Your email has not been verified."};
                    return res.send(send_data);
                }

                var hashPassword = uData.dataValues.password;
                var isVerifyPass = await bcrypt.compare(req.body.userpass,hashPassword);

                if(!isVerifyPass){
                    let send_data = {success:false,status:400,message:"Incorrect Username or Password. Please try again!",error:"Incorrect Username or Password. Please try again!"};
                    return res.send(send_data);
                }

                // request(verificationUrl,function(error,response,body) {
                //     var body = JSON.parse(body);
                //     if(body.success !== undefined && !body.success) {
                //         let send_data = {success:false,status:400,message:"Captcha verification failed.",error:"Captcha verification failed."};
                //         return res.send(send_data);
                //     }else{
                //         next();
                //     }

                // })
                next();
            }

        });
        const unhandledRejections = new Map();
        process.on('unhandledRejection', (reason, p) => {
            unhandledRejections.set(p, reason);
        });
        process.on('rejectionHandled', (p) => {
            unhandledRejections.delete(p);
        });
    }
}
module.exports = user;