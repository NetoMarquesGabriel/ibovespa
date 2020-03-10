var config = require('./config.js');
var twitter = require('twitter');
var fs = require('fs');
var twit = new twitter(config.twitter);
var moment = require('moment');

var intervalLength = 300000;
var saveData = {since_id: 0, lastNormalTweet: 0, lastValue: 0, last_id: '0'};
var currentState = 1;

function checkIbovespaValue() {
        console.log('-------------------------------');
        console.log("check IBOVESPA value");
        var request = require("request");

        var url = "https://api.hgbrasil.com/finance?key=" + config.keyAcessHgBrasil;
        
        request({
            url: url,
            json: true
        }, function (error, response, body) {
        
            if (!error && response.statusCode === 200) {
               var response = {};
               if (body.results.stocks.IBOVESPA.points !== saveData.lastValue) {
                console.log(body.results.stocks.IBOVESPA);
                var data = new Date();
                var hora    = data.getHours();          // 0-23
                var min     = data.getMinutes();        // 0-59
                   if (body.results.stocks.IBOVESPA.points > saveData.lastValue) {
                    response.status = 'iBovespa subiu :) - ' + body.results.stocks.IBOVESPA.points + ' pontos às ' + hora + ':' + min + '. Variação: ' + body.results.stocks.IBOVESPA.variation + '%.';
                    console.log(response.status);
                   } else {
                    response.status = 'iBovespa caiu ): - ' + body.results.stocks.IBOVESPA.points + ' pontos às ' + hora + ':' + min + '. Variação: ' + body.results.stocks.IBOVESPA.variation + '%.';
                    console.log(response.status); 
                   }
                    console.log('try to post');
                    console.log('lastValue -> ' + body.results.stocks.IBOVESPA.points);
                    saveData.lastValue = body.results.stocks.IBOVESPA.points;
                    doTweet(response);
               } else {
                   console.log('no changes!');
               }
            }
        })

    }

function doTweet(tweetData) {
    if (typeof tweetData.status === "undefined"){
        return;
    }
  
    twit.post('statuses/update', tweetData, function(error, body, response) {
        if(error) {console.log("doTweet Error:");console.log(error);}
        
    });
}
console.log('starting');
checkIbovespaValue();
var response = {};
response.status = 'Hello World';
// doTweet(response);
setInterval(checkIbovespaValue, intervalLength);
//setInterval(checkFavableTweets, favIntervalLength);
//checkFavableTweets();
//changeState(currentState);
//setInterval(potentiallyChangeState, intervalLength * 6 * 30)