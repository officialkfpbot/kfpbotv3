// Created by: BennyYasuo, 2019.03.17

module.exports.run = async (client, channel, user, argument) => {
    if(user.mod || user.username == channel.replace('#', ''))
    {
        return client.say(channel, `Please check out ${argument} over at https://www.twitch.tv/${argument} !`);
    }
    else {
        return client.say(channel, "Can't do that hoss! (Moderator only command)");
    }
}

module.exports.help = {
    name: "shoutout"
}