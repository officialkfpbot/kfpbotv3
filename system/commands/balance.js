// Created by: BennyYasuo, 2019.03.17

const db = require('mongoose');
const Balance = require('../schema/balanceSchema.js');
db.connect("mongodb://localhost/kfpbot");

module.exports.run = async (client, channel, username, displayname, args) => {

    if(!args[0])
    {
        Balance.findOne({
            username: username
        }, (err, balance) => {
            if(err) console.log(err);
            if(!balance) {
                return client.say(channel, `${displayname} currently has 0 KFP$.`);
            } else {
                return client.say(channel, `${displayname} currently has ${balance.balance} KFP$.`);
            }
        });
    } else {
        Balance.findOne({
            username: args[0].toLowerCase()
        }, (err, balance) => {
            if(err) console.log(err);
            if(!balance) {
                return client.say(channel, `${username} currently has 0 KFP$.`);
            } else {
                return client.say(channel, `${balance.displayname} currently has ${balance.balance} KFP$.`);
            }
        });
    }
}

module.exports.help = {
    name: "balance"
}