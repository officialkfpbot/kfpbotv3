// Created by: BennyYasuo, 2019.03.17

var superagent = require('superagent');

module.exports.run = async (client, channel, user, phrase) => {
    if(user.mod || user.username == channel.replace('#', ''))
    {
        superagent.get('http://api.urbandictionary.com/v0/define')
            .query({term: phrase})
            .end((err, res) => {
                if(!err && res.status == 200)
                {
                    const urbdict = res.body;
                    if(urbdict.result_type !== 'no_results' && urbdict.list.length > 0)
                    {
                        return client.say(channel, urbdict.list[0].definition);
                    }
                    else {
                        return client.say(channel, "Thats a weird thing you're looking for man... Not even Urban Dictionary has a definition for it.");
                    }
                }
                else {
                    return client.say(channel, "Something went wrong while requesting a definition. Please contact BennyYasuo.");
                }
            });
    }
    else {
        return client.say(channel, "Can't do that hoss! (Moderator only command)");
    }
}

module.exports.help = {
    name: "urban"
}