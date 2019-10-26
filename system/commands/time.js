// Created by: BennyYasuo, 2019.03.17

var request = require('request');
var cheerio = require('cheerio');

module.exports.run = async (client, channel) => {
    request('https://www.timeanddate.com/worldclock/croatia/split', function(error, response, html) 
    {
        if(!error)
        {
            const $ = cheerio.load(html);
            const hour = $('#ct').text();
            const type = $('#cta').text();
            client.say(channel, "Current time in KFP's time zone: " + hour + ", " + type);
        }
        else if(error) {
            client.say(channel, "An error has occurred while requesting the Time. Please contact BennyYasuo or KFP.");
        }
    });
}

module.exports.help = {
    name: "time"
}