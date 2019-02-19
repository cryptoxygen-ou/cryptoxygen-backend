var express = require('express');
var router = express.Router();
var db = require('../../../config/db');
var userController = require('./controllers/userController');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var userValidator = require('./validation/user_validator');
var expressValidator = require('express-validator');
Users = db.connection.define('users');
router.use(expressValidator({
    customValidators: {
     isUnique (value,key) {
        var checkObj = {};
        checkObj[key] = value;
        return new Promise((resolve, reject) => {
            Users.findOne({where:checkObj})
            .then(response=>{
                if(response == null) { resolve(); }
                else{reject(); } })
            .catch((err)=>{
                throw err; 
         }); });
    }}
}));
router.post('/register',userValidator.register, userController.register);
router.post('/login',userValidator.login,userController.login);
router.post('/kycdetail',userController.kycdetail);
router.post('/kycinsert',passport.authenticate('jwt', {session:false}),userController.kycinsert);
router.post('/kycupdate',passport.authenticate('jwt', {session:false}),userController.kycupdate);
router.post('/getaddress',passport.authenticate('jwt', {session:false}),userController.getaddress);
router.post('/getcoinprice',userController.getcoinprice);
router.post('/updatedoc',passport.authenticate('jwt', {session:false}),userController.updatedoc);
router.post('/noncepay',passport.authenticate('jwt', {session:false}),userController.noncepay);
router.post('/web_hook',userController.web_hook);
router.post('/gettransactions',passport.authenticate('jwt', {session:false}),userController.gettransactions);
router.post('/forgotPassword',userController.forgotPassword);
router.post('/resetPassword',userController.resetPassword);
router.post('/getcoinpriceOnline',userController.getcoinpriceOnline);
router.post('/getusertoken',passport.authenticate('jwt', {session:false}),userController.getusertoken);
router.post('/userErcAddress',passport.authenticate('jwt', {session:false}),userController.userErcAddress);
router.post('/updateErcAddress',passport.authenticate('jwt', {session:false}),userController.updateErcAddress);
router.post('/getcoinTotalcollection',passport.authenticate('jwt', {session:false}),userController.getcoinTotalcollection);
router.post('/getcoinsum',userController.getcoinsum);
router.post('/getSmartAddress',passport.authenticate('jwt', {session:false}),userController.getSmartAddress);
router.post('/getsoftcap',userController.getsoftcap);
router.post('/verifymail',userController.verifymail);

//Get eth address if not generated yet, Dev-S, oct-24-2018
router.get('/cryptowallet',passport.authenticate('jwt', {session:false}),userController.requestEthAddress);

router.post('/feedback',passport.authenticate('jwt', {session:false}),userController.feedback);
router.post('/contact',userController.contact);
//Fetch list of all country codes
router.get('/fetchcountrycodes',userController.fetchCountryPhoneCodes)
//router.post('/updateselfie',passport.authenticate('jwt', {session:false}),userController.updateselfie);

//Resend verification email
router.post('/resendverifyemail',userController.resendVerifyEmail);

//Email to user for creditcard payment
router.get('/creditcardEmail',passport.authenticate('jwt', {session:false}),userController.creditcardEmail);

//Mobile get latest price ltc, btc, eth
router.post('/getcoinpriceonline_mobile',userController.getcoinpriceonline_mobile);
//Payeezy payment Credit Card
router.post('/capture_card_payment',passport.authenticate('jwt', {session:false}),userController.capture_card_payment);
//Google 2FA QR code
router.post('/google2fa',passport.authenticate('jwt', {session:false}),userController.google2faQR);
//Goofle 2FA QR code validate
router.post('/google2favalidate',passport.authenticate('jwt',{session:false}),userController.google2faValidate)
//Google validate 2FA login
router.post('/google2falogin',passport.authenticate('jwt',{session:false}),userController.google2faLogin)
//Google 2FA authentication lost
router.post('/google2falost',passport.authenticate('jwt',{session:false}),userController.google2faLost)
//Disable Google 2FA
router.post('/google2fadisable',passport.authenticate('jwt',{session:false}),userController.google2faDisable)
//Check Google 2fa status
router.post('/google2fastatus',passport.authenticate('jwt',{session:false}),userController.google2faStatus)

module.exports = router;