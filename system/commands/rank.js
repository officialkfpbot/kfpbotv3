// Created by: BennyYasuo, 2019.03.17

var request = require('request');
var cheerio = require('cheerio');

module.exports.run = async (client, channel) => {
    request('http://eune.op.gg/summoner/userName=twitchtv+kfpgod', function(error, response, html) 
    {
        if(!error)
        {
            const $ = cheerio.load(html);
            const rank = $('div.TierRankInfo > div.TierRank').text();
            const lp = $('span.LeaguePoints').text();
            const wins = $('span.WinLose > span.wins').text();
            const losses = $('span.WinLose > span.losses').text();
            const winrate = $('span.WinLose > span.winratio').text();
            client.say(channel, `KFP YT: ${rank} ${lp}, ${wins} / ${losses}, ${winrate} `);
        }
        else if(error) 
        {
            client.say(channel, "An error has occurred while requesting the Rank. Please contact BennyYasuo or KFP.");
        }
    });
}

module.exports.help = {
    name: "rank"
}