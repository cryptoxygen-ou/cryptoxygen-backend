var config = require('../../../../config/config');
require('../../../../globalfunctions');
var db = require('../../../../config/db');

module.exports = {

    web3Instance: async() => {
        var nodeUrl = config.NODE_URL;
        const Web3 = require('web3');        
        var provider = new Web3.providers.HttpProvider(nodeUrl);
        var web3 = new Web3(provider);
        return web3;
    },

    ethGetAddress: async() => {
        var web3 = await module.exports.web3Instance();
        var accounts = await web3.eth.accounts.create();
        return accounts;
    },

    get_transaction: async(txid) => {
        var web3 = await module.exports.web3Instance();
        return await web3.eth.getTransactionReceipt(txid);
    },

    //Move funds to central account
    transferCrypto: async(lastTrnxId,coinName,userId, total_amount, user_deposit_wallet, secret) => {
        var amount = await module.exports.get_eth_balance(user_deposit_wallet,true);
        //console.log("amt",amount);
        //return 
        var secret = decrypt(secret);
        var to = config.ETH_DEPOSIT_ADDRESS;        
        var moveEthStatus = await module.exports.eth_move_to_central_account(lastTrnxId,userId,to,amount,secret,user_deposit_wallet);
    },

    eth_move_to_central_account: async (lastTrnxId,userId,to, amount, secret, user_deposit_wallet) => {
        var web3 = await module.exports.web3Instance();
        const gasPrice = config.ETH_GAS_PRICE; //5 Gwei
        secret = secret.replace('0x','');
        
        console.log("secret 0x replaced -------- ",secret); 
        console.log("From to To wallet -------- : ",{'from':user_deposit_wallet, 'to':to });

        var amountWei = await web3.utils.toWei(amount.toString(),'ether');

        //console.log("user eth to wei -------- :",{'eth balance':amount, 'eth to wei': amountWei });

        var estimateGas = await module.exports.getGasEstimation(to, amountWei);
        //estimateGas = estimateGas+1000; //buffer of 1000
        //console.log("estimateGas -------- ",estimateGas);
        
        var getNonce = await web3.eth.getTransactionCount(user_deposit_wallet);        
        
        //console.log("gas in wei: ",gasPrice);
        //console.log('estimated gas:',estimateGas)
        
        var gasCostInWei = (gasPrice*estimateGas);
        //console.log('total trnx gas cost in wei --------- ',gasCostInWei );        
        
        var finalEthInWei = amountWei-gasCostInWei;
        //finalEthInWei = 0.00000001;
        //Check if GasEstimation is higher than Final transfer amount
        var currentUTCDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        if( finalEthInWei <  gasCostInWei ){
            let query = `INSERT INTO eth_central_transactions SET 
            txid='',
            actual_balance='${amount}',
            actual_balance_wei='${amountWei}',
            transaction_cost ='${gasCostInWei}',
            final_balance_moved=0,
            eth_transactions_id=${lastTrnxId},
            user_id=${userId},
            status='FAILED',
            block_id=0,
            createdAt='${currentUTCDateTime}',
            updatedAt='${currentUTCDateTime}'
            `;
            var queryRes = await db.connection.query(query);
            console.log("Can't move eth from user wallet to central wallet, Gas cost estimation is higher than final eth amount transfer.");
            return;
        }

        //console.log('final eth in wei -------- :', finalEthInWei );
        // var gasPriceInEth = await web3.utils.fromWei(gasPrice,'ether');
        // console.log("gasPriceToEth",gasPriceInEth);
        // var gasPriceTotal = (gasPriceInEth*estimateGas).toString();
        // gasPriceTotal = parseFloat(gasPriceTotal);
        // console.log("gasPriceTotal",gasPriceTotal);
        //var txTotalGasCostInEth = parseFloat(gasPriceTotal).toFixed(6); //from etherscan.io Actual Tx Cost/Fee ,upto 6 decimal places
        //Subtract Gas Tx cost from value
        //var finalEthAmount = amount-txTotalGasCostInEth;
        //var finalEthAmount = amount-gasPriceTotal;
        //var updatedEthValueInWei = await web3.utils.toWei( finalEthInWei.toString() ,'ether');

        var value = await web3.utils.toHex(finalEthInWei);

        //getNonce = 120;
        //console.log("LIVE eth nonce count:",getNonce);        
        //console.log("updatedEthValue",updatedEthValueInWei);
        //return;

        var serializedTx = await module.exports.signTransactions(to, value, secret, user_deposit_wallet, getNonce, estimateGas, gasPrice );

        console.log("serializedTx",serializedTx);
        
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), async function(error, txid){
            if (error == null){
                console.log("tranxHash:",txid);
                //cb(null, {txid:txid,tranxCost:txTotalGasCostInEth,finalEthAmount:finalEthAmount});
                let query = `INSERT INTO eth_central_transactions SET 
                    txid='${txid}',
                    actual_balance='${amount}',
                    actual_balance_wei='${amountWei}',
                    transaction_cost ='${gasCostInWei}',
                    final_balance_moved='${finalEthInWei}',
                    eth_transactions_id=${lastTrnxId},
                    user_id=${userId},
                    status='SUCCESS',
                    block_id=0,
                    createdAt='${currentUTCDateTime}',
                    updatedAt='${currentUTCDateTime}'
                    `;
                    var queryRes = await db.connection.query(query);

            } else {
                //cb(error, null);
                console.log("sendEthError",error);
            }            
        });
    },

    /**
     * Sign ETH transaction
     */
    signTransactions: async (to, value, secret, user_deposit_wallet, getNonce, estimateGas, gasPrice)=>{
        var web3 = await module.exports.web3Instance();
        var Tx = require('ethereumjs-tx');
        var privateKeyBuf = new Buffer(secret, 'hex');
        
        var rawTx = {
            to: to,
            value: value,
            from: user_deposit_wallet,
            nonce: web3.utils.toHex(getNonce),
            gasLimit: web3.utils.toHex(estimateGas),
            gasPrice: web3.utils.toHex(gasPrice)
        }
        console.log("rawTx",rawTx);
        var tx = new Tx(rawTx);
        tx.sign(privateKeyBuf);
        var serializedTx = tx.serialize();
        return serializedTx;
    },
    /** Get gas estimation on transaction */
    getGasEstimation: async (toAddress, amount, next) => {
        var web3 = await module.exports.web3Instance();
        var gasEstimate = await web3.eth.estimateGas({
            to: toAddress, 
            value: web3.utils.toHex(amount) //web3.utils.toWei(bal.toString(18))
        });            
        return gasEstimate;
    },

    //GET eth balance
    get_eth_balance: async(address, in_eth)=>{
        var web3 = await module.exports.web3Instance();
        var bal = await web3.eth.getBalance(address);
        console.log("eth balance",bal);
        return in_eth ? web3.utils.fromWei(bal.toString(18)) : bal;
    }

}

//var transferStatus = module.exports.transferCrypto('eth',2, 0.011, '0xF7977584D8ec5960dE306e69Cb199C371B654087','U2FsdGVkX19ZSogMYoBtoIPYwUTsTJSvrQbupC6l5GRebGYaWM9J1UMJgOtZN58rigNm1mkGlVh0GEB8SqQhhdEz2eMW9wtTN2JQqajhZowzYMZXzcCjpG+XnUi5nyo8');