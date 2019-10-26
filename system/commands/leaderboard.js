// Created by: BennyYasuo, 2019.05.15
const db = require('mongoose');
const Balance = require('../schema/balanceSchema.js');
db.connect("mongodb://localhost/kfpbot");

module.exports.run = async (client, channel) => {
    
    var text = "https://www.kfpgod.com/leaderboard -- Leaderboard -- ";
    var actualText;

    Balance.find().sort([
        ['balance', 'descending']
    ]).exec((err, res) => {
        if(err) console.log(err);

        if(res.length == 0) {
            text == `Whoops! Seems like the leaderboard is empty!`;
        } else if (res.length < 5) {
            for(i = 0; i < res.length; i++) {
                let format = `${i+1}: ${res[i].displayname} with ${res[i].balance} KFP$`;
                text += `${format}, `;
            }
            actualText = text.slice(0, -2);
        } else {    
            for(i = 0; i < 5; i++) {
                let format = `${i+1}: ${res[i].displayname} with ${res[i].balance} KFP$`;
                text += `${format}, `;
            }
            actualText = text.slice(0, -2);
        }
        client.say(channel, actualText);
    });
}

module.exports.help = {
    name: "leaderboard"
}