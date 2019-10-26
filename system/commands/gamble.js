// Created by: BennyYasuo, 2019.04.20

const db = require('mongoose');
const Balance = require('../schema/balanceSchema.js');
const Maths = require('../util/Maths.js');
const BalanceUtil = require('../util/BalanceUtil.js');
const Constants = require('../util/Constants.js');
const Stats = require('../util/StatsUtil.js');
db.connect("mongodb://localhost/kfpbot");

module.exports.run = async (client, channel, username, displayname, amount) => {
    
    Balance.findOne({
        username: username
    }, (err, balance) => {
        if(err) console.log(err);
        if(!balance) {
            return client.whisper(username, "It seems like you are new to KFP's channel, Let's get you started! From now on, every message you send on KFP's channel will reward you with 1-13 KFP$, which can be collected and redeemed for items ranging from virtually profitable cookies up to a free T-shirt of your choice from KFP's Merch Store!");
        } else {
            if(balance.balance >= amount) {
                BalanceUtil.remove(username, amount, client, channel, null, null, displayname);
                Stats.addMoneyGambled(username, amount);
                let RNG = Maths.RNG(0, 120);
                let jackpotRNG = Maths.RNG(0, 1000);
                if(jackpotRNG === 1000) { 
                    Stats.addMoneyGained(username, 10000)
                    return BalanceUtil.add(username, 10000, client, channel, "gamble", `${displayname} has won the jackpot! Their earnings: 25000 KFP$, congratulations!`, displayname);
                }
                if(RNG <= 120 && RNG >= 35) {
                    return client.say(channel, `${displayname} - Seems like you didn't win anything LUL`);
                }
                if(RNG <= 100 && RNG >= 97) {
                    Stats.addMoneyGained(username, amount*5)
                    return BalanceUtil.add(username, amount*5, client, channel, "gamble", `${displayname} has won a 3x gamble! Their earnings: ${amount*3} KFP$, congratulations!`, displayname);
                }
                if(RNG <= 35 && RNG >= 29) {
                    Stats.addMoneyGained(username, amount*4)
                    return BalanceUtil.add(username, amount*4, client, channel, "gamble", `${displayname} has won a 3x gamble! Their earnings: ${amount*3} KFP$, congratulations!`, displayname);
                }
                if(RNG <= 29 && RNG >= 22) {
                    Stats.addMoneyGained(username, amount*3)
                    return BalanceUtil.add(username, amount*3, client, channel, "gamble", `${displayname} has won a 3x gamble! Their earnings: ${amount*3} KFP$, congratulations!`, displayname);
                }
                if(RNG <= 22 && RNG >= 0) {
                    Stats.addMoneyGained(username, amount*2)
                    return BalanceUtil.add(username, amount*2, client, channel, "gamble", `${displayname} has won a 2x gamble! Their earnings: ${amount*2} KFP$, congratulations!`, displayname);
                }
            }
            else {
                return client.say(channel, `${displayname} can't even gamble for ${amount} LUL (Current balance: ${balance.balance} KFP$)`)
            }
        }
    });
}


module.exports.help = {
    name: "gamble"
}