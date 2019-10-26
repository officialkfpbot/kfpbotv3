// Created by: BennyYasuo, 2019.06.07

const db = require('mongoose');
const Stats = require('../schema/userStatsSchema');
db.connect("mongodb://localhost/kfpbot");

/**
 * @author: BennyYasuo
 * @returns: Increases the "Commands Used" stat
 * @param {String} userName User
 */
function addCommandsUsed(userName) {
    Stats.findOne({
        username: userName, 
    }, (err, stats) => {
        if(err) console.log(err);
        if(!stats) {
            return;
        } else { 
            stats.commandsused = stats.commandsused + 1;
            stats.save().catch(err => console.log(err));
        }
    });
}

/**
 * @author: BennyYasuo
 * @returns: Increases the "Cookies Eaten" stat by a given amount
 * @param {String} userName User
 * @param {Number} amount Amount
 */
function addCookiesEaten(userName, amount) {
    Stats.findOne({
        username: userName, 
    }, (err, stats) => {
        if(err) console.log(err);
        if(!stats) {
            return;
        } else { 
            stats.cookieseaten = stats.cookieseaten + amount;
            stats.save().catch(err => console.log(err));
        }
    });
}

/**
 * @author: BennyYasuo
 * @returns: Increases the "Cookies Gifted" stat by a given amount
 * @param {String} userName User
 * @param {Number} amount Amount
 */
function addCookiesGifted(userName, amount) {
    Stats.findOne({
        username: userName, 
    }, (err, stats) => {
        if(err) console.log(err);
        if(!stats) {
            return;
        } else { 
            stats.cookiesgifted = stats.cookiesgifted + amount;
            stats.save().catch(err => console.log(err));
        }
    });
}

/**
 * @author: BennyYasuo
 * @returns: Increases the "Money Gambled" stat by a given amount
 * @param {String} userName User
 * @param {Number} amount Amount
 */
function addMoneyGambled(userName, amount) {
    Stats.findOne({
        username: userName, 
    }, (err, stats) => {
        if(err) console.log(err);
        if(!stats) {
            return;
        } else { 
            stats.moneygambled = stats.moneygambled + amount;
            stats.save().catch(err => console.log(err));
        }
    });
}

/**
 * @author: BennyYasuo
 * @returns: Increases the "Gained from Gambling" stat by a given amount
 * @param {String} userName User
 * @param {Number} amount Amount
 */
function addMoneyGained(userName, amount) {
    Stats.findOne({
        username: userName, 
    }, (err, stats) => {
        if(err) console.log(err);
        if(!stats) {
            return;
        } else { 
            stats.moneygained = stats.moneygained + amount;
            stats.save().catch(err => console.log(err));
        }
    });
}


/**
 * @author: BennyYasuo
 * @returns: Increases the "Times Worked" stat
 * @param {String} userName User
 */
function addTimesWorked(userName) {
    Stats.findOne({
        username: userName, 
    }, (err, stats) => {
        if(err) console.log(err);
        if(!stats) {
            return;
        } else { 
            stats.timesworked = stats.timesworked + 1;
            stats.save().catch(err => console.log(err));
        }
    });
}

/**
 * @author: BennyYasuo
 * @returns: Increases the "Gained from Working" stat by a given amount
 * @param {String} userName User
 * @param {Number} amount Amount
 */
function addGainedWorking(userName, amount) {
    Stats.findOne({
        username: userName, 
    }, (err, stats) => {
        if(err) console.log(err);
        if(!stats) {
            return;
        } else { 
            stats.gainedworking = stats.gainedworking + amount;
            stats.save().catch(err => console.log(err));
        }
    });
}


module.exports = { 
    addCommandsUsed, 
    addCookiesEaten, 
    addCookiesGifted, 
    addMoneyGambled, 
    addMoneyGained, 
    addTimesWorked,
    addGainedWorking
}