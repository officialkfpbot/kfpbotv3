// Created by: BennyYasuo, 2019.03.18

const db = require('mongoose');
const Balance = require('../schema/balanceSchema.js');
const CookieUtil = require('../util/CookieUtil.js');
db.connect("mongodb://localhost/kfpbot");

/**
 * @author: BennyYasuo
 * @returns: Adds to a specified person's balance
 * @param {String} user User
 * @param {Number} amount Amount
 * @param client Client
 * @param {String} channel Channel
 * @nullable {String} action Action ("give")
 * @nullable {String} announcement Announcement  
 */

function add(user, amount, client, channel, action, announcement) {
    Balance.findOne({
        username: user
    }, (err, balance) => {
        if(err) console.log(err);
        if(!balance) {
            const newBalance = new Balance({
                username: user,
                displayname: user,
                balance: amount
            })
            newBalance.save().catch(err => console.log(err));
            if(action === "give") {
                return client.say(channel, `Added ${amount} KFP$ to ${user}'s balance. Their new balance: ${amount} KFP$. (No record found within the database, are you sure this is the right person?)`);
            }
        } else {
            balance.balance = balance.balance + amount;
            balance.save().catch(err => console.log(err));
            if(action === "give") {
                return client.say(channel, `Added ${amount} KFP$ to ${balance.displayname}'s balance. Their new balance: ${balance.balance} KFP$.`);
            }
            if(action === "gamble") {
                let balstring = announcement + ` (New balance: ${balance.balance} KFP$)`;
                return client.say(channel, balstring);
            }
        }
    });
}

/**
 * @author: BennyYasuo
 * @returns: Removes from a specified person's balance
 * @param {String} user User
 * @param {Number} amount Amount
 * @param client Client
 * @param {String} channel Channel
 * @nullable {String} action Action ("take")
 * @nullable {String} announcement Announcement  
 */
function remove(user, amount, client, channel, action, announcement, displayname) {
    Balance.findOne({
        username: user
    }, (err, balance) => {
        if(err) console.log(err);
        if(!balance) {
            if(action === "take") {
                return client.say(channel, `${user} has no record in the database.`);
            }
        } else {
            if(balance.balance >= amount)
            {
                balance.balance = balance.balance - amount;
                if(action === "take") {
                    return client.say(channel, `Removed ${amount} KFP$ from ${balance.displayname}'s balance. Their new balance: ${balance.balance} KFP$.`);
                }
                if(action === "gamble") {
                    let balstring = announcement + ` (New balance: ${balance.balance} KFP$)`;
                    return client.say(channel, balstring);
                }
                if(action === "buycookie") {
                    return client.say(channel, `Here is your cookie ${displayname}, 🍪 (New balance: ${balance.balance} KFP$)`);
                }
                if(action === "buysong") {
                    return client.say(channel, `${displayname} has bought a song PogChamp`);
                }
                if (action === "buyvip") {
                    return client.say(channel, `${displayname} has bought VIP PogChamp PogChamp PogChamp (You may need to wait some time before actually receiving it, please contact KFP if you do not get it within 24 hours.)`);
                }
                balance.save().catch(err => console.log(err));
            } else {
                if(action === "take") {
                    return client.say(channel, `Couldn't remove ${amount} from ${balance.displayname}'s balance. Their current balance: ${balance.balance} KFP$.`);
                }
                if(action === "buycookie") {
                    return client.say(channel, `${displayname} can't even afford a cookie LUL (Balance: ${balance.balance} KFP$)`);
                }
                if(action === "buysong") {
                    return client.say(channel, `${displayname} can't even afford to buy a song request 4Head LUL (Balance: ${balance.balance} KFP$)`);
                }
                if (action === "buyvip") {
                    return client.say(channel, `${displayname} can't buy VIP.... so poor wtf 4Head LUL Kappa (Balance: ${balance.balance} KFP$)`);
                }
            }
        }
    });
}

function bulkCookieHelper(username, displayname, client, channel) {
    Balance.findOne({
        username: username
    }, (err, balance) => {
        if(err) console.log(err);
        if(!balance) return;
        if(balance.balance < 150) return client.say(channel, `${displayname} can't even afford a few cookies LUL (Balance: ${balance.balance} KFP$)`);
        let cookiesTotal = Math.floor(parseInt(balance.balance/150));
        let newBalance = balance.balance-cookiesTotal*150;
        CookieUtil.add(username, displayname, cookiesTotal);
        remove(username, cookiesTotal*150, client, channel, null, null, displayname);
        if(cookiesTotal == 1) return client.say(channel, `Here is your cookie ${displayname}, 🍪(New balance: ${newBalance} KFP$)`);
        return client.say(channel, `Here are your ${cookiesTotal} cookies ${displayname} (Packed inside this box!), 📦 (New balance: ${newBalance} KFP$)`);
    });
}

function removeSound(container) {
    let client = container[0];
    let channel = container[1];
    let username = container[2];
    let displayname = container[3];
    let amount = container[4];
    let execute = container[5];

    Balance.findOne({
        username: username
    }, (err, balance) => {
        if(err) console.log(err);
        if(!balance) {
            return;
        } else {
            if(balance.balance >= amount)
            {
                balance.balance = balance.balance - amount;
                balance.save().catch(err => console.log(err));
                client.say(channel, execute);
                return client.say(channel, `Here is your sound ${displayname} (New balance: ${balance.balance} KFP$)`);
            } else {
                return client.say(channel, `${displayname} can't even afford a sound LUL (Balance: ${balance.balance} KFP$)`);
            }
        }
    });

}

module.exports = { add, remove, removeSound, bulkCookieHelper }