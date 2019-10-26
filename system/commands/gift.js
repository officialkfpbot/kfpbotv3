// Created by: BennyYasuo, 2019.05.26

const db = require('mongoose');
const Stats = require('../util/StatsUtil.js');
const Cookie = require('../schema/cookieSchema.js');
db.connect("mongodb://localhost/kfpbot");

module.exports.run = async (client, channel, username, displayname, amount, target) => {

    Cookie.findOne({
        username: username
    }, (err, cookie) => {
        if(err) console.log(err);
        if(!cookie || cookie.cookie == 0) {
            return client.say(channel, `${displayname} - You do not have any cookies to gift!`);
        } else {
            Cookie.findOne({
                username: target
            }, (err, cookie2) => {
                if(err) console.log(err);
                if(!cookie2) {
                    if(cookie.cookie >= amount) {
                        const newCookie = new Cookie({
                            username: target,
                            displayname: target,
                            cookie: amount
                        });
                        newCookie.save().catch(err => console.log(err));
                        cookie.cookie = cookie.cookie - amount;
                        cookie.save().catch(err => console.log(err));
                        Stats.addCookiesGifted(username, amount);
                        return client.say(channel, `${displayname} - You gifted ${amount} cookies to ${target}!`);
                    } else {
                        return client.say(channel, `${displayname} - You do not have ${amount} cookies! :/`);
                    }
                } else {
                    if(cookie.cookie >= amount) {
                        cookie2.cookie = cookie2.cookie + amount;
                        cookie2.save().catch(err => console.log(err));
                        cookie.cookie = cookie.cookie - amount;
                        cookie.save().catch(err => console.log(err));
                        Stats.addCookiesGifted(username, amount);
                        return client.say(channel, `${displayname} - You gifted ${amount} cookies to ${cookie2.displayname}!`);
                    } else {
                        return client.say(channel, `${displayname} - You do not have ${amount} cookies! :/`);
                    }
                }
            });
        }
    });
}

module.exports.help = {
    name: "gift"
}