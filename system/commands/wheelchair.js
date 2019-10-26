// Created by: BennyYasuo, 2019.03.17

module.exports.run = async (client, channel, message) => {1
    return client.say(channel, `♿ ${message} ♿`);
}

module.exports.help = {
    name: "wheelchair"
}