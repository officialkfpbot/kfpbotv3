const db = require('mongoose');
const discordAPI = require('discord.js');
const Balance = require('../../schema/balanceSchema.js');
const Colors = require('../../util/Colors.js');

module.exports.run = async (client, msg, args) => {

    let notSpecified = new discordAPI.RichEmbed()
            .setColor(Colors.red)
            .setTitle(`Please specify whose balance you want to view.`);
        
    if(!args[0]) return msg.channel.send(notSpecified);

    let user = args[0].toLowerCase();

    Balance.findOne({
        username: user
    }, (err, balance) => {
        if(err) console.log(err);
        if(!balance) {

            let noBalance = new discordAPI.RichEmbed()
                .setColor(Colors.red)
                .setTitle(`No balance found for ${user}.`);

            return msg.channel.send(embed);

        } else {
                    
            let embed = new discordAPI.RichEmbed()
            .setColor(Colors.green)
            .setTitle(`Balance of ${balance.displayname}`)
            .addField(`Balance`, `${balance.balance} KFP$.`);

            return msg.channel.send(embed);

        }
    });
}

module.exports.help = {
    name: "balance"
}