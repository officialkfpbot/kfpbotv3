const moment = require('moment');
const Constants = require('../../util/Constants.js');
const Colors = require('../../util/Colors.js');
const discordAPI = require('discord.js');


module.exports.run = async (client, discord, msg, argument) => {
    if(!argument[0]) return msg.channel.send("Please specify an user.")    
    
    client.api({
            url: 'https://api.twitch.tv/kraken/users/' + argument[0] + '/follows/channels/kfpgod',
            headers: {
                "Client-ID": Constants.clientID
            }
        }, function(err, res, body)
        {
            
            if(!body.created_at) return msg.channel.send(new discordAPI.RichEmbed().setTitle(`${argument[0]} is not following KFP.`).setColor(Colors.red)); 
            else {
                var dateFollowed = body.created_at.replace("-", "/").replace("-", "/").split("T")[0];
                var dateFollowed2 = body.created_at.split("T")[0];
                var dateObj = new Date();
                var year = dateObj.getUTCFullYear();
                var month = dateObj.getUTCMonth() + 1;
                var day = dateObj.getUTCDate();
                timeDiff(msg, Date.parse(dateFollowed), Date.parse(`${year}/${month}/${day}`), dateFollowed2, argument);
            }
        });
    }

function timeDiff(msg, d2, d1, followingsince, displayname)
{
    var m = moment(d1);
    var years = m.diff(d2, 'years');
    m.add(-years, 'years');
    var months = m.diff(d2, 'months');
    m.add(-months, 'months');
    var days = m.diff(d2, 'days');

    let embed = new discordAPI.RichEmbed()
        .setTitle(`${displayname}`)
        .setColor(Colors.green);

    if(years > 0) return msg.channel.send(embed.setDescription(`${displayname} has been following KFP since ${followingsince} (${years} years, ${months} months, ${days} days)`));
    if(years <= 0 && months > 1) return msg.channel.send(embed.setDescription(`${displayname} has been following KFP since ${followingsince} (${months} months, ${days} days)`));
    if(years <= 0 && months == 1) return msg.channel.send(embed.setDescription(`${displayname} has been following KFP since ${followingsince} (${months} month, ${days} days)`));
    if(months <= 0) return msg.channel.send(embed.setDescription(`${displayname} has been following KFP since ${followingsince} (${days} days)`));
    
}


module.exports.help = {
    name: "following"
}

