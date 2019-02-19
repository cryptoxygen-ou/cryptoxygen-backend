const express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var passport = require('passport');
var ethController = require('./controllers/ethController');

router.get('/get_eth_address',passport.authenticate('jwt',{session: false}), ethController.get_address);
router.post('/fullnode_webhook', ethController.fullNodeWebhook);

module.exports = router;