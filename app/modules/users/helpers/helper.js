const config = require('../../../../config/config');
const rp = require('request-promise');

//Db tables
var TABLE_ICO = require('../schemas/icoSchema');
var USR_COL = require('../schemas/userCollection');

module.exports = {

    getCoinPrice:()=>{
        var resultAry = [];
        const requestOptions = {
            method: 'GET',
            uri: config.CRYPTOCOMPARE_API_URL,
            qs: { start: 1, limit: 10, convert: 'USD', cryptocurrency_type: 'coins' },
            headers: { 'X-CMC_PRO_API_KEY': config.CRYPTOCOMPARE_API_KEY },
            json: true,
            gzip: true
        };
        return new Promise(function(resolve, reject) {
            rp(requestOptions).then(response => {
                if(response.data.length>0){
                    var d = response.data
                    d.forEach(element => {
                        if(element.id == 1)
                        {
                            //BTC
                            var btcPrice = element.quote.USD.price
                            resultAry['btc_price'] = btcPrice
                            //console.log(btcPrice)
                        }
                        if(element.id == 1027)
                        {
                            //ETH
                            var ethPrice = element.quote.USD.price
                            resultAry['eth_price'] = ethPrice
                            //console.log(ethPrice)
                        }
                        if(element.id == 2)
                        {
                            //LTC
                            var ltcPrice = element.quote.USD.price
                            resultAry['ltc_price'] = ltcPrice
                            //console.log(ltcPrice)
                        }
                    });
                }
                resolve(resultAry);

            }).catch((err) => {
                reject(err);
            })
        })
    },

    getCoinPriceLatestQuotes: ()=>{
        var resultAry = [];
        const requestOptions = {
            method: 'GET',
            uri: config.CRYPTOCOMPARE_API_URL,
            qs: { convert: 'USD', symbol: 'BTC,LTC,ETH' },
            headers: { 'X-CMC_PRO_API_KEY': config.CRYPTOCOMPARE_API_KEY },
            json: true,
            gzip: true
        };
        return new Promise(function(resolve, reject) {
            rp(requestOptions).then(response => {
                if(response.data){
                    var d = response.data;
                    for (var key in d) {
                        if (d.hasOwnProperty(key)) {
                            var val = d[key];
                        }
                    }
                    for (var key in d) {
                        if (d.hasOwnProperty(key)) {
                            var element = d[key];
                            if(element.id == 1) //BTC
                            {
                                var btcPrice = element.quote.USD.price
                                var percentChange1h = element.quote.USD.percent_change_1h
                                resultAry['btc_price'] = {
                                    "name":"Bitcoin",
                                    "symbol": "btc",
                                    "price": btcPrice,
                                    "percentage_1h": percentChange1h,
                                }
                            }
                            if(element.id == 1027) //ETH
                            {
                                var ethPrice = element.quote.USD.price
                                var percentChange1h = element.quote.USD.percent_change_1h
                                resultAry['eth_price'] = {
                                    "name":"Ethereum",
                                    "symbol": "eth",
                                    "price": ethPrice,
                                    "percentage_1h": percentChange1h,
                                }
                            }
                            if(element.id == 2) //LTC
                            {
                                var ltcPrice = element.quote.USD.price
                                var percentChange1h = element.quote.USD.percent_change_1h
                                resultAry['ltc_price'] = {
                                    "name":"Litecoin",
                                    "symbol": "ltc",
                                    "price": ltcPrice,
                                    "percentage_1h": percentChange1h,
                                }
                            }
                        }
                    }
                }else{
                    console.log("Inside else ")
                }
                resolve(resultAry)

            }).catch((err) => {
                reject("Unable to fetch latest crypto price:"+err);
                //console.log('API call error:', err.message);
            })
        })
    },    

    getcoinpriceOnlineweb_hook: async function(c_name,userId,amount) {

        console.log('test',c_name)
        console.log('user_id',userId)
        console.log('amount',amount)
    
        // we have data for eth = how many erc20 tokens
        TABLE_ICO.findAll({
            include:[     
        ],     where:{ address_type : 'eth', ico_phase_active: 1 }
        })    
        .then((response) => {
            var result = []
            if(response[0].dataValues.erc_tokens != '')
            {
                var ethErc20 = response[0].dataValues.erc_tokens;    
                // now get current price of eth to usd    
                var cryptoPrices = module.exports.getCoinPrice();
                cryptoPrices.then(function(resultData){
                    console.log(resultData);        
                    if(resultData.btc_price){
                        var totalErc20tokens;
                        //ETH
                        var ethprice = resultData.eth_price // IN USD 
                        // we found one erc20 = how many dollers
                        var oneErc20Token = ethprice / ethErc20;
                        result['oneeth_to_erc20'] = ethErc20
                        result['oneerc20_to_doller'] = oneErc20Token
            
                        //BTC
                        var btcprice = resultData.btc_price
                        // now we found one btc to doller
                        // now one btc to how many erc20 token
                        var onebtctoErc20 = btcprice / oneErc20Token 
                        result['onebtc_to_erc20'] = onebtctoErc20
            
                        //LTC 
                        var ltcprice = resultData.ltc_price
                        // we get ltc price over doller
                        var oneltctoErc20 = ltcprice / oneErc20Token
            
                        result['oneltc_to_erc20'] = oneltctoErc20
            
                        if(c_name == 'btc')
                        {
                            totalErc20tokens = result['onebtc_to_erc20'] * amount;
                        }
                        else if(c_name == 'ltc')
                        {
                            totalErc20tokens = result['oneltc_to_erc20'] * amount;
                        }
                        else if(c_name == 'eth')
                        {
                            totalErc20tokens = result['oneeth_to_erc20'] * amount;
                        }
            
                        USR_COL.create({
                            user_id : userId,
                            coin : c_name,
                            amount : amount,
                            token_value : totalErc20tokens
                        }).then((usercol) => {
                            // console.log(usercol);
                        }) 
                        // now insert these total tokens to useracount
                        return result;
                    }
                })
               
            }
    
        })
        .catch((err) => {
            ReE(res,400,"something went wrong",err);
        })
    },

    /**
    * Get coins online price local
    */
    getCoinPriceOnlineLocal: async function(){

        var result = []
        // we have data for eth = how many erc20
        var tbICO = await TABLE_ICO.findOne({ where:{ address_type : 'eth', ico_phase_active: 1 } })

        if( tbICO.dataValues ){
            var data = tbICO.dataValues
            var ethErc20token = data.erc_tokens
            var cryptoPrices = await module.exports.getCoinPrice()

            if(cryptoPrices.btc_price){
                //ETH
                var ethprice = cryptoPrices.eth_price
                // we found one erc20 token = how many dollers
                var oneErc20token = ethprice / ethErc20token
                result['oneeth_to_erc20'] = ethErc20token
                result['oneerc20_to_doller'] = oneErc20token

                //BTC
                var btcprice = cryptoPrices.btc_price
                // now we found one btc to doller
                // now one btc to how many erc20 tokens
                var onebtctoerc20 = btcprice / oneErc20token 
                result['onebtc_to_erc20'] = onebtctoerc20

                //LTC 
                var ltcprice = cryptoPrices.ltc_price
                // we get ltc price over doller
                var oneltctoerc20 = ltcprice / oneErc20token
                result['oneltc_to_erc20'] = oneltctoerc20

                var myval = {
                        status: true,
                        data:{
                            oneeth_to_erc20: result['oneeth_to_erc20'],
                            oneerc20_to_doller: result['oneerc20_to_doller'],
                            onebtc_to_erc20: result['onebtc_to_erc20'],
                            oneltc_to_erc20: result['oneltc_to_erc20']
                        }
                    }
            }
        }else{
            var myval = {
                    status: false,
                    data:{
                        oneeth_to_erc20: 0,
                        oneerc20_to_doller: 0,
                        onebtc_to_erc20: 0,
                        oneltc_to_erc20: 0
                    }
                } 
        }
        return myval;
    }, 
    
}

