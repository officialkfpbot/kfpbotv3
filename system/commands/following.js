// Created by: BennyYasuo, 2019.03.17

const moment = require('moment');
const Constants = require('../util/Constants.js');

module.exports.run = async (client, channel, username, displayname, argument) => {
    if(!argument)
    {
        client.api({
            url: 'https://api.twitch.tv/kraken/users/' + username + '/follows/channels/kfpgod',
            headers: {
                "Client-ID": Constants.clientID
            }
        }, function(err, res, body)
        {
            
            if(!body.created_at) { return client.say(channel, `${displayname} is not following KFP.`); }
            else {
                var dateFollowed = body.created_at.replace("-", "/").replace("-", "/").split("T")[0];
                var dateFollowed2 = body.created_at.split("T")[0];
                var dateObj = new Date();
                var year = dateObj.getUTCFullYear();
                var month = dateObj.getUTCMonth() + 1;
                var day = dateObj.getUTCDate();
                timeDiff(Date.parse(dateFollowed), Date.parse(`${year}/${month}/${day}`), dateFollowed2, displayname);
            }
        });
    }
    else {
        client.api({
            url: 'https://api.twitch.tv/kraken/users/' + argument + '/follows/channels/kfpgod',
            headers: {
                "Client-ID": Constants.clientID
            }
        }, function(err, res, body)
        {
            
            if(!body.created_at) { return client.say(channel, `${argument} is not following KFP.`); }
            else {
                var dateFollowed = body.created_at.replace("-", "/").replace("-", "/").split("T")[0];
                var dateFollowed2 = body.created_at.split("T")[0];
                var dateObj = new Date();
                var year = dateObj.getUTCFullYear();
                var month = dateObj.getUTCMonth() + 1;
                var day = dateObj.getUTCDate();
                timeDiff(Date.parse(dateFollowed), `${year}/${month}/${day}`, dateFollowed2, argument);
            }
        });
    }

    function timeDiff(d2, d1, followingsince, displayname)
	{
		var m = moment(d1);
		var years = m.diff(d2, 'years');
		m.add(-years, 'years');
		var months = m.diff(d2, 'months');
		m.add(-months, 'months');
		var days = m.diff(d2, 'days');

		if(years > 0) return client.say(channel, `${displayname} has been following KFP since ${followingsince} (${years} years, ${months} months, ${days} days)`);
		if(years <= 0 && months > 1) return client.say(channel, `${displayname} has been following KFP since ${followingsince} (${months} months, ${days} days)`);
		if(years <= 0 && months == 1) return client.say(channel, `${displayname} has been following KFP since ${followingsince} (${months} month, ${days} days)`);
		if(months <= 0) return client.say(channel, `${displayname} has been following KFP since ${followingsince} (${days} days)`);
		
	}
    
}

module.exports.help = {
    name: "following"
}

