// Created by: BennyYasuo, 2019.05.24

const db = require('mongoose');
const Cookie = require('../schema/cookieSchema');
db.connect("mongodb://localhost/kfpbot");

module.exports.run = async (client, channel, username, display) => {

    Cookie.findOne({
        username: username
    }, (err, cookie) => {
        if(err) console.log(err);
        if(!cookie) {
            return client.say(channel, `${display} has no cookies!`);
        } else {
            if(cookie.cookie == 0) return client.say(channel, `${cookie.displayname} has no cookies!`)
            if(cookie.cookie == 1) return client.say(channel, `${cookie.displayname} currently has ${cookie.cookie} cookie. (Worth ${cookie.cookie * 150} KFP$)`);
            return client.say(channel, `${cookie.displayname} currently has ${cookie.cookie} cookies. (Worth ${cookie.cookie * 150} KFP$)`);
        }
    });

}

module.exports.help = {
    name: "cookies"
}