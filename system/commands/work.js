// Created by: BennyYasuo, 2019.06.07

const db = require('mongoose');
const Balance = require('../schema/balanceSchema.js');
const Maths = require('../util/Maths.js');
const Stats = require('../util/StatsUtil.js');
db.connect("mongodb://localhost/kfpbot");

module.exports.run = async (client, channel, username, displayname) => {

    Balance.findOne({
        username: username
    }, (err, balance) => {
        if(err) console.log(err);
        if(!balance) {
            return;
        } else {
            Balance.findOne({
                username: username
            }, (err, balance) => {
                if(err) console.log(err);
                let pay = Maths.RNG(35, 500);
                var actions = [
                    `You cleaned a room and got some dough for it. ${pay} KFP$ to be exact.`,
                    `You boosted a guy to Silver for ${pay} KFP$.`,
                    `You delivered a pizza to a sketchy dude for ${pay} KFP$.`,
                    `You inted someone in exchange for ${pay} KFP$.`,
                    `You made a bet with a strange guy and won, earning you ${pay} KFP$.`,
                    `You flipped some burgers and earned ${pay} KFP$.`,
                    `You got paid ${pay} KFP$ to act as a coach for a day in a Gold team.`,
                    `You cracked some League accounts for CNH. They paid you ${pay} KFP$.`,
                    `You beat up a gang of thugs and stole ${pay} KFP$ from them.`,
                    `You 1v1'd for ${pay} KFP$ and destroyed your enemy.`,
                    `You worked with KFP and you finally got paid ${pay} KFP$.`,
                    `You fixed KFPBot errors and got paid ${pay} KFP$.`,
                    `You brought back BenceBot and monetized it, netting you around ${pay} KFP$.`,
                    `You found ${pay} KFP$ behind the couch.`,
                    `You sold lemons for a whole afternoon. You earned ${pay} KFP$.`,
                    `You sold your shoes for ${pay} KFP$. Worth.`,
                    `You went ahead and sold all of your League accounts for a grand total of ${pay} KFP$.`,
                    `You became a YouTuber for a while and AdSense paid you ${pay} KFP$ total.`,
                    `You put some books on the shelves in the library for ${pay} KFP$.`,
                    `You learned how science 'n' stuff works and made a contraption, but sold the rights for ${pay} KFP$.`,
                    `You got lucky and found ${pay} KFP$ laying around. No work today!`,
                    `You won a McDonalds eating contest for ${pay} KFP$.`,
                    `You found ${pay} KFP$ on your way to work.`,
                    `You got gifted a subscription to KFP, but you sold your account for ${pay} KFP$.`,
                    `You tried streaming today and a generous person donated you ${pay} KFP$.`,
                    `You went swimming in a lake, caught some fish, and sold them for ${pay} KFP$.`,
                    `While eating McDonalds you found ${pay} KFP$ stuck in your teeth.`,
                    `You entered a bear fighting contest and lost, but got awarded ${pay} KFP$ for bravery.`
                ]                
                let randAct = actions[Math.floor(Math.random()*actions.length)]; 
                balance.balance = balance.balance + pay;
                balance.save().catch(err => console.log(err));
                Stats.addTimesWorked(username);
                Stats.addGainedWorking(username, pay);
                return client.say(channel, `${displayname} - ${randAct}`);
            });
        }
    });

}

module.exports.help = {
    name: "work"
}