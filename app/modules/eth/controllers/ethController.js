const db = require('../../../../config/db');
const ethHelper = require('../helpers/eth');
require('../../../../globalfunctions');
var helper = require('../../users/helpers/helper');

var ETH_TRANS = require('../../users/schemas/ethTransaction');
var ETHIDS = require('../../users/schemas/ethIds');
var ETH_TABLE = require('../../users/schemas/ethSchema');
var TABLE_ALOTMENT = require('../../users/schemas/addressSchema');

module.exports = {

    //Get Ethereum address
    get_address: async (req,res,next) => {
        var userid = req.user.id;
        var data = await TABLE_ALOTMENT.findOne({where:{user_id:userid, address_type:'eth'}});       
        if( data == null ){
            //Double check to avoid duplicate ETH address, if no ETH transaction exists for this user
            var dataTx = await ETH_TRANS.findOne({where:{user_id:userid}});
            if( dataTx == null ){
                var account = await ethHelper.ethGetAddress();
                var ethWallet = '';
                var ethWalletPKey = '';
                if( typeof account.address != 'undefined' ){
                    ethWallet = account.address;
                    ethWalletPKey = encrypt(account.privateKey);
                
                    let currentUTCDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

                    var ETH_ADD = {
                        address : ethWallet,
                        secret: ethWalletPKey,
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
                        let currentUTCDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                        TABLE_ALOTMENT.create({
                            user_id :   userid,
                            address_id : this.ethObj.id,
                            address_type:'eth',
                            createdAt : currentUTCDateTime,
                            updatedAt : currentUTCDateTime
                        }).then((test1) => { })
                        return ReS(res,200,"Cryto wallet creatd successfully!",{ address: account.address });
                    });
                }else{
                    ReE(res,400,"Your crypto deposit wallet will be ready soon.","error2");
                }
            }else{
                // get existing address from eth transaction table        
                var addressData = await ETH_TABLE.findOne({where:{id:dataTx.address_id}});
                ReS(res,200,"wallet address exist",{ address: addressData.address });
            }
        }else{
            // get existing address from address allotment table        
            var addressData = await ETH_TABLE.findOne({where:{id:data.address_id}});
            ReS(res,200,"wallet address exist",{ address: addressData.address });
        }
    },

    //Full node webhook

    fullNodeWebhook: async (req,res,next) => {

        console.log("Transaction", req.body);
        var transaction_encryObj = JSON.parse(decrypt(req.body.salt));
        console.log("transaction_encryObj:",transaction_encryObj);
        //console.log(transaction_encryObj.to);
        //console.log(req.body.to);
        
        var coinName = 'eth';
        //if (transaction_encryObj.address != req.body.address || transaction_encryObj.address != req.body.address) {
        if (transaction_encryObj.to != req.body.to || transaction_encryObj.to != req.body.to) {
            return res.status(500).json({ error: "Invaild request. EndPoint Does not exits" });
        }   
        //Check if Transaction ID already exists in database    
        var txData = await ETH_TRANS.findOne({where: {txid: req.body.tx_id}});
        if( txData ){
            console.log("Duplicate request 1.");
            return res.status(400).send({"message":"Duplicate request 1."});
        }
        
        try {
            var wallet = await ETH_TABLE.findOne({ where:{ address: req.body.to } });
            //console.log("wallet webhook", wallet);

            if(wallet){
                var transaction_receipt = await ethHelper.get_transaction( req.body.tx_id );
                console.log("transaction_receipt--123",transaction_receipt)
                if (transaction_receipt.status == false) {
                    return res.json({ message: "Got Web hook." });
                } else {
                    var txData = await ETH_TRANS.findOne({where: {txid: req.body.tx_id}});
                    if( !txData ){

                        //Check if to addresses alloted to any user
                        var dataAlot = await TABLE_ALOTMENT.findOne({ where:{ address_id : wallet.dataValues.id , address_type: coinName } });

                        if( dataAlot ){

                            //console.log("dataAlot",dataAlot);

                            var address_from = req.body.from_address;
                            var address_to = req.body.to;
                            var amount = req.body.amount;
                            var state = 'confirmed';
                            var txid = req.body.tx_id;
                            var block_id = req.body.block_id;
                            var walletid = 'null';
                            var userId = dataAlot.dataValues.user_id;

                            let data = {
                                address_id: wallet.dataValues.id,
                                wallet_id: walletid,
                                txid: txid,
                                amount: amount,
                                address_from: address_from,
                                address_to: address_to,
                                user_id: userId,
                                coin: coinName,
                                block_id: block_id,
                                type: 'deposit',
                                status: state
                            }    
                            var createTrnxs =  await ETH_TRANS.create(data);
                            //console.log("createTrnxs",createTrnxs);
                            if(createTrnxs){
                                var lastTrnxId = createTrnxs.dataValues.id;
                                //console.log("lastTrnxId",lastTrnxId);
                                helper.getcoinpriceOnlineweb_hook(coinName,userId,amount);

                                //Transfer ETH amount to central wallet
                                var secret = wallet.dataValues.secret;
                                var transferStatus = ethHelper.transferCrypto(lastTrnxId,coinName,userId,amount,address_to,secret);

                                res.status(200).send({"message":"User balance deposited successfully!"});
                            }else{
                                res.status(400).send({"message":"Unable to update user balance."});
                            }
                        }
                        else{
                            console.log("'To' address not found.");
                            res.status(400).send({"message":"'To' address not found."});
                        }

                    }else{
                        console.log("Duplicate request.");
                        res.status(400).send({"message":"Duplicate request."});
                    }
                }
            }else {
                console.log("Invaild request, EndPoint does not exist");
                return res.status(500).json({ error: "Invaild request, EndPoint does not exist" });
            }
        } catch (error) {
            console.log("fullnode error:", error);
            return res.status(500).json({ error: error });
        }
        
    }    
}