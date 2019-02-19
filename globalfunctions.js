
pe = require('parse-error');
var CryptoJS = require('crypto-js');
const config  = require('./config/config');

ReE = function(res,code,msg,error){
    let send_data = {success:false,status:code,message:msg,error :error };

    return res.json(send_data);
}

ReS = function(res,code,msg,data, token ){ 
    let send_data = {success:true,status:code,message:msg,token:token,data:data};
    return res.json(send_data);
};
returnOP = {
    success:function(response,statusCode,message,data,token){
        console.log("return success................************");
        let returnData = {status:true,statusCode:statusCode,message:message};
        if(data!=undefined || data!=null){
            returnData['data']=data;
        }
        if(token!=undefined || token!=null){
            returnData['token']=token;
        }
        return response.json(returnData);
    },
    fail:function(response,statusCode,message,error){
        console.log("return failed................???????");
        let returnData = {status:false,statusCode:statusCode,message:message};
        if(error!=undefined || error!=null){
            returnData['error']=error;
        }
        return response.json(returnData);
    }
};

//Ecryption plain string
encrypt = function(plainText){
    var ciphertext = CryptoJS.AES.encrypt(plainText, config.SECRET).toString();
    return ciphertext;
}

//Decrypt string to original value
decrypt = function(ciphertext){
    var bytes  = CryptoJS.AES.decrypt(ciphertext, config.SECRET);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}