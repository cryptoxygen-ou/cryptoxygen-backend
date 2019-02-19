// user backend
require('./globalfunctions');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const expressValidator = require('express-validator');
var db = require('./config/db');
User = db.connection.define('users');
var fs = require('fs');
var fileUpload = require('express-fileupload');
var url = require('url');
var app = express();

// Routing 
var userRoute = require('./app/modules/users/userRoute');
var ethRoute = require('./app/modules/eth/ethRoute');

// PORT
const PORT = 8081;
app.listen(PORT,()=>{
    console.log('Server has been started at port: '+PORT);
});

// middlewares 
//middleware for cors (cross origin requests)
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require('./middlewares/passport')(passport);
app.use(fileUpload())
//body parser
app.use(bodyparser.json({limit: "50mb"}));
app.use(bodyparser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(expressValidator());

app.get('/public/uploads/:name',(req,res,next) => {
    var filePath = req.params.name; 
    fs.readFile('./public/uploads/'+filePath,(err,data) => {
     if(err){
       return res.send('file not found');
     }
     return res.sendFile('/public/uploads/'+filePath, {"root": '.'} );
    });  
});

app.get('/',(req,res)=>{
    res.send('cryptoxygen backend1 : Please use exact path...');
});
app.use('/api/v1/user',userRoute);
app.use('/api/v1/eth',ethRoute);