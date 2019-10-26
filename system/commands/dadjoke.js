// Created by: BennyYasuo, 2019.05.24

var request = require('request');

module.exports.run = async (client, channel) => {
    const options = {
        method: 'GET',
        url: 'https://icanhazdadjoke.com/',
        headers: {
            accept: 'application/json'
        }
    }
    
    request(options, function(err, res, body) 
    {
        
        if(err)throw(err);
        
        let data = JSON.parse(body);
        
        client.say(channel, data.joke);
        
    });
}

module.exports.help = {
    name: "dadjoke"
}