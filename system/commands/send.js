// Created by: BennyYasuo, 2019.05.26

const db = require('mongoose');
const Balance = require('../schema/balanceSchema.js');
db.connect("mongodb://localhost/kfpbot");

module.exports.run = async (client, channel, username, displayname, amount, target) => {

    Balance.findOne({
        username: username
    }, (err, balance) => {
        if(err) console.log(err);
        if(!balance) return;
        if(balance.balance == 0) {
            return client.say(channel, `${displayname} - You do not have any KFP$ to send!`);
        } else {
            Balance.findOne({
                username: target
            }, (err, balance2) => {
                if(err) console.log(err);
                if(!balance2) {
                    if(balance.balance >= amount) {
                        const newBalance = new Balance({
                            username: target,
                            displayname: target,
                            balance: amount
                        });
                        newBalance.save().catch(err => console.log(err));
                        balance.balance = balance.balance - amount;
                        balance.save().catch(err => console.log(err));
                        return client.say(channel, `${displayname} - You sent ${amount} KFP$ to ${target}!`);
                    } else {
                        return client.say(channel, `${displayname} - You do not have ${amount} KFP$! :/`);
                    }
                } else {
                    if(balance.balance >= amount) {
                        balance2.balance = balance2.balance + amount;
                        balance2.save().catch(err => console.log(err));
                        balance.balance = balance.balance - amount;
                        balance.save().catch(err => console.log(err));
                        return client.say(channel, `${displayname} - You sent ${amount} KFP$ to ${balance2.displayname}!`);
                    } else {
                        return client.say(channel, `${displayname} - You do not have ${amount} KFP$! :/`);
                    }
                }
            });
        }
    });
}

module.exports.help = {
    name: "send"
}