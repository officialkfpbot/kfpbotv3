// Created by: BennyYasuo, 2019.03.16

module.exports.run = async (client, channel, message) => {
    client.say(channel, message);
}

module.exports.help = {
    name: "generic"
}