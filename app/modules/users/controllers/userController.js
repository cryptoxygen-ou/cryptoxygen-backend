var config = require('./../../../../config/config');
//var SquareConnect = require('square-connect');
var randomString = require('random-string');
var Web3Utils = require('web3-utils')

var siteurl = config.SITE_URL;
var baseUrl = config.BASE_URL;
var bccEmails = config.BCC_EMAILS;

/**
 * Square payment gateway
 */
//  var SquareAcessToken = "sandbox-sq0atb-MJE-dmIz_8GZNaHiLJQ3-Q"
//  var SquareLocationID = "CBASEEH7toRD1CPOYAGVWbxeJVogAQ"


/**
 * BitGo Wallet ids
 */ 
// const coin_prefix = config.BITGO_COIN_PREFIX;
// const ethWalletId = config.BITGO_ETH_WALLET_ID;
// const accessToken = config.BITGO_ACCESS_TOKEN;

/**
 * BitGo API url
 * test: https://test.bitgo.com/api/v2/
 * live: https://bitgo.com/api/v2/
 */ 
//const bitgoAPI = config.BITGO_API_URL;

//Square payment gateway
//var SquareAcessToken = "sq0atp-4pkjYyV-IgRS6APL9Y6McQ354"
//var SquareLocationID = "080JBJFMXE40634254"


var helper = require('../helpers/helper');
var db = require('../../../../config/db');
const request = require('request');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var mailer = require('../../../../config/mailer');
var bcrypt = require('bcryptjs');
var Hashids = require('hashids');
var TBL_USER = require('../schemas/userSchema');
var TBL_PROFILE = require('../schemas/userProfileSchema');
var TBL_KYC = require('../schemas/userkycSchema');
var BTC_TABLE = require('../schemas/btcSchema');
var LTC_TABLE = require('../schemas/ltcSchema');
var ETH_TABLE = require('../schemas/ethSchema');
var TABLE_ALOTMENT = require('../schemas/addressSchema');
var TABLE_ICO = require('../schemas/icoSchema');
var BTC_TRANS = require('../schemas/btcTransaction');
var ETH_TRANS = require('../schemas/ethTransaction');
var LTC_TRANS = require('../schemas/ltcTransaction');
var USR_COL = require('../schemas/userCollection');
var ERC = require('../schemas/userercSchema');
var SMART_CONT = require('../schemas/smartContract');
var SOFTCAP = require('../schemas/softcap');
var PAYMENT = require('../schemas/payment');
var ETHIDS = require('../schemas/ethIds');
var FEEDBACK = require('../schemas/feedback');
var TBL_CountryCode = require('../schemas/countryPhoneCodesSchema');
var currentUTCDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
var Sequelize = require('sequelize');
//google authentication 2FA
var speakeasy   = require('speakeasy');
var QRCode      = require('qrcode')

//S3 image upload
var AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: config.ACCESS_KEY,
    secretAccessKey: config.SECRET_KEY
});

//ETH
var ethController = require('../../eth/controllers/ethController');

/*
* Payeezy payment gateway details
*/
// var env = 'sandbox' //live
// if(env=='sandbox'){
//     var apikey = 'cA7HWc1WmH6AIKcs2AlKZAGPau9Frnmv';
//     var apisecret = '352f1c48df0cf34a2a79ee70785f037bcb9c45503e16be36ed7330a61420a766';
//     var merchant_token = 'fdoa-735b157ab55e25cb017c3b133286e049735b157ab55e25cb';
//     var host = "api-cert.payeezy.com";
// }else if(env=='live'){
//     var apikey = '';
//     var apisecret = '';
//     var merchant_token = '';
//     var host = "api.payeezy.com";
// }
// var payeezy = require('payeezy')(apikey, apisecret, merchant_token);
// payeezy.version = "v1";
// payeezy.host = host;



//register as a user
var usersController = {

    register : function(req,res,next){

        plainPassword = req.body.password;
        hashPassword = bcrypt.hashSync(plainPassword,8);

        //prevent script injection
        var errorArr = ["Please add valid inputs"];
        if(req.body.firstName.indexOf("script") > -1) {
            return ReE(res,400,"Please add valid inputs",errorArr);
        }else if(req.body.lastName.indexOf("script") > -1) {
            return ReE(res,400,"Please add valid inputs",errorArr);
        }else if(req.body.phone.indexOf("script") > -1) {
            return ReE(res,400,"Please add valid inputs",errorArr);
        }else if(req.body.country.indexOf("script") > -1) {
            return ReE(res,400,"Please add valid inputs",errorArr);
        }else if(req.body.email.indexOf("script") > -1) {
            return ReE(res,400,"Please add valid inputs",errorArr);
        }
        var currentUTCDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var name_usr = req.body.firstName;
        var myid = ''
        var NewUser = {
            password :hashPassword,
            email : req.body.email,
            email_status : 0,
            user_status : 1,
            createdAt : currentUTCDateTime,
            updatedAt : currentUTCDateTime
        }
        console.log("New user array is",NewUser);
        var userObj = {};

        TBL_USER.create(NewUser)
        .then((response) => {
            this.userObj = response;
        })
        .then(() => {
           
            TBL_PROFILE.create({
                user_id :   this.userObj.id,
                f_name  :   req.body.firstName,
                l_name  :   req.body.lastName,
                phone   :   req.body.phone,
                country :   req.body.country,
                createdAt : this.userObj.created_at,
                updatedAt : this.userObj.updated_at
            }).then((user) => {

            // ------------------------- ETH ADDRESS ----------------------------
            //var account = await ethController.get_address();

            // console.log("eth address")
            // var options2 = {
            //     url: bitgoAPI+coin_prefix+'eth/wallet/'+ethWalletId+'/address',
            //     headers: {
            //     Authorization: 'Bearer '+accessToken,
            //     },
            //     method: 'POST'
            // };
            // request( options2, function (err, res1, body) {
            //     if (err) { console.log(err); }
            //            //console.log("eth address live bitgo request")
            //            //console.log(body)

            //             body =  JSON.parse(body);
            //             var eth_address_id = body.id
            //             //console.log(bitgoAPI+coin_prefix+'eth/wallet/'+ethWalletId+'/address/'+eth_address_id)

            //             ETHIDS.create({
            //                 user_id :   user.dataValues.user_id,
            //                 ethid:body.id,
            //                 createdAt : user.dataValues.createdAt,
            //                 updatedAt : user.dataValues.updatedAt
            //             })

            //           setTimeout(function(){
            //             var options3 = {
            //                 url: bitgoAPI+coin_prefix+'eth/wallet/'+ethWalletId+'/address/'+eth_address_id,
            //                 headers: {
            //                 Authorization: 'Bearer '+accessToken,
            //                 },
            //                 method: 'GET'
            //             };
            
            //             request( options3, function (err, res1, bodyAdd) {
            //                 if (err) {  
            //                     console.log("error occured here")
            //                        console.log(err); }
            
            //                         bodyAdd =  JSON.parse(bodyAdd);            
            //                         //console.log(bodyAdd)
            //                         var ETH_ADD = {
            //                             address :bodyAdd.address,
            //                             alloted : 1,
            //                             allotted_date : user.dataValues.createdAt,
            //                             createdAt : user.dataValues.createdAt,
            //                             updatedAt : user.dataValues.updatedAt
            //                         }
            //                         var ethObj = {};
                            
            //                         ETH_TABLE.create(ETH_ADD)
            //                         .then((responseeth) => {
            //                             this.ethObj = responseeth;
            //                         })
            //                         .then(() => {
            //                         TABLE_ALOTMENT.create({
            //                             user_id :   user.dataValues.user_id,
            //                             address_id : this.ethObj.id,
            //                             address_type:'eth',
            //                             createdAt : user.dataValues.createdAt,
            //                             updatedAt : user.dataValues.updatedAt
            //                         }).then((test1) => { })
            //                     })
            //             })

            //           },160000)
            //             // now get address using this id
            //     })



                var hashids = new Hashids("mySalt",16);               

                let mailOptions = {
                    from: '"Cryptoxygen" <support@cryptoxygen.io>', // sender address
                    to: NewUser.email, // list of receivers
                    bcc: bccEmails,
                    subject: 'Cryptoxygen - Confirmation', // Subject line
                    text: 'Hello world? account created successfully ', // plain text body
                    html: ` <h3>Dear `+name_usr+`,</h3>
                            <p>The Cryptoxygen Team would like to Thank You for becoming an early supporter of our platform and acquiring your ERC20 Tokens! Please ensure that you have entered a valid ERC20 Ethereum address in the "Buy Tokens" Panel on our website. This ensures your tokens are delivered to the right address! All ERC20 Tokens will be delivered after the end of our Public Sale This is to protect the integrity of our platform during our launch and not allow price manipulation seen with other recent token sales.</p>
                            <p>Until then make sure to familiarize yourself with our White Paper and Roadmap! If you decide you would like more tokens you can buy them at anytime by clicking on the 'Buy Tokens' option on our website. Please go follow us on social media @cryptoxygen for constant updates on our development and platform news!</p>
                            <p>Please click on below link to verify your email.</p>
                            <p><a href="`+siteurl+`/verifymail/`+hashids.encode(user.dataValues.user_id)+`">Click to verify</a></p>
                            <br>
                            <p>Until Next Time,</p>
                            <p>The Cryptoxygen Team</p>
                    ` // html body
                };
                mailer.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {console.log(error); }
                });
               
                const token = jwt.sign({id:this.userObj.id,name:user.f_name,last_name:user.l_name,country:user.country,phone:user.phone}, config.SECRET, {
                });
               
                Data = { user_id:this.userObj.id, email : this.userObj.email,username : this.userObj.username,name : user.name  }
                return ReS(res,200,"User registered successfully",Data,'JWT '+token);
            }).catch((err) => {
                return ReE(res,400,"Something went wrong",err.errors[0].message);
            });
        })
        .catch((err) => {
            return ReE(res,400,"Something went wrong",err.errors[0].message);
        });
    },

//login User
    login : async function(req,res,next){
        var NewUser = {
            email : req.body.useremail,
            password : req.body.userpass
        }
        
        var UserObj = {};
        var vData = await TBL_USER.findOne({where: {email: NewUser.email}})
        // .then( async(user) => {
        if( vData == null ){
            return ReE(res,400,"Invalid email");
        }else{
            
            //Check if user email is verified
            var uData = await TBL_USER.findOne({where: {email_status: 1,email: NewUser.email}})
            if( uData == null ){
                return ReE(res,400,"Your email has not been verified.","error")
            }else{
                    var hashPassword = uData.dataValues.password;
                    bcrypt.compare(NewUser.password,hashPassword,(err,isMatch)=>{
                             
                    if(err){
                     return ReE(res,400,"Incorrect Username or Password. Please try again!",err)
                    }

                    if(isMatch){ 
                        // get user profile
                        TBL_PROFILE.findOne({where: {user_id: uData.dataValues.id}})
                        .then((userprofile) => {   
                                const token = jwt.sign({id:uData.dataValues.id,name:userprofile.dataValues.f_name,last_name:userprofile.dataValues.l_name,country:userprofile.dataValues.country,phone:userprofile.dataValues.phone}, config.SECRET, {                              
                            });
                            // console.log('here',user.dataValues.id);
                            Data = {id:uData.dataValues.id, email : uData.dataValues.email, google2fa_status: uData.dataValues.google2fa_status}
                            return ReS(res,200,"User login successfully",Data,'JWT '+token);
                        }).catch((err) => {
                            return ReE(res,400,"Invalid email",err);
                        });  
                    
                    }
                    else
                    {
                        return ReE(res,400,"Password not match");
                    }
                });
            }
        }
        // }).catch((err) => {
        //     return ReE(res,400,"Invalid email",err);
        // });
    },

    //userDetail
    userdetail : function(req,res,next){
        TBL_USER.findAll({
            include:[
                { model : TBL_PROFILE, required : true}
          ],     where:{ id : req.user.id }
        })
        .then((response) => {
           if(response[0].user_id)
           {
              console.log(response[0].user_id);
           }
           else
           {
            ReS(res,200,"Empty Result" , response[0]);
           }
           
        })
        .catch((err) => {
            ReE(res,400,"something went wrong",err);
        })
    },

    kycdetail : async function(req,res,next){

        var query = "SELECT ku.*,(SELECT nicename from country_codes WHERE id=ku.country) as country_name FROM kyc_users AS ku WHERE ku.user_id="+req.body.id
        var objKyc = await db.connection.query(query, { type: Sequelize.QueryTypes.SELECT})
            console.log("objKyc")
            console.log(objKyc[0])

        if(objKyc){
            ReS(res,200,"Profile Fetched" , objKyc[0]);
        }else{
            ReE(res,400,"Unable to fetch kyc details from database",err);
        }
       
        // TBL_KYC.findAll({
        //     include:[     
        //   ],     where:{ user_id : req.body.id }
        // })
      
        // .then((response) => {
        //     console.log(response)
        //     if(response[0].dataValues.user_id != '')
        //     {
        //         ReS(res,200,"Profile Fetched" , response[0]);
        //     }  
        // })
        // .catch((err) => {
        //     ReE(res,400,"something went wrong",err);
        // })
    },

    userErcAddress : function(req,res,next){
       
        ERC.findAll({
            include:[     
          ],     where:{ user_id : req.user.id }
        })
      
        .then((response) => {
           
            if(response[0].dataValues.user_id != '')
            {
                ReS(res,200,"address fetched" , response[0].dataValues);
            }
  
        })
        .catch((err) => {
            ReE(res,400,"No address found",err);
        })
    },

    // getcoinprice : function(req,res,next){
           
    //         TABLE_ICO.findAll({
    //             include:[     
    //         ],     where:{ address_type : req.body.coin, ico_phase_active: 1 }
    //         })
        
    //         .then((response) => {
    //             if(response[0].dataValues.erc_tokens != '')
    //             {
    //                 ReS(res,200,"Coin Price Fetched" , response[0]);
    //             }

    //         })
    //         .catch((err) => {
    //             ReE(res,400,"something went wrong",err);
    //         })


    // },
    getcoinprice : async function(req,res,next){
         
        //get eth price
        var cryptoPrices = await helper.getCoinPrice()
        var ethprice = cryptoPrices.eth_price;    

        //get current ico phase
        TABLE_ICO.findAll({
            include:[     
        ],     where:{ address_type : req.body.coin, ico_phase_active: 1 }
        })
        .then((response) => {
            if(response[0].dataValues.ico_phase == 1){
                var tokenPrice = 0.12;
                var totalTokens = ethprice / tokenPrice;
            }
            else if(response[0].dataValues.ico_phase == 2){
                var tokenPrice = 0.14;
                var totalTokens = ethprice / tokenPrice;
            }else{
                var tokenPrice = 0.16;
                var totalTokens = ethprice / tokenPrice;
            }
            response[0].dataValues.erc_tokens = totalTokens;
            ReS(res,200,"Coin Price Fetched" , response[0]);
            // if(response[0].dataValues.erc_tokens != '')
            // {
            //     ReS(res,200,"Coin Price Fetched" , response[0]);
            // }

        })
        .catch((err) => {
            ReE(res,400,"something went wrong",err);
        })


},

    getusertoken : function(req,res,next){
        id = req.user.id;   

        USR_COL.sum('token_value', { where: { user_id : id  } }).then(sum => {
           
            ReS(res,200,"total token fetched" , sum);  

        })

        .catch((err) => {
            ReE(res,400,"something went wrong",err);
        })


    },

    getaddress : function(req,res,next){
        id = req.user.id;
        
       address_type = req.body.coin.toLowerCase();


        TABLE_ALOTMENT.findAll({
            include:[     
          ],     where:{ user_id : id , address_type: address_type   }
        })
      
        .then((response) => {
           
            if(response[0].dataValues.user_id != '')
            {
                // get address from table 

                var table_name = ''

                if(response[0].dataValues.address_type == 'btc')
                {
                    table_name = BTC_TABLE
                }
                else if(response[0].dataValues.address_type == 'ltc')
                {
                    table_name = LTC_TABLE
                }
                else if(response[0].dataValues.address_type == 'eth')
                {
                    table_name = ETH_TABLE
                }

                table_name.findAll({
                    include:[     
                  ],     where:{ id : response[0].dataValues.address_id }
                })
              
                .then((address_res) => {
                    if(address_res[0].dataValues.address != '')
                    {
                        ReS(res,200,"Address Fetched" , address_res[0]);
                    }
                    
          
                })
                .catch((err) => {
                    ReE(res,400,"Unable to find record",err);
                })

            }
  
        })
        .catch((err) => {
            ReE(res,400,"Something went wrong",err);
        })
    },

    getcoinTotalcollection : function(req,res,next){
        
        
       address_type = req.body.coin.toLowerCase();

       var table_name = ''

       if(address_type == 'btc')
       {
           table_name = BTC_TRANS
       }
       else if(address_type == 'ltc')
       {
           table_name = LTC_TRANS
       }
       else if(address_type == 'eth')
       {
           table_name = ETH_TRANS
       }


       table_name.sum('amount').then(sum => {
           
            if(sum == null)
            {
                sum = 0
            }
            ReS(res,200,"total fetched" , sum);  

       })
        .catch((err) => {
            ReE(res,400,"something went wrong",err);
        })
       
    },

    // getcoinsum : async function(req,res,next){
  
    //     var total1 = 0
    //     var total2 = 0
    //     var total3 = 0

    //     var card = await USR_COL.sum('amount', { where: { coin: 'card' } })

    //     var ethTok = await USR_COL.sum('amount', { where: { coin: 'eth' } })

    //     var onlinePrice = await helper.getCoinPrice();

    //     var ethPrice = onlinePrice.eth_price;

    //     var ethUSD = ethPrice * ethTok;

    //     var totalAmt = ethUSD + card;
        
    //     // USR_COL.sum('amount', { where: { coin: 'card' } }).then(sum => {
            
    //          if(totalAmt == null)
    //          {
    //             totalAmt = 0
    //          }
    //          ReS(res,200,"total fetched" , totalAmt); 

           
    //     // })
    //     //  .catch((err) => {
    //     //      ReE(res,400,"something went wrong",err);
    //     //  })

     
    //  },

    getcoinsum : async function(req,res,next){
  
        var total1 = 0
        var total2 = 0
        var total3 = 0

        var onlinePrice = await helper.getCoinPrice();

        var ethPrice = onlinePrice.eth_price;

        var ico_phase = await TABLE_ICO.findOne({
            include:[     
        ],     where:{ ico_phase_active: 1 }
        })
      
        if(ico_phase.ico_phase == 1){
            var tokenPrice = 0.12;
        }
        else if(ico_phase.ico_phase == 2){
            var tokenPrice = 0.14;
        }
        else{
            var tokenPrice = 0.16;
        }
        var card = await USR_COL.sum('token_value', { where: { coin: 'card' } })

        var ethTok = await USR_COL.sum('token_value', { where: { coin: 'eth' } })

        var totalTok = card + ethTok;

        var ethtotalTok = totalTok * tokenPrice;

        // var ethUSD = ethPrice * ethTok;

        // var totalAmt = ethUSD + card;
        
        // USR_COL.sum('amount', { where: { coin: 'card' } }).then(sum => {
            
             if(ethtotalTok == null)
             {
                ethtotalTok = 0
             }
             ReS(res,200,"total fetched" , ethtotalTok); 

           
        // })
        //  .catch((err) => {
        //      ReE(res,400,"something went wrong",err);
        //  })

     
     },
    kycupdate : function(req,res,next){
            id = req.user.id;
            TBL_KYC.findOne({where: {user_id: id}})
            .then((kyc) => {
       
            kyc.update({f_name:req.body.firstName,
                l_name:req.body.lastName,
                city:req.body.city,
                state:req.body.state,
                country:req.body.country,
                address:req.body.address,
                zipcode:req.body.zipcode,
                country_code_id:req.body.zipcode,
                phone:req.body.phone,
                document_type:req.body.doctype
            
            }).then((response)=>{
                 
                   if(response.dataValues.user_id != '')
                   {
                        // check if image exist then update image
                        return ReS(res,400,"updated",response);
                   }
                   else
                   {
                    return ReE(res,400,"something went wrong , Please try again");
                   }
                  // return ReS(response.dataValues,200,"Info updated successfully");
               })
               .catch((err) => {
                   
               return ReE(err,400,"something went wrong , Please try again");
               });
            }) 
            .catch((error) => {
              return ReE(error,400,"User not found");
            });
      
    },
    /*updatedoc : function(req,res,next){
         id = req.user.id;
        // id = 1
        console.log('kd');
        //let  UploadedPresdPhoto = Date.now() + '-'+ req.files.image.name
        //req.files.image.mv(__dirname +'/../../../../../../uploads/selfie/'+ UploadedPresdPhoto,(err,success) => {
            //if(err){
             console.log(req);
            let  UploadedPresdPhoto = Date.now() + '-'+ req.files.image.name
            //var savePath = __dirname + './../../../../uploads/'+ UploadedPresdPhoto;
            var savePath = '/data/2018/crypto-ico/uploads/'+ UploadedPresdPhoto;
            req.files.image.mv(savePath,(err,success) => {
                if(err){
                    return ReE(res,400,"something went wrong 1, Please try again"+err);
                }
                // now insert file name to database

                TBL_KYC.findOne({where: {user_id: id}})
               .then((kyc) => {
   
                    kyc.update({
                        document_upload : '/uploads/' + UploadedPresdPhoto
                    }).then((response)=>{
                        
                        if(response.dataValues.user_id != '')
                        {
                                // check if image exist then update image
                            
                            return ReS(res,400,"updated image",response);
                        }
                        else
                        {
                            return ReE(res,400,"something went wrong 2, Please try again");
                        }
                        // return ReS(response.dataValues,200,"Info updated successfully");
                    })
                    .catch((err) => {
                        return ReE(err,400,"something went wrong 3, Please try again");
                    });
                    }) 
                    .catch((error) => {
                        return ReE(error,400,"User not found");
                    });  

            }) ;

     
    },*/
    updatedoc : function(req,res,next){
        id = req.user.id;
        if(req.files.image) {
            let uploadedImage = req.files.image
            let  UploadedName = 'prod/docs/'+Date.now() + '-'+ uploadedImage.name;
           const params = {
                Bucket: config.BUCKET_NAME, // pass your bucket name
                Key: UploadedName, // file will be saved as testBucket/contacts.csv
                Body: uploadedImage.data,
                ContentType : uploadedImage.mimetype
            };
            s3.upload(params,(err,success) => {
               if(err){
                   return ReE(res,400,"something went wrong, Please try again"+err);
               }
               // now insert file name to database

               TBL_KYC.findOne({where: {user_id: id}})
              .then((kyc) => {
  
                   kyc.update({
                       document_upload : success.Location
                   }).then((response)=>{
                       
                       if(response.dataValues.user_id != '')
                       {
                            // check if image exist then update image
                            return ReS(res,200,"updated image",response);
                       }
                       else
                       {
                           return ReE(res,400,"something went wrong, Please try again");
                       }
                       // return ReS(response.dataValues,200,"Info updated successfully");
                   })
                   .catch((err) => {
                       return ReE(err,400,"something went wrong, Please try again");
                   });
                   }) 
                   .catch((error) => {
                       return ReE(error,400,"User not found");
                   });  

           }) ;

        }else if(req.files.selfie_upload) {
            console.log("selfie else")

            let uploadedImage = req.files.selfie_upload
            let  UploadedName = 'prod/selfie/'+Date.now() + '-'+ uploadedImage.name;
           const params = {
                Bucket: config.BUCKET_NAME, // pass your bucket name
                Key: UploadedName, // file will be saved as testBucket/contacts.csv
                Body: uploadedImage.data,
                ContentType : uploadedImage.mimetype
            };
            s3.upload(params,(err,success) => {
               if(err){
                   return ReE(res,400,"something went wrong, Please try again"+err);
               }
               // now insert file name to database
                TBL_KYC.findOne({where: {user_id: id}})
                .then((kyc) => {
                    kyc.update({
                        selfie_upload : success.Location
                    }).then((response)=>{
                        if(response.dataValues.user_id != '')
                        {
                            // check if image exist then update image
                            return ReS(res,200,"updated selfie",response);
                        }
                        else
                        {
                            return ReE(res,400,"something went wrong , Please try again");
                        }
                    })
                    .catch((err) => {
                        return ReE(err,400,"something went wrong , Please try again");
                    });
                }) 
                .catch((error) => {
                    return ReE(error,400,"User not found");
                }); 

           }) ;
        }
    
   },

    kycinsert : function(req,res,next){
        id = req.user.id;
   
        let data = {
            user_id:id,
            f_name:req.body.firstName,
            l_name:req.body.lastName,
            city:req.body.city,
            state:req.body.state,
            country:req.body.country,
            address:req.body.address,
            zipcode:req.body.zipcode,
            country_code_id:req.body.zipcode,
            phone:req.body.phone,
            document_type:req.body.doctype
        }
        // console.log(data)
             TBL_KYC.create(data)
                .then((response)=>{
                    return ReS(res,200,"Info inserted successfully");
                })
                .catch((err) => {
                    console.log(err)
                return ReE(err,400,"something went wrong , Please try again");
                });
            
       
     },

   
    resetPassword : function(req,res,next){
        id = req.body.hash;
        
        newPassword = req.body.pass;

       var hashids = new Hashids("mySalt",16);
       var decodeParam =  hashids.decode(id);

    

        if(Object.keys(decodeParam).length===0){
           return ReE(res,400,"this link is invalid");
        }else{
            TBL_USER.findOne({where: {id: decodeParam}})
            .then((user) => {
               oldPassword = user.password;
               hashNewPassword =  bcrypt.hashSync(newPassword,8);
                
               user.update({password:hashNewPassword})
               .then((response)=>{
                   
                return ReS(res,200,"password has been reset");
               })
               .catch((err) => {
               return ReE(res,400,"something went wrong , Please try again");
               });
            })
            .catch((error) => {
              return ReE(res,400,"User not found");
            });
        }
    },

    verifymail : async function(req,res,next){

       id = req.body.hash;       
       var hashids = new Hashids("mySalt",16);
       var decodeParam =  hashids.decode(id);

       var diffhours = 0
        if(Object.keys(decodeParam).length===0){
           return ReE(res,400,"The link is invalid");
        }else{
            
            var Ud = await TBL_USER.findOne({where: {id: decodeParam}})
            if(Ud){

                //Validate email time
                var updatedAtDate = Ud.dataValues.updatedAt

                var userid = Ud.dataValues.id
                var date_2 = updatedAtDate
                var date_2 = new Date( date_2 )

                date_2 = date_2.toISOString().replace('.000Z', '').replace('T', ' ');

                var date1 = new Date( currentUTCDateTime )
                var date2 = new Date( date_2 )
                var timeDiff = Math.abs( date1.getTime() - date2.getTime() )
                diffhours = Math.ceil(timeDiff / (1000 * 3600))

                // console.log("diffhours")
                // console.log(diffhours)
                
                // if( diffhours > 48 )
                // {
                //     return ReE(res,400,"Verification email link has been expired.")
                // }else{
                    //user.update({email_status:1})
                    var Udata = await TBL_USER.update({email_status:1},{where: {id: userid}})
                    if(Udata){
                        return ReS(res,200,"Your email has been verified successfully!")
                    }else{
                        return ReE(res,400,"Something went wrong , Please try again.")
                    }
                // }
            }else{
                return ReE(res,400,"User not found");
            }
        }
    },
    /**
     * Resend verification email
     */ 

    resendVerifyEmail: async function(req,res,next){
        var uEmail = req.body.user_email
        //Check if user email is verified
        var uData = await TBL_USER.findOne({where: {email_status:0, email:uEmail}})
        if( uData == null ){
            return ReE(res,400,"Please provide a valid email or your email has already been verified. ","error")
        }else{
            //Update user table
            //var userID = uData.dataValues.id
            await TBL_USER.update({ updatedAt:currentUTCDateTime},{where:{email:uEmail} } )
            var user_id = uData.dataValues.id

            var hashids = new Hashids("mySalt",16);
            let mailOptions = {
                from: '"Cryptoxygen" <support@cryptoxygen.io>', // sender address
                to: uEmail, // list of receivers
                bcc: bccEmails,
                subject: 'Cryptoxygen - verify your email', // Subject line
                text: 'Resend verification email ', // plain text body
                html: ` Dear Cryptoxygen User,
                        <p>Please click on below link to verify your email.</p>
                        <p><a href="`+siteurl+`/verifymail/`+hashids.encode(user_id)+`">Click to verify</a></p>
                        <br>
                        <p>Until Next Time,</p>
                        <p>The Cryptoxygen Team</p>
                `
            };
            mailer.transporter.sendMail(mailOptions, (error, info) => {
                if (error){
                    //console.log(error);
                    return ReE(res,400,"Unable to send verification email, Please try again later.","error")
                }else{
                    return ReS(res,200,"Verification email has been sent to: "+uEmail,"success")
                }
            });
        }
    },
    creditcardEmail: async function(req,res,next){
   
        
       
         await TBL_USER.findOne({where: {id:req.user.id}}).then( async (user)=>{
            await TBL_PROFILE.findOne({where: {user_id: user.id}}).then(async(pData)=>{
                if( pData != null ){
                    uName = pData.f_name +" "+ pData.dataValues.l_name
                    country = pData.country
                    phone = pData.phone
                    email = user.email
                }
            })
            
        })
        let mailOptions = {
            from: '"Cryptoxygen" <support@cryptoxygen.io>', // sender address
            to: 'support@cryptoxygen.io', // list of receivers
            bcc: bccEmails,
            subject: 'CreditCard Payment Confirmation', // Subject line
            text: 'Credit Card Payment confirmation ', // plain text body
            html: ` Dear Cryptoxygen Team,
                    <p>User KYC has been approved and user want to buy ERC20 using Fiat, Please contact with him asap. Please check below user's details</p>
                    Name: `+uName+`<br>
                    Email: `+email+`<br>
                    Phone:`+phone+`<br>
                    Country:`+country+`<br>
                    <br>
                    <p>The Cryptoxygen Team</p>
            `
        };
     
        mailer.transporter.sendMail(mailOptions, (error, info) => {
            if (error){
                //console.log(error);
                return ReE(res,400,"Unable to send email, Please try again later.","error")
            }else{
                return ReS(res,200,"Thanks for your interest in Cryptoxygen, An email has been sent to Cryptoxygen Team, Re-presentative will contact you soon.","success")
            }
        });
    },
    noncepay : async function(req,res,next){
        id = req.user.id;
        // console.log(req.body);
        var nonce = req.body.nonce
        var price = parseInt(req.body.price)
        var erc20Token = req.body.erctoken
        var ercTokens = 0
        var minimumUsd = 100 //Minimum USD price to buy ERC20

        if( price >= minimumUsd ){

            //Get online ETH price
            var dataOnline =  await helper.getCoinPriceOnlineLocal();
            
            if(dataOnline.status == true){
                var price1ERC20toUSD = dataOnline.data.oneerc20_to_doller
                ercTokens = price/price1ERC20toUSD
                ercTokens = ercTokens.toFixed(5)
            }else{
                ReE(res,400,"Unable to process payment at this moment","error");
            }

            var finalSquarePrice = price*100    
            var defaultClient = SquareConnect.ApiClient.instance;
            
            // Configure OAuth2 access token for authorization: oauth2
            var oauth2 = defaultClient.authentications['oauth2'];
            oauth2.accessToken = SquareAcessToken;
            
            var api = new SquareConnect.LocationsApi();
            
            api.listLocations().then(function(data) {
                console.log('API called successfully. Returned data: ');
                console.log(data)

                var apiInstance = new SquareConnect.TransactionsApi();

                        var locationId = SquareLocationID; // String | The ID of the location to associate the created transaction with.
                        var rand_num = randomString({
                            length: 18,
                            numeric: true,
                            letters: true,
                            special: false,
                            exclude: ['a', 'b', '1']
                        });

                        var body = {idempotency_key:rand_num, amount_money:{amount:parseInt(finalSquarePrice),currency:'USD'},card_nonce:nonce};
                        apiInstance.charge(locationId, body).then(function(data) {
                            var tid = data.transaction.id
                            var loc_id = data.transaction.location_id

                            PAYMENT.create({
                                user_id: id,
                                transaction_id: tid,
                                nonce: nonce,
                                location_id: loc_id,
                                idempotency_key: rand_num,
                                price: price,
                                erc_tokens: ercTokens
                            }).then((test) => {
                                USR_COL.create({
                                    user_id: id,
                                    coin:'card',
                                    amount: price,
                                    token_value: ercTokens
                                }).then((usercol) => {
                                    return ReS(res,200,"Payment Success",test);
                                })
                            })
                        }, function(error) {
                            //ReE(res,400,"something went wrong",error);
                            ReE(res,400,"Unalbe to charge payment from card, Please try another one.","error");
                        });

            }, function(error) {
                console.error(error);
                ReE(res,400,"Unable to process payment, Location not found","error");
            });

        }else{
            ReE(res,400,"Minimum USD amount to buy ERC20 token is $"+minimumUsd,"error");
        }
    
},
getcoinpriceOnline : async function(req,res,next){

    // we have data for eth = how many erc20 token
  
    TABLE_ICO.findAll({
            include:[     
        ],     where:{ address_type : 'eth', ico_phase_active: 1 }
    })

    .then((response) => {
        var result = []
        if(response[0].dataValues.erc_tokens != '')
        {
           
        //    var etherctoken = response[0].dataValues.erc_tokens

            // now get current price of eth to usd

            var cryptoPrices = helper.getCoinPrice()
            cryptoPrices.then(function(resultData){
                console.log(resultData) 
                var myval
                if(resultData.btc_price){
                    //ETH
                    var ethprice = resultData.eth_price
                    if(response[0].dataValues.ico_phase == 1){
                        var tokenPrice = 0.12;
                        var etherctoken = ethprice / tokenPrice;
                    }
                    else if(response[0].dataValues.ico_phase == 2){
                        var tokenPrice = 0.14;
                        var etherctoken = ethprice / tokenPrice;
                    }else{
                        var tokenPrice = 0.16;
                        var etherctoken = ethprice / tokenPrice;
                    }
                    
                    
                    // we found one Erc20Token = how many dollers
                    var oneErc20Token = ethprice / etherctoken
                    result['oneeth_to_erc20'] = etherctoken
                    result['oneerc20_to_doller'] = oneErc20Token

                    //BTC
                    var btcprice = resultData.btc_price
                    // now we found one btc to doller
                    var onebtctoErc20token = btcprice / oneErc20Token 
                    result['onebtc_to_erc20'] = onebtctoErc20token

                    //LTC 
                    var ltcprice = resultData.ltc_price
                    // we get ltc price over doller
                    var oneltctoErc20token = ltcprice / oneErc20Token
                    result['oneltc_to_erc20'] = oneltctoErc20token

                    myval = {
                        oneeth_to_erc20: result['oneeth_to_erc20'],
                        oneerc20_to_doller: result['oneerc20_to_doller'],
                        onebtc_to_erc20: result['onebtc_to_erc20'],
                        oneltc_to_erc20: result['oneltc_to_erc20'],
                        eth: ethprice,
                        btc: btcprice,
                        ltc: ltcprice,
                        erc20: result['oneerc20_to_doller']
                    }   
                    
                }else{
                    myval = {
                        oneeth_to_erc20: 0,
                        oneerc20_to_doller: 0,
                        onebtc_to_erc20: 0,
                        oneltc_to_erc20: 0
                    } 
                }
                return ReS(res,200,"price received",myval);
            })

        }
    })
    .catch((err) => {
        ReE(res,400,"something went wrong",err);
    })
},


web_hook:function(req,res,next){
    
    console.log("Web hook excuted");

    console.log(req.body)

    var coin = req.body.coin;
   
    var wallet = req.body.wallet;
    var transfer = req.body.transfer;
    // var txid = req.body.hash;

    var TRANSACTION = ''
    var ADDRESS_TABLE = ''

    


    if(coin == 'teth')
    {
        TRANSACTION = ETH_TRANS
        ADDRESS_TABLE = ETH_TABLE
        var c_name = 'eth'

    }
    else if(coin == 'tbtc')
    {
        TRANSACTION = BTC_TRANS
        ADDRESS_TABLE = BTC_TABLE
        var c_name = 'btc'
    }
    else if(coin == 'tltc')
    {
        TRANSACTION = LTC_TRANS
        ADDRESS_TABLE = LTC_TABLE
        var c_name = 'ltc'
    } 

   // just for testing remove above part while live that is why its seprate
    if(coin == 'eth')
    {
        TRANSACTION = ETH_TRANS
        ADDRESS_TABLE = ETH_TABLE
        var c_name = 'eth'

    }
    else if(coin == 'btc')
    {
        TRANSACTION = BTC_TRANS
        ADDRESS_TABLE = BTC_TABLE
        var c_name = 'btc'
    }
    else if(coin == 'ltc')
    {
        TRANSACTION = LTC_TRANS
        ADDRESS_TABLE = LTC_TABLE
        var c_name = 'ltc'
    } 
   
    var options = {
        url: bitgoAPI+coin+'/wallet/'+wallet+'/transfer/'+transfer+' ',
        headers: {
        Authorization: 'Bearer '+accessToken,
        },
        method: 'GET'
    };

    request( options, function (err, res1, body) {
           if (err) {  
            return console.log(err); }
           
             // here code start


            body =  JSON.parse(body);

            console.log(body)
           
           
                if (c_name == 'eth') {
                    if (typeof body.entries != "undefined") {
                        if(body.entries[0].wallet)
                        {
                            var address_from = body.entries[1].address;
                            var address_to = body.entries[0].address;
                        }
                        else
                        {
                            var address_from = body.entries[0].address;
                            var address_to = body.entries[1].address;
                        }
                    }
                } 
                else
                {
                    var address_to
                    if(body.entries.length>0){
                        body.entries.forEach(element => {
                            if( element.wallet == wallet ){
                                address_to = element.address;        
                            }
                        });
                    }
                    // BTC/LTC

                    // if (typeof body.outputs != "undefined") {
                    //     if(body.outputs[0].chain)
                    //     var address_to = body.outputs[0].address;
                    //     else
                    //     var address_to = body.outputs[1].address;                       
                    // }
        
                    if (typeof body.inputs != "undefined") {
                        var address_from = typeof body.inputs[0].address != "undefined" ? body.inputs[0].address : "";
                    }
                }
              
                
            var amount1 = body.value;
            var amount = '';    

            if(c_name == 'btc')
            {
                amount = amount1 / 100000000;
            }   
            else if(c_name == 'eth')
            {
                amount = amount1 / 1000000000000000000;
            } 
            else if(c_name == 'ltc')
            {
                amount = amount1 / 100000000;
            }

            console.log('amount: ',amount)

            var state = body.state;
            var txid = body.txid;
            var walletid = body.wallet;

            if(txid)
            {
                TRANSACTION.findOne({where: {txid: txid}})
           
                .then((response) => {

                    // now get address
                    // need to get user_id

                    ADDRESS_TABLE.findAll({ include:[ ],where:{ address : address_to }})                
                    .then((userresponse) => {

                        console.log(userresponse)

                        //if(userresponse[0].dataValues.id != '')
                        if(userresponse)
                        {
                            var userId = '';
                                            
                            TABLE_ALOTMENT.findAll({
                                include:[], where:{ address_id : userresponse[0].dataValues.id , address_type: c_name   }
                            })
                            .then((responseallot) => {
                                //if(responseallot[0].dataValues.user_id != '')
                                if(responseallot)
                                {
                                    // get address from table 
                                    userId = (responseallot[0].dataValues.user_id)?responseallot[0].dataValues.user_id:0;
                                }
                            }).then((usres) => {

                                if(response == null)
                                {
                                    // insert
                                    let data = {
                                        address_id:userresponse[0].dataValues.id,
                                        wallet_id:walletid,
                                        txid:txid,
                                        amount:amount,
                                        address_from:address_from,
                                        address_to:address_to,
                                        user_id:userId,
                                        coin:c_name,
                                        type:'deposit',
                                        status:state
                                    }
            
                                    TRANSACTION.create(data)
                                        .then((response)=>{
                                            if(state == 'confirmed') 
                                            {
                                                // now its time to give erc20 token to user                                                    
                                                helper.getcoinpriceOnlineweb_hook(c_name,userId,amount);
                                            }
                                            return ReS(res,200,"Info inserted successfully",response);
                                        })
                                        .catch((err) => {                                                
                                        return ReE(err,400,"something went wrong , Please try again");
                                    });

                                }else{

                                    console.log("reached")
                                    // update
                                    // console.log(response.dataValues.txid);

                                    response.update({
                                        status:state
                                    }).then((response)=>{
                                        if(response.dataValues.user_id != '')
                                        {
                                            if(state == 'confirmed') 
                                            {
                                                helper.getcoinpriceOnlineweb_hook(c_name,userId,amount);
                                            }
                                            // check if image exist then update image
                                            return ReS(res,400,"updated");
                                        }
                                        else
                                        {
                                            return ReE(res,400,"something went wrong , Please try again");
                                        }
                                        // return ReS(response.dataValues,200,"Info updated successfully");
                                    })    
                                }
                            })
                        }
                    });

                })
                .catch((err) => {                   
                    ReE(err,400,"something went wrong",err);
                })    
            }
            else
            {   
               console.log('error occured');
            }  
     });
       
},
gettransactions : function(req,res,next){
    id = req.user.id;
    
    address_type = req.body.coin;

    console.log(address_type)

    var TRANSACTION = ''

    if(address_type == 'btc')
    {
        TRANSACTION = BTC_TRANS
    }
    else if(address_type == 'ltc')
    {
        TRANSACTION = LTC_TRANS
    }
    else if(address_type == 'eth')
    {
        TRANSACTION = ETH_TRANS
    }
    else if(address_type == 'bnk')
    {
        TRANSACTION = PAYMENT
    }
  

    TRANSACTION.findAll({
        include:[     
      ],     where:{ user_id : id }
    })
  
    .then((response) => {
        return ReS(res,200,"transaction received",response);

    })
    .catch((err) => {
        ReE(res,400,"something went wrong",err);
    })
},

forgotPassword : async function(req,res,next){
    
    var uName = ''
    let Email = req.body.email;
    var link = siteurl+"/resetpassword";
    TBL_USER.findOne({where: {email: Email}})
    .then( async (user) => {
        //user found
        var hashids = new Hashids("mySalt",16);
        var id = hashids.encode(user.id); 
     
        //Get user name
        var uData = await TBL_PROFILE.findOne({where: {user_id: user.id}})
        if(uData != null){
            uName = uData.dataValues.f_name
        }

        let mailOptions = {
            from: '"Cryptoxygen" <support@cryptoxygen.io>', // sender address
            to: Email, // list of receivers
            bcc: bccEmails,
            subject: 'Reset Password', // Subject line
            text: "Cryptoxygen ✔ reset password", // plain text body
            html: 'Hello '+uName+', <br/><p>Please click on the below link to update your password.  <br><a href='+`${link}/${id}`+'>Reset your password</a></p>  <br><br><p>Regards,<br/>The Cryptoxygen Team</p>', // html body
        };

       // console.log(link+'/'+id);

        mailer.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {console.log(error); }
           return ReS(res,200,"Reset password email has been sent");
        });

    })
    .catch((err) => {
        return ReE(res,400,"Email address does not exist!",err);
    });

},

getSmartAddress : function(req,res,next){

    SMART_CONT.findOne()
    .then((data) => {
        return ReS(res,200,"address",data.dataValues.address);
    })
    .catch((err) => {
        return ReE(res,400,"something went wrong",err);
    });

},


getsoftcap : function(req,res,next){

    SOFTCAP.findOne({
        include:[     
    ],     where:{ status : 1 }
    })
    .then((data) => {
        return ReS(res,200,"tokens",data);
    })
    .catch((err) => {
        return ReE(res,400,"something went wrong",err);
    });

},

updateErcAddress : function(req,res,next){
       
    id = req.user.id;
    address = req.body.address;
    update = req.body.update;

    let isAddress = Web3Utils.isAddress(address);
    console.log(isAddress)
    if(!isAddress){
        return ReE(res,400,"This address is not valid");
        
    }

    // console.log(address);
    // console.log(update)
    if(update == 1)
    {
        
        // update code here
        ERC.findOne({
            include:[     
        ],     where:{ user_id : id }
        })
        .then((erc) => {
           
            erc.update({
                address:address,
                updatedAt:currentUTCDateTime
            })
            .then((response1)=>{
               
                // return success
                return ReS(res,200,"Thanks! Your ERC20 address has been updated",response1);
            })
            .catch((err) => {
                return ReE(res,400,"something went wrong",err);
            });

        })
        .catch((err) => {
            return ReE(res,400,"something went wrong",err);
        });


    }
    else
    {
        // insert code here

        //Check if user address already added
        ERC.findOne({include:[], where:{user_id : id}
        }).then((erc) => {
            if(erc==null){
                // insert code here
                let data = {
                    user_id : id,
                    address : address
                }

                ERC.create(data)
                .then((response)=>{
                    return ReS(res,200,"Thanks for submitting your ERC20 address",response);

                })
                .catch((err) => {
                    return ReE(res,400,"something went wrong",err);
                });
            }else{

                //Update ERC 20 address
                erc.update({
                    address:address,
                    updatedAt:currentUTCDateTime
                })
                .then((response1)=>{
                    return ReS(res,200,"Thanks! Your ERC20 address has been updated",response1);
                })
                .catch((err) => {
                    return ReE(res,400,"something went wrong",err);
                });                
            }
        })
        .catch((err) => {
            return ReE(res,400,"something went wrong",err);
        });

    }



},


feedback : function(req,res,next){
    id = req.user.id;
    title = req.body.title;
    comment = req.body.comment;

        // insert code here

        FEEDBACK.create({
           user_id:id, 
           title:title,
           comment:comment
        }).then((response) => {
            return ReS(res,200,"Thanks for submitting your feedback",response);
        })
        .catch((err) => {
            return ReE(res,400,"something went wrong",err);
        });
    
},
contact : function(req,res,next){
 
    let mailOptions = {
        from: '"Cryptoxygen" <support@cryptoxygen.io>', // sender address
        // to: Email, // list of receivers
        to:'support@cryptoxygen.io',
        bcc: bccEmails,
        subject: 'Cryptoxygen ✔ Support Ticket', // Subject line
        text: "Cryptoxygen ✔ Support", // plain text body
        html: '<h3>Hi Admin</h3> <p>User has been submitted a support request</p> <br> <p>Email:'+req.body.email+' </p><br><p>Name:'+req.body.name+'</p>  <br><p>Subject:'+req.body.subject+'</p>  <br><p>Message:'+req.body.message+'</p>  <br><p>Regards</p><p>The Cryptoxygen Team</p>', // html body
    };

   // console.log(link+'/'+id);

    mailer.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return ReE(res,400,"something went wrong",err);
         }
       return ReS(res,200,"We have received your request. Our support person will get back to you soon.");
    });


},

    // Fetch All countries with country codes
    fetchCountryPhoneCodes: function(req, res, next){
        TBL_CountryCode.findAll({attributes:['id','iso3','nicename','phonecode']})
        .then((response) => {
            ReS(res,200,"Success" , response);
           
        })
        .catch((err) => {
            ReE(res,400,"something went wrong",err);
        })
    },

    /**
     * Check ETH address if not generated already, NOT IN USER, DEV-SK, Dec-04-2018
     */
    requestEthAddress: async function(req,res,next){
        var userid = req.user.id;
        var data = await TABLE_ALOTMENT.findOne({where:{user_id:userid, address_type:'eth'}})
        console.log(data)
        if( data == null ){
            //Double check to avoid duplicate ETH address, if no ETH transaction exists for this user
            var dataTx = await ETH_TRANS.findOne({where:{user_id:userid}})
            if( dataTx == null ){
                //Get ETH address id            
                var dataIds = await ETHIDS.findOne({where:{user_id:userid}})
                    if( dataIds != null ){
                        if( dataIds.dataValues ){
                            var ethID = dataIds.dataValues.ethid
                            //console.log(ethID)
                            var optionsEth = {
                                url: bitgoAPI+coin_prefix+'eth/wallet/'+ethWalletId+'/address/'+ethID,
                                headers: {
                                    Authorization: 'Bearer '+accessToken,
                                },
                                method: 'GET'
                            };        
                            request( optionsEth, function (err, res1, bodyAdd) {
                                if (err) {
                                    console.log("request ETH address error")
                                    console.log(err)
                                }
                
                                bodyAdd =  JSON.parse(bodyAdd);
                                console.log("later eth request")
                                console.log(bodyAdd)

                                var ETH_ADD = {
                                    address :bodyAdd.address,
                                    alloted : 1,
                                    allotted_date : currentUTCDateTime,
                                    createdAt : currentUTCDateTime,
                                    updatedAt : currentUTCDateTime
                                }
                                var ethObj = {};
                        
                                ETH_TABLE.create(ETH_ADD)
                                .then((responseeth) => {
                                    this.ethObj = responseeth;
                                })
                                .then(() => {
                                    TABLE_ALOTMENT.create({
                                        user_id :   userid,
                                        address_id : this.ethObj.id,
                                        address_type:'eth',
                                        createdAt : currentUTCDateTime,
                                        updatedAt : currentUTCDateTime
                                    }).then((test1) => { })
                                    return ReS(res,200,"got cryto wallet successfully",{address:bodyAdd.address});
                                })
                            })
                        }
                    }
            }else{
                ReE(res,400,"wallet address exist","error1");
            }
        }else{
            ReE(res,400,"wallet address exist","error0");
        }        
    },
    /*
    * Mobile api for latest ltc, btc, eth price
    */
    getcoinpriceonline_mobile : function(req,res,next){

        // we have data for eth = how many erc20 token
        TABLE_ICO.findAll({
                include:[     
            ],     where:{address_type : 'eth', ico_phase_active: 1 }
        })
        .then((response) => {
            var data = []
            if(response[0].dataValues.erc_tokens != '')
            {  
               var ethErc20 = response[0].dataValues.erc_tokens
                // now get current price of eth to usd
                var cryptoPrices = helper.getCoinPriceLatestQuotes()
                cryptoPrices.then(function(resultData){
                    if(resultData.btc_price){
                        //ETH
                        var ethprice = resultData.eth_price.price
                        var oneERC20 = ethprice / ethErc20
                        var ercObj = {
                            "name":"abc",
                            "symbol": "ww-abc",
                            "price": oneERC20,
                            "percentage_1h": 1,
                        }
                        for(var key in resultData){
                            var element = resultData[key]
                            data.push(element)
                        }
                        data.push(ercObj)
                    }else{
                        console.log("inside else part")
                    }
                    return ReS(res,200,"price received",data);
                }).catch((err) => {
                    ReE(res,400,"Something went wrong",err);
                })
            }
        })
        .catch((err) => {
            ReE(res,400,"ICO is not active",err);
        })
    },
    /**
     * Payment gateway Payeezy. Oct-11-2018
     * Not in use
     */
    capture_card_payment: async (req,res,next)=>{
        
        var userid = req.user.id;
        var erc20Tokens = 0
        var minimumUsd = 100 //Minimum USD price to buy ERC20

        var price = (req.body.price)?parseInt(req.body.price):0
        var cardNumber = (req.body.card_no)?req.body.card_no:''
        var cardCvv = (req.body.card_cvv)?req.body.card_cvv:''
        var cardType = (req.body.card_type)?req.body.card_type:''
        var cardExpMonth = (req.body.exp_month)?req.body.exp_month:''
        var cardExpYear = (req.body.exp_year)?req.body.exp_year:''
        var cardExpDate = cardExpMonth+cardExpYear

        var cardHolder = (req.body.card_holder_name)?req.body.card_holder_name:''
        var cardHolderStreet = (req.body.street)?req.body.street:''
        var cardHolderCity = (req.body.city)?req.body.city:''
        var cardHolderState = (req.body.state)?req.body.state:''
        var cardHolderZip = (req.body.zipcode)?req.body.zipcode:''
        var cardHolderCountry = (req.body.country)?req.body.country:''

        //find user email 
        var uData = await TBL_USER.findOne({where: {id:userid}})
        var userEmail = ''
        if(uData!=null){
            userEmail = uData.dataValues.email
        }

        //return false

        if( price >= minimumUsd ){

            //Get online ETH price
            var dataOnline =  await helper.getCoinPriceOnlineLocal();
            
            if(dataOnline.status == true){
                var price1ERC20toUSD = dataOnline.data.oneerc20_to_doller
                erc20Tokens = price/price1ERC20toUSD
                erc20Tokens = erc20Tokens.toFixed(5)
            }else{
                ReE(res,400,"Unable to process payment at this moment","error");
            }

            var finalSquarePrice = price*100            

            //var secondaryTransactionType = 'capture'
            console.log('*******************************************\nPerforming Authorize Transaction\n************************************')
            payeezy.transaction.purchase({
                method: 'credit_card',
                amount: finalSquarePrice,
                currency_code: 'USD',
                credit_card: {
                    card_number: cardNumber,
                    cvv: cardCvv,
                    type: cardType,
                    exp_date: cardExpDate,
                    cardholder_name: cardHolder
                },
                billing_address: {
                    street: cardHolderStreet,
                    city: cardHolderCity,
                    state_province: cardHolderState,
                    zip_postal_code: cardHolderZip,
                    country: cardHolderCountry
                }
            },
            function(error, response) {
                if (error) {
                    //console.log('Purchase Transaction Failed\n' + error);
                    ReE(res,400,"Unable to process payment from your card, Please try again.","error_3");
                }
                if (response) {
                    //console.log('Purchase Successful.\nTransaction Tag: ' + response.transaction_tag);
                    //console.log(response)
                    if(response.transaction_status && response.validation_status){
                        if( response.transaction_status=='approved' && response.validation_status=='success' ){

                            //Save response to db
                            var jsonres = JSON.stringify(response);
                            db.connection.query(`INSERT INTO user_payment_logs SET user_id=${userid},response='${jsonres}',payment_gateway='payeezy',created_at='${currentUTCDateTime}'`)

                            var transactionId = response.transaction_id
                            var transactionTag = response.transaction_tag
                            var amount = response.amount

                            var tid = transactionId
                            var loc_id = 0
                            var nonce = 0
                            var rand_num = 0

                            PAYMENT.create({
                                user_id: userid,
                                transaction_id: tid,
                                nonce: nonce,
                                location_id: loc_id,
                                idempotency_key: transactionTag,
                                price: price,
                                erc_tokens: erc20Tokens,
                                street:cardHolderStreet,
                                city:cardHolderCity,
                                state:cardHolderState,
                                zipcode:cardHolderZip,
                                country:cardHolderCountry
                            }).then((test) => {
                                USR_COL.create({
                                    user_id: userid,
                                    coin:'card',
                                    amount: price,
                                    token_value: erc20Tokens
                                }).then((usercol) => {
                                    
                                    //Send email to buyer
                                    if( userEmail != '' ){
                                        let mailOptions = {
                                            from: '"Cryptoxygen" <support@cryptoxygen.io>', // sender address
                                            to: userEmail,
                                            bcc: bccEmails,
                                            subject: 'Credit Card Payment Confirmation', // Subject line
                                            text: 'Credit Card Payment confirmation ', // plain text body
                                            html: ` Dear Cryptoxygen User,
                                                    <p>Thanks for participating in Cryptoxygen ITO, Please find your ERC20 token details below:</p>
                                                    USD: $`+price+`<br>
                                                    ERC20 Tokens: `+erc20Tokens+`<br>
                                                    <br>
                                                    <p>Regards,</p>
                                                    <p>The Cryptoxygen Team</p>
                                            `
                                        };
                                        mailer.transporter.sendMail(mailOptions, (error, info) => {
                                            if (error){
                                                //console.log(error);
                                                //return ReE(res,400,"Unable to send email, Please try again later.","error")
                                            }else{
                                                //return ReS(res,200,"Thanks for your interest in abc, An email has been sent to abc Team, Re-presentative will contact you soon.","success")
                                            }
                                        });
                                    }
                                    return ReS(res,200,"Payment Success",test);
                                })
                            })
                        }else{
                            //Error
                            ReE(res,400,"Sorry, unable to validate your card, Please use another one.","error_2");
                        }
                    }else{
                        //Error
                        ReE(res,400,"Sorry, unable to validate your card, Please use another one.","error_1");
                    }
                }
            })
        }else{
            ReE(res,400,"Minimum USD amount to buy ERC20 token is $"+minimumUsd,"error");
        }

    },

    //Generate QRcode Google 2FA
    google2faQR: async (req,res,next)=>{
        issuerQr = "Cryptoxygen ICO"
        member_id = req.user.id
        label = req.user.email
        var algo = "SHA1"
        var secret = speakeasy.generateSecret()
        var secretbase32 = secret.base32
        
        var url = await speakeasy.otpauthURL({ secret: secret.ascii, label: label, type: '', counter: '', issuer: issuerQr, algorithm: algo });

        QRCode.toDataURL(url, function(err, data_url) {
            let send_data = {secret:secretbase32, qrImgUrl:data_url}
            res.status(200).json(send_data)
        });
    },

    //Validate Google 2FA QR code
    google2faValidate: async (req,res,next)=>{
        var member_id = req.user.id
        var userToken = req.body.token
        var secretAscii = req.body.secret

        var verified = speakeasy.totp.verify({ secret: secretAscii,
            encoding: 'base32',
            token: userToken });

        var resJson
        if(typeof verified === "undefined"){
            resJson = {status:false,message:"Invalid token, please try again."}
            res.status(400).json(resJson)
        }else if(verified === null){
            resJson = {status:false,message:"Invalid token, please try again."}
            res.status(400).json(resJson)
        }else if(verified == false){
            resJson = {status:false,message:"Invalid token, please try again."}
            res.status(400).json(resJson)
        }
        else if(verified == true){

            var google2FASecret = {
                google2fa_secret_key:secretAscii,
                google2fa_status:1,
                updated_at: currentUTCDateTime

            }
            await TBL_USER.update(google2FASecret,{where:{id:member_id}})
            resJson = {status:true,message:"Token verified successfully"}
            res.status(200).json(resJson)
        }else{
            resJson = {status:false,message:"Invalid token, please try again."}
            res.status(400).json(resJson)
        }
    },

    //Validate User Login with Google 2FA Token
    google2faLogin: async (req,res,next)=>{
        var member_id = req.user.id
        var userToken = req.body.token

        var userData = await TBL_USER.findOne({where:{id:member_id},attributes:['google2fa_secret_key']})
        var secretAscii = userData.google2fa_secret_key

        var verified = speakeasy.totp.verify({ secret: secretAscii,
            encoding: 'base32',
            token: userToken });
        
        var resJson
        if(typeof verified === "undefined"){
            resJson = {status:false,message:"Invalid token, please try again."}
            res.status(400).json(resJson)
        }else if(verified === null){
            resJson = {status:false,message:"Invalid token, please try again."}
            res.status(400).json(resJson)
        }else if(verified == false){
            resJson = {status:false,message:"Invalid token, please try again."}
            res.status(400).json(resJson)
        }else if(verified == true){
            resJson = {status:true,message:"Token verified successfully"}
            res.status(200).json(resJson)
        }else{
            resJson = {status:false,message:"Invalid token, please try again."}
            res.status(400).json(resJson)
        }
    },

    //Validate User Login with Google 2FA Token
    google2faLost: async (req,res,next)=>{
        var member_id = req.user.id
        var google2FAUpdate = {
            google2fa_secret_key:'',
            google2fa_status:0,
            updated_at: currentUTCDateTime
        }   
        var userData = await TBL_USER.update(google2FAUpdate,{where:{id:member_id}})        
        resJson = {status:true, message:"Google 2FA authentication deleted successfully, You can activate it under your account settings."}
        res.status(200).json(resJson)
    },

    //Disable Google 2FA
    google2faDisable: async (req,res,next)=>{
        var member_id = req.user.id
        var userToken = req.body.token
        var action = req.body.action
        var userData = await TBL_USER.findOne({where:{id:member_id},attributes:['google2fa_secret_key']})
        var secretAscii = userData.google2fa_secret_key
        var verified = speakeasy.totp.verify({ secret: secretAscii,
            encoding: 'base32',
            token: userToken });
        
        if( typeof verified === "undefined" ){

            resJson = {status:false,message:"Invalid token, Please try again."}
            res.status(400).json(resJson)

        }else if( verified === null ){

            resJson = {status:false,message:"Invalid token, Please try again."}
            res.status(400).json(resJson)

        }else if( verified == false ){

            resJson = {status:false,message:"Invalid token, Please try again."}
            res.status(400).json(resJson)

        }else if( verified == true ){

            if( action == "disable" ){

                var google2FASecretData = {
                    google2fa_secret_key:'',
                    google2fa_status:0,
                    updated_at: currentUTCDateTime
                }
                await TBL_USER.update(google2FASecretData,{where:{id:member_id}})
                let resJson = { 
                    status:true,
                    message:"Google 2 factor authentication has been disabled successfully." 
                }
                res.status(200).json(resJson)

            }else{
                let resJson = { 
                    status:false, 
                    message:"Unable to process your request, Please send valid parameters." 
                }
                res.status(400).json(resJson)
            }
            
        }else{

            resJson = {status:false,message:"Invalid token, please try again."}
            res.status(400).json(resJson)

        }
    },

    google2faStatus: async (req,res,next)=>{
        var member_id = req.user.id;
        var userData = await TBL_USER.findOne({where:{id:member_id},attributes:['google2fa_status']})
        // console.log(userData.google2fa_status);
        if(userData != null){
            Data = {google2fa_status: userData.google2fa_status}
            return ReS(res,200,"Google 2FA status get successfully",Data);
        }else{
            let resJson = { 
                status:false, 
                message:"something went wrong!." 
            }
            res.status(400).json(resJson)
        }
        
    }




};

module.exports = usersController;


/**
 * Custom functions
 */

var getAddressFunction = function(walletid,coin)
{

var options = {
    url: bitgoAPI+coin_prefix+coin+'/wallet/'+walletid+'/address',
    headers: {
    Authorization: 'Bearer '+accessToken,
    },
    method: 'POST'
};
request( options, function (err, res1, body) {
    if (err) { return console.log(err); }
        body = JSON.parse(body);
        return body
    })
}


 

