// Created by: BennyYasuo, 2019.03.22

const discordAPI = require('discord.js');
const db = require('mongoose');
const chalk = require('chalk');
const fs = require('fs');
const twitchAPI = require('tmi.js');

db.connect("mongodb://localhost/kfpbot")

const Constants = require('../util/Constants.js');
const Balance = require('../schema/balanceSchema.js');

const prefix = Constants.discordPrefix;

const twitch = new twitchAPI.client(Constants.tmiOptions);

var commands = new Map();

var client = new discordAPI.Client();

fs.readdir('system/discord/commands', (err, files) => { // Command Loader
    if (err) console.log(err);

    console.log(chalk.green("=============== DISCORD COMMAND LOADER ==============="));

	let jsfile = files.filter(f => f.split('.').pop() === "js");
    if(jsfile.length <= 0) return console.log("Couldn't find any commands.");

    jsfile.forEach((f, i) => {
        let props = require(`../discord/commands/${f}`);
        console.log(chalk.green(`${f} loaded.`));
        commands.set(props.help.name, props);
    });

    console.log(chalk.green("======================================================"));

});

function connect() {
    return client.login(Constants.discordToken);
}

client.once("ready", function(){
    console.log(chalk.green("KFPBot Discord Unit loaded."));
});

client.on('message', function(msg)
{
    
    if (msg.author.bot) return;

    if (msg.content.indexOf(prefix) !== 0) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(msg.channel.id === "558630410855252010") {

        if(command === "balance" || command === "bal" || command === "money") {
            return commands.get('balance').run(client, msg, args);
        }
        
        else if(command === "following" || command === "follow") {
            return commands.get('following').run(twitch, client, msg, args);
        }

        else if(command === "leaderboard") {
            return commands.get('leaderboard').run(msg);
        }

        else if(command === "stats") {
            return commands.get('stats').run(client, msg, args);
        }

    }
});

function sendShopNotification(notification) {
    return notificationChannel = client.channels.find("id", "581544894347345929").send(`<@541731649944158227> ` + notification);
}

module.exports = { connect, sendShopNotification };