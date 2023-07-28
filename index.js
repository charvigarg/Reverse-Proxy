const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const ipfilter = require('express-ipfilter').IpFilter
const TelegramBot = require('node-telegram-bot-api');
var request = require('request');


// Create Express Server
const app = express();

// Configuration
const PORT = 3015;
const HOST = "localhost";
const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";
const token = '6199423712:AAE7NBeX-6F2Wgb_yH5ZdRo17wde8YMHon8';

var message_id=1;
var kill=false;
var live_logs=true;
var count=0;
const HIGH_COUNT=4
const URLs=[
    "http://localhost:3015/ms1",
    "http://localhost:3015/ms2",
    "http://localhost:3015/ms3",
]

// Logging
app.use(morgan('dev'));

const bot = new TelegramBot(token, {polling: true});
// Allow the following IPs
const ips = ['127.0.0.1']

// Create the server
//app.use(ipfilter(ips, { mode: 'allow' }))


// Info GET endpoint
app.get('/info', (req, res, next) => {
    // if(message_id!==1){
    //     console.log(message_id);
    //     bot.sendMessage(message_id, new Date()+ 'Hello world');
    // }
    res.send('This is a proxy service which proxies to Billing and Account APIs.'+req.headers['user-agent'] 
    );
 });



 app.get('/ms1', (req, res, next) => {
    res.send('<html><body bgcolor=pink><h1> Microservice Clone 1 </h1></body></html>');
 });
 app.get('/ms2', (req, res, next) => {
    res.send('<html><body bgcolor=cyan><h1> Microservice Clone 2 </h1></body></html>');
 });
 app.get('/ms3', (req, res, next) => {
    res.send('<html><body bgcolor=yellow><h1> Microservice Clone 3 </h1></body></html>');
 });


app.get('/site', (req, res, next) => {
    count++;
    if(count==HIGH_COUNT && message_id!==1){
        bot.sendMessage(message_id, "SOS: High traffic alert");
    }
    if(message_id!==1 && live_logs){
        console.log(message_id);
        bot.sendMessage(message_id, new Date()+ ' \nEndpoint Hit: \/site  \nFrom:'+req.ip);
    }
    if(kill)
     {
        res.send("We are experiencing downtime! Please visit again later!");
     return
    }
    // res.send(''+req.headers['user-agent']
    //generate a random number between 1 and n
    var n = URLs.length;
    var random = Math.floor(Math.random() * n);
    console.log("Hitting:"+URLs[random]);
    request.get(URLs[random], function(err, response, body) {
        if (!err) {
     console.log( req.headers['user-agent']);

          res.send(body);
        }
    });    

    
 });

 // Authorization
app.use('', (req, res, next) => {
    if (req.headers.authorization) {
        next();
    } else {
        res.sendStatus(403);
    }
 });

 bot.on('message', (msg) => {

    var Hi = "Metrics";
    if (msg.text.toString().indexOf(Hi) === 0) {
    
        bot.sendMessage(msg.chat.id, "Status: Healthy \nnRequests: "+count);
        count=0;
    }
    var bye = "Block IP";
    if (msg.text.toString().includes(bye)) {
        bot.sendMessage(msg.chat.id, "Enter IP to block");
    }
    var k = "Kill Switch";
    if (msg.text.indexOf(k) === 0) {
        kill=!kill
        bot.sendMessage(msg.chat.id, "Kill Status:"+kill);

    }
    var logs = "Toggle Live Logs";
    if (msg.text.indexOf(logs) === 0) {
        live_logs=!live_logs
        bot.sendMessage(msg.chat.id, "Live logs activated:"+live_logs);
    }
    
});

bot.onText(/\/start/, (msg) => {
        
        message_id=msg.chat.id;
        console.log("Telegram Init:",msg.chat.id);
        
        bot.sendMessage(msg.chat.id, "Welcome", {
        "reply_markup": {
            "keyboard": [["Toggle Live Logs", "Kill Switch"], ["Metrics"]]
            }
        });
        
});

     
 // Proxy endpoints
app.use('/json_placeholder', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/json_placeholder`]: '',
    },
    
 }));

 

 // Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
 });

 