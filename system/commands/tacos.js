// Created by: BennyYasuo, 2019.03.17

module.exports.run = async (client, channel, user) => {
    if(user.mod || user.username == channel.replace('#', ''))
    {
        return client.say(channel, '!sr https://www.youtube.com/watch?v=npjF032TDDQ');
    }
    else {
        return client.say(channel, "Can't do that hoss! (Moderator only command)");
    }
}

module.exports.help = {
    name: "tacos"
}