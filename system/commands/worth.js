// Created by: BennyYasuo, 2019.05.25

const db = require('mongoose');
const Balance = require('../schema/balanceSchema.js');
const Cookie = require('../schema/cookieSchema.js');
db.connect("mongodb://localhost/kfpbot");

module.exports.run = async (client, channel, username, displayname, args) => {

    if(!args[0])
    {
        Balance.findOne({
            username: username
        }, (err, balance) => {
            if(err) console.log(err);
            if(!balance) {
                return;
            } else {
                Cookie.findOne({
                    username: username
                }, (err, cookie) => {
                    if(err) console.log(err);
                    if(!cookie) {
                        return client.say(channel, `${displayname} is worth ${balance.balance} KFP$.`);
                    } else {
                        return client.say(channel, `${displayname} is worth ${balance.balance + cookie.cookie*150} KFP$.`)
                    }
                });
            }
        });
    } else {
        Balance.findOne({
            username: args[0].toLowerCase()
        }, (err, balance) => {
            if(err) console.log(err);
            if(!balance) {
                return client.say(channel, `User has no record in database.`);
            } else {
                Cookie.findOne({
                    username: args[0].toLowerCase()
                }, (err, cookie) => {
                    if(err) console.log(err);
                    if(!cookie) {
                        return client.say(channel, `${balance.displayname} is worth ${balance.balance} KFP$.`);
                    } else {
                        return client.say(channel, `${balance.displayname} is worth ${balance.balance + cookie.cookie*150} KFP$.`) 
                    }
                });
            }
        });

    }

}

module.exports.help = {
    name: "worth"
}