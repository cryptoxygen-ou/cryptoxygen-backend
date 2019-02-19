 var config = {    
    //'APP_MODE': 'local', //stage,live
    'SECRET': '2@!8Oxy',
    //Website details
    'SITE_URL': 'https://cryptoxygen.io/#',
    'BASE_URL': 'https://api.cryptoxygen.io/',
    'BCC_EMAILS': '',
    //Google Captcha
    // 'GOOGLE_CAPTCHA_KEY': '6Lcr9HYUAAAAAJcVFHGrbBoXWuy5W6WhViS-fWsZ',
    'GOOGLE_CAPTCHA_KEY': '6LfkqX4UAAAAAIqb3b8zno9BlXzv2ILLPn4ZW8YN',
    //bitgo TEST details
    'TEST_BITGO_COIN_PREFIX': 't',
    'TEST_BITGO_ETH_WALLET_ID': '',
    'TEST_BITGO_ACCESS_TOKEN': '',
    'TEST_BITGO_API_URL': 'https://test.bitgo.com/api/v2/',
    //Live Bitgo details
    'BITGO_COIN_PREFIX': '',
    'BITGO_ETH_WALLET_ID': '',
    'BITGO_ACCESS_TOKEN': '',
    'BITGO_API_URL': 'https://www.bitgo.com/api/v2/',
    //Database details
    'DATABASE_HOST': 'HOST',
    'DATABASE_NAME': 'NAME',
    'DATABASE_USER': 'USER',
    'DATABASE_PASSWORD': 'PASSWORD',
    //ETH blockchain
    'NODE_URL': 'YOUR_NODE_URL',

    //SMTP
    'SMTP_HOST': 'HOST',
    'SMTP_PORT': 1234,
    'SMTP_USER' : 'apikey',
    'SMTP_PASSWORD': 'PASSWORD',

    //AWS S3 bucket details
    'ACCESS_KEY' : 'YOUR_ACCESS_KEY',
    'SECRET_KEY' : 'YOUR_SECRET_KEY',
    'BUCKET_NAME' : 'YOUR_BUCKET_NAME',

    //Crypto compare api
    'CRYPTOCOMPARE_API_URL': 'URL',
    'CRYPTOCOMPARE_API_KEY': 'KEY',
    
    //Central account
    'ETH_DEPOSIT_ADDRESS': 'ADDRESS',    
    'ETH_GAS_PRICE': '5000000000' //5GWEI
}
module.exports = config;