// Created by: BennyYasuo, 2019.05.24


const db = require('mongoose');
const Balance = require('../schema/balanceSchema.js');
const Maths = require('../util/Maths.js');
const BalanceUtil = require('../util/BalanceUtil.js');
const Constants = require('../util/Constants.js');
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
                let RNG = Maths.RNG(0, 100);
                
                if(RNG > 50) { 
                    return BalanceUtil.add(username, parseInt(amount + Math.round(amount / 2)), client, channel, "gamble", `${displayname} - Heads! You won ${amount + Math.round(amount / 2)}!`, displayname);
                }
                else {
                    return  client.say(channel, `${displayname} - Tails! You didn't win anything LUL`, displayname);
                }
                
            }
            else {
                return client.say(channel, `${displayname} can't even coinflip for ${amount} KFP$ LUL (Current balance: ${balance.balance} KFP$)`)
            }
        }
    });

}


module.exports.help = {
    name: "coinflip"
}