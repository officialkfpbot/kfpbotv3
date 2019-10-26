const db = require('mongoose');
const discordAPI = require('discord.js');
const Balance = require('../../schema/balanceSchema.js');
const Colors = require('../../util/Colors.js');

module.exports.run = async (msg) => {

    var embed = new discordAPI.RichEmbed()
            .setTitle("Leaderboard");

    Balance.find().sort([
        ['balance', 'descending']
    ]).exec((err, res) => {
        if(err) console.log(err);

        if(res.length == 0) {
                embed.setColor(Colors.red).addField("Whoops! Seems like the leaderboard is empty!");
        } else if (res.length < 10) {
            for(i = 0; i < res.length; i++) {
                let format = `${i+1}: ${res[i].displayname}`;
                embed.setColor(Colors.blue).addField(format, `${res[i].balance} KFP$`);
            }
        } else {    
            for(i = 0; i < 10; i++) {
                let format = `${i+1}: ${res[i].displayname}`;
                embed.setColor(Colors.green).addField(format, `${res[i].balance} KFP$`);
            }
        }
        msg.channel.send(embed);
    });
    
}

module.exports.help = {
    name: "leaderboard"
}