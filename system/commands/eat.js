// Created by: BennyYasuo, 2019.05.26

const db = require('mongoose');
const Cookie = require('../schema/cookieSchema.js');
const Stats = require('../util/StatsUtil.js');
db.connect("mongodb://localhost/kfpbot");

module.exports.run = async (client, channel, username, displayname, amount) => {

    if(!amount)
    {
        Cookie.findOne({
            username: username
        }, (err, cookie) => {
            if(err) console.log(err);
            if(!cookie || cookie.cookie == 0) {
                return client.say(channel, `${displayname} - You do not have any cookies to eat!`);
            } else {
                if(cookie.cookie == 1)
                {
                    cookie.cookie = cookie.cookie - 1;
                    cookie.save().catch(err => console.log(err));
                    Stats.addCookiesEaten(username, 1);
                    return client.say(channel, `${displayname} - You just ate a cookie! How could you?!`);
                }
            }
        });
    } else {
        Cookie.findOne({
            username: username
        }, (err, cookie) => {
            if(err) console.log(err);
            if(!cookie || cookie.cookie == 0) {
                return client.say(channel, `${displayname} - You do not have any cookies to eat!`);
            } else {
                if(cookie.cookie < amount) return client.say(channel, `${displayname} - You do not have ${amount} cookies!`);
                cookie.cookie = cookie.cookie - amount;
                cookie.save().catch(err => console.log(err));
                Stats.addCookiesEaten(username, amount);
                if(amount == 1) return client.say(channel, `${displayname} - You ate a cookie!`);
                return client.say(channel, `${displayname} - You ate ${amount} cookies! Are you insane?!`);
            }
        });
    }
}

module.exports.help = {
    name: "eat"
}