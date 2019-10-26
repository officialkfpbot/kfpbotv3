const db = require('mongoose');
const discordAPI = require('discord.js');
const Stats = require('../../schema/userStatsSchema.js');
const Colors = require('../../util/Colors.js');

module.exports.run = async (client, msg, args) => {

    let notSpecified = new discordAPI.RichEmbed()
            .setColor(Colors.red)
            .setTitle(`Please specify whose balance you want to view.`);
        
    if(!args[0]) return msg.channel.send(notSpecified);

    let user = args[0].toLowerCase();

    Stats.findOne({
        username: user
    }, (err, stats) => {
        if(err) console.log(err);
        if(!stats) {

            let noBalance = new discordAPI.RichEmbed()
                .setColor(Colors.red)
                .setTitle(`No stats found for ${user}.`);

            return msg.channel.send(embed);

        } else {
                    
            let embed = new discordAPI.RichEmbed()
            .setColor(Colors.green)
            .setTitle(`Stats of ${stats.displayname}`)
            .addField(`Commands Used`, `${stats.commandsused}`)
			.addField(`Cookies Eaten`, `${stats.cookieseaten}`)
			.addField(`Cookies Gifted`, `${stats.cookiesgifted}`)
			.addField(`Money Gambled Away`, `${stats.moneygambled}`)
			.addField(`Money Gained from Gambling`, `${stats.moneygained}`)
			.addField(`Times Worked`, `${stats.timesworked}`)
			.addField(`Money Gained Working`, `${stats.gainedworking}`);
			
            return msg.channel.send(embed);

        }
    });
}

module.exports.help = {
    name: "stats"
}