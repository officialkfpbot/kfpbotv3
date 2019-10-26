// Created by: BennyYasuo, 2019.03.16

// Default Modules 

const fs = require('fs');
const tmi = require('tmi.js');
const chalk = require('chalk');
const db = require('mongoose');
db.connect("mongodb://localhost/kfpbot");

// Custom Modules

const Constants = require('./system/util/Constants.js');
const Maths = require('./system/util/Maths.js');
const Balance = require('./system/schema/balanceSchema.js');
const Cookie = require('./system/schema/cookieSchema.js');
const Stats = require('./system/schema/userStatsSchema.js')
const DiscordUnit = require('./system/discord/discordUnit.js');
const BalanceUtil = require('./system/util/BalanceUtil.js');
const CookieUtil = require('./system/util/CookieUtil.js');
const StatsUtil = require('./system/util/StatsUtil.js');
const Logger = require('./system/util/Logger.js');
const exportLeaders = require('./system/web/exportLeaders.js');


DiscordUnit.connect();

// Variables

var commandsJSON = JSON.parse(fs.readFileSync('./system/json/commands.json'));
var helpJSON = JSON.parse(fs.readFileSync('./system/json/help.json'));
var userData = JSON.parse(fs.readFileSync('./system/json/admins.json'));
var mods = JSON.parse(fs.readFileSync('./system/json/moderators.json'));
var vips = JSON.parse(fs.readFileSync('./system/json/vips.json'));
var soundsJSON = JSON.parse(fs.readFileSync('./system/json/sounds.json'));

var TwitchChannel = Constants.channels;

var commands = new Map(); 

var prefix = Constants.prefix; 

var betRed = [];
var betBlue = [];
var betEnabled = false;

var gambleLimiter = new Set();
var coinflipLimiter = new Set();
var giftLimiter = new Set();
var sendLimiter = new Set();
var workLimiter = new Set();

fs.readdir('./system/commands/', (err, files) => { 
    if (err) console.log(err);

    console.log(chalk.green("=============== TWITCH COMMAND LOADER ==============="));

	let jsfile = files.filter(f => f.split('.').pop() === "js");
    if(jsfile.length <= 0) return console.log("Couldn't find any commands.");

    jsfile.forEach((f, i) => {
        let props = require(`./system/commands/${f}`);
        console.log(chalk.green(`${f} loaded.`));
        commands.set(props.help.name, props);
    });

    console.log(chalk.green("====================================================="));
    Logger.makeLogFile();


});

var client = new tmi.client(Constants.tmiOptions);
client.connect();

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

client.on("chat", function(channel, user, message) { // Chat Event

    var addedBuckies = Maths.RNG(1, 13, "ceil");

    var userName = user["username"];
    var displayName = user["display-name"];

    const args = message.slice(prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();

    Cookie.findOne({
        username: userName, 
    }, (err, cookie) => {
        if(err) console.log(err);
        if(!cookie) {
           return;
        } else {
            if(cookie.displayname != displayName) {
                cookie.displayname = displayName;
                cookie.save().catch(err => console.log(err));
            }
        }
    });

    Balance.findOne({
        username: userName, 
    }, (err, balance) => {
        if(err) console.log(err);
        if(!balance) {
            const newBalance = new Balance({
                username: userName,
                displayname: displayName,
                balance: 500
            })
            newBalance.save().catch(err => console.log(err));
            return client.whisper(userName, "It seems like you are new to KFP's channel, Let's get you started! From now on, every message you send on KFP's channel will give you 1-13 KFP$, which can be collected and redeemed for items such as virtual cookies, song requests, and many more things! You can even redeem your points for a T-shirt from KFP's Merchandise!");
        } else {
            if(balance.displayname != displayName) {
                balance.displayname = displayName;
                balance.save().catch(err => console.log(err));
            }
            if(!message.startsWith(`${prefix}balance`) && !message.startsWith(`${prefix}bal`) && !message.startsWith(`${prefix}worth`) && !message.startsWith(`${prefix}gamble`) && !message.startsWith(`${prefix}coinflip`) && !message.startsWith(`${prefix}buy`) && !message.startsWith(`${prefix}take`) && !message.startsWith(`${prefix}give`) && !message.startsWith(`${prefix}cookies`) && !message.startsWith(`${prefix}send`) && !message.startsWith(`${prefix}work`))
            {
                balance.balance = balance.balance + addedBuckies;
                balance.save().catch(err => console.log(err));
            }
        }
    });

    Stats.findOne({
        username: userName, 
    }, (err, stats) => {
        if(err) console.log(err);
        if(!stats) {
            const newStats = new Stats({
                username: userName,
                displayname: displayName,
                commandsused: 0,
                cookieseaten: 0,
                cookiesgifted: 0,
                moneygambled: 0,
                moneygained: 0,
                timesworked: 0,
                gainedworking: 0
            })
            newStats.save().catch(err => console.log(err));
            Logger.addToLogs(`Created user statistics for ${displayName} (${userName})`);
        } else { 
            if(stats.displayname != displayName) {
                stats.displayname = displayName;
                stats.save().catch(err => console.log(err));
            }
        }
    });
    
    if(userName === Constants.botUser.toLowerCase()) {
        Logger.addToLogs(`Bot responded with "${message}"`);
    }

	if(message.startsWith(prefix) && commandsJSON.hasOwnProperty(command)) {
        Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
        StatsUtil.addCommandsUsed(userName);
        return client.say(channel, commandsJSON[command].value);
	}
	
	if(message.startsWith(prefix) && soundsJSON.hasOwnProperty(command)) {
        Logger.addToLogs(`User ${displayName} (${userName}) has executed sound "${prefix}${command}"`);
        let cost = soundsJSON[command].cost;
        let exec = soundsJSON[command].command;
        console.log(`${soundsJSON[command].cost} + ${soundsJSON[command].command}`)
        BalanceUtil.removeSound([client, channel, userName, displayName, cost, exec])
        StatsUtil.addCommandsUsed(userName);
        return;
    }

    switch(command)
    {
        case 'bence': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            const randomScore = Math.floor(Math.random() * 15) + 5;
			const randomTime = Math.floor(Math.random() * 15) + 5;
			if(!args[0]) return client.say(channel, `Is this the Bence Yasuo? Legend says he is capable of going 0/${randomScore} in just ${randomTime} minutes!`);
            const bence = args.join(' '); 
            return client.say(channel, `Is this the Bence ${bence}? Legend says they are capable of going 0/${randomScore} in just ${randomTime} minutes!`);
            break;
        }
        case 'kfpbot': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            commands.get("generic").run(client, channel, "KFPBot is the successor to BenceBot. Both bots were made and maintained by BennyYasuo. For any issues or technical questions you are free to contact BennyYasuo on Discord: WhatIsThis#3667 ");
            break;
        }
        case 'buy': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            if(!args[0]) return client.say(channel, `${displayName} - You must specify what you want to buy!`);
            switch(args[0].toLowerCase()) {
                case 'cookie': {
                    if(args[1] && args[1].toLowerCase() == "all") {
                        BalanceUtil.bulkCookieHelper(userName, displayName, client, channel)
                    } else {
                        CookieUtil.add(userName, displayName, 1, client, channel, null, null);
                        BalanceUtil.remove(userName, 150, client, channel, "buycookie", null, displayName);
                    }
                    break;
                }
                case 'song': 
                case 'sr': {
                    if(!args[1]) return client.say(channel, `${displayName} - Please specify what song you want to request! (Please don't request songs which are Croatian/Serbian/Other South Slavic languages)`);
                    let song = args.slice(1).join(' ');
                    BalanceUtil.remove(userName, 5000, client, channel, "buysong", null, displayName);
                    client.say(channel, `!sr ${song}`);
                    break;
                } 
                case 'vip': {
                    if(!vips.hasOwnProperty(userName))
                    {
                        BalanceUtil.remove(userName, 75000, client, channel, "buyvip", null, displayName);
                        DiscordUnit.sendShopNotification(`${displayName} (${userName}) has bought VIP.`);
                    }
                    else {
                        return client.say(channel, `${displayName} - You are VIP already???`);
                    }
                    break;
                }
                default: {
                    return client.say(channel, `${displayName} - Could not find the item you requested. Please see !shop for all the purchasable items.`);
                }
            }
            break;
        }
        case 'help': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            if(!args[0]) return client.say(channel, `${displayName} - Please specify the command you want help for.`);
            let name = args[0].toLowerCase();
            if(name.startsWith(prefix)) {
                if(commandsJSON.hasOwnProperty(name.slice(prefix.length)) && helpJSON.hasOwnProperty(name.slice(prefix.length)))
                {
                    return client.say(channel, helpJSON[name.slice(prefix.length)].value);
                } else {
                    return client.say(channel, `${displayName} - Help for the command "${name}" was not found.`);
                }
            }
            else {
                if(commandsJSON.hasOwnProperty(name) && helpJSON.hasOwnProperty(name))
                {
                    return client.say(channel, helpJSON[name].value);
                } else {
                    return client.say(channel, `${displayName} - Help for the command "${name}" was not found.`);
                }
            }
            break;
        }
        case 'following': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            commands.get("following").run(client, channel, userName, displayName, args[0]);
            break;
        }
        case 'dadjoke': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            commands.get("dadjoke").run(client, channel);
            break;
        }
        case 'rank': {
        }
        case 'elo': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            commands.get("rank").run(client, channel);
            break;
        }
        case 'so': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            let name = args[0]; 
			if(!name) return client.say(channel, `${displayName} - Please specify who you want to give a shoutout.`);
            commands.get("shoutout").run(client, channel, user, name);
            break;
        }
        case 'tacos': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            commands.get("tacos").run(client, channel, user);
            break;
        }
        case 'time': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            commands.get("time").run(client, channel);
            break;
        }
        case 'urban': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            if(!args[0]) return client.say(channel, `${displayName} - Please choose a word to look up on Urban Dictionary.`);
            let phrase = args.join(' ');
            commands.get("urban").run(client, channel, user, phrase);
            break;
        }
        case 'wheelchair': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            let wheelchair = args.join(' ');
            if(!wheelchair) return client.say(channel, "♿");
            commands.get("wheelchair").run(client, channel, wheelchair);
            break;
        }
        case 'report': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            let userReported = args[0];
            if(!userReported) return client.say(channel, `${displayName} - Please specify a user to report.`);
            let reason = args.slice(1).join(' ');
            if(!reason) return client.say(channel, `${displayName} - Please specify why you want to report this user.`);
            commands.get("report").run(client, channel, userName, userReported, reason);
            break;
        }
        case 'eat': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            if(!args[0]) return commands.get("eat").run(client, channel, userName, displayName, 1);
            if(!args[0].match(/^[0-9]+$/) || args[0].startsWith("0")) return client.say(channel, `${displayName} - Your amount cannot start with 0 or contain letters/symbols/decimals!`);
            let amount = parseInt(args[0]);
            if(amount <= 0) return client.say(channel, `${displayName} - Your amount cannot be 0!`);
            return commands.get("eat").run(client, channel, userName, displayName, amount);
            break;
        }
        case 'gift': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            if(!giftLimiter.has(userName))
            {
                if(!args[0]) return client.say(channel, `${displayName} - You must specify who you want to gift your cookies to!`);
                if(args[0].toLowerCase() == userName) return client.say(channel, `${displayName} - You cannot gift yourself!`);
                let name = args[0].toLowerCase();
                if(!args[1]) return client.say(channel, `${displayName} - You must specify how many cookies you want to gift!`);
                if(!args[1].match(/^[0-9]+$/) || args[1].startsWith("0")) return client.say(channel, `${displayName} - Your amount cannot start with 0 or contain letters/symbols/decimals!`);
                let amount = parseInt(args[1]);
                if(amount == 0) return client.say(channel, `${displayName} - Your amount cannot be 0!`);
                commands.get("gift").run(client, channel, userName, displayName, amount, name);
                giftLimiter.add(userName);
                setTimeout(() => {
                    giftLimiter.delete(userName);
                }, 30000);
                return;
            } else {
                return client.say(channel, `${displayName} - You must wait 30 seconds before gifting cookies again!`);
            }
            break;
        }
        case 'send': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            if(!sendLimiter.has(userName))
            {
                if(!args[0]) return client.say(channel, `${displayName} - You must specify who you want to send your KFP$ to!`);
                let name = args[0].toLowerCase();
                if(name == userName) return client.say(channel, `${displayName} - You cannot send KFP$ to yourself!`);
                if(!args[1]) return client.say(channel, `${displayName} - You must specify how much KFP$ you want to send!`);
                if(!args[1].match(/^[0-9]+$/) || args[1].startsWith("0")) return client.say(channel, `${displayName} - Your amount cannot start with 0 or contain letters/symbols/decimals!`);
                let amount = parseInt(args[1]);
                if(amount == 0) return client.say(channel, `${displayName} - Your amount cannot be 0!`);
                commands.get("send").run(client, channel, userName, displayName, amount, name);
                sendLimiter.add(userName);
                setTimeout(() => {
                    sendLimiter.delete(userName);
                }, 30000);
                return;
            } else {
                return client.say(channel, `${displayName} - You must wait 30 seconds before sending KFP$ again!`);
            }
            break;
        }
        case 'work': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            if(!workLimiter.has(userName)) 
            {
                commands.get("work").run(client, channel, userName, displayName);
                workLimiter.add(userName);
                setTimeout(() => {
                    workLimiter.delete(userName);
                }, Maths.min2ms(1));
            } else {
                return client.say(channel, `${displayName} - You must wait a minute before working again!`);
            }
            break;
        }
        case 'give': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            if(userData.hasOwnProperty(userName) && userData[userName].admin == true)
            {
                if(!args[0]) return client.say(channel, `${displayName} - Please specify which user you want to give money to!`);
                let name = args[0].toLowerCase();
                if(!args[1]) return client.say(channel, `${displayName} - Please specify the amount you want to give!`);
                if(!args[1].match(/^[0-9]+$/) || args[1].startsWith("0")) return client.say(channel, `${displayName} - Your amount cannot start with 0 or contain letters/symbols/decimals!`);
                let amount = parseInt(args[1]);
                if(amount == 0) return client.say(channel, "Amount cannot be 0!");
                BalanceUtil.add(name, amount, client, channel, "give", null, displayName);
            } else { return client.say(channel, `${displayName} - Can't do that hoss! (Developer/Admin Only Command)`); };
            break;
        }
        case 'take': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            if(userData.hasOwnProperty(userName) && userData[userName].admin == true)
            {
                if(!args[0]) return client.say(channel, `${displayName} - Please specify which user you want to give money to!`);
                let name = args[0].toLowerCase();
                if(!args[1]) return client.say(channel, `${displayName} - Please specify the amount you want to give!`);
                if(!args[1].match(/^[0-9]+$/) || args[1].startsWith("0")) return client.say(channel, `${displayName} - Your amount cannot start with 0 or contain letters/symbols/decimals!`);
                let amount = parseInt(args[1]);
                if(amount == 0) return client.say(channel, `${displayName} - Amount cannot be 0!`);
                BalanceUtil.remove(name, amount, client, channel, "take", null, displayName);
            } else { return client.say(channel, `${displayName} - Can't do that hoss! (Developer/Admin Only Command)`); };
            break;
        }
        case 'gamble': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            if(gambleLimiter.has(userName))
            { 
                return client.say(channel, `${displayName} - You must wait 10 seconds before gambling again!`);
            } else {
                if(!args[0]) return client.say(channel, `${displayName} - Please specify how much you want to gamble!`);
                if(!args[0].match(/^[0-9]+$/) || args[0].startsWith("0")) return client.say(channel, `${displayName} - Your amount cannot start with 0 or contain letters/symbols/decimals!`);
                let amount = parseInt(args[0]);
                if(amount > 1000) return client.say(channel, `${displayName} - Amount must be under 1001 KFP$!`);
                if(amount < 5) return client.say(channel, `${displayName} - Amount must be over 4 KFP$!`);
                gambleLimiter.add(userName);
                setTimeout(() => {
                    gambleLimiter.delete(userName);
                }, 10000);
                return commands.get("gamble").run(client, channel, userName, displayName, amount);
            }
            break;
        }
        case 'coinflip': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            if(coinflipLimiter.has(userName))
            { 
                return client.say(channel, `${displayName} - You must wait 15 seconds before coinflipping again!`);
            } else {
                if(!args[0]) return client.say(channel, `${displayName} - Please specify how much you want to coinflip!`);
                if(!args[0].match(/^[0-9]+$/) || args[0].startsWith("0")) return client.say(channel, `${displayName} - Your amount cannot start with 0 or contain letters/symbols/decimals!`);
                let amount = parseInt(args[0]);
                if(amount > 3000) return client.say(channel, `${displayName} - Amount must be under 3000 KFP$!`);
                if(amount < 5) return client.say(channel, `${displayName} - Amount must be over 4 KFP$!`);
                coinflipLimiter.add(userName);
                setTimeout(() => {
                    coinflipLimiter.delete(userName);
                }, 15000);
                return commands.get("coinflip").run(client, channel, userName, displayName, amount);
            }
            break;
        }
        case 'bal': {
        }
        case 'money': {
        }
        case 'balance': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            return commands.get("balance").run(client, channel, userName, displayName, args);
            break;
        }
        case 'worth': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            return commands.get("worth").run(client, channel, userName, displayName, args);
            break;
        }
        case 'cookies': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            if(!args[0]) {
                return commands.get("cookies").run(client, channel, userName, displayName);
            } else {
                return commands.get("cookies").run(client, channel, args[0].toLowerCase());
            } 
            break;
        }
        case 'enablebet': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            if(userData.hasOwnProperty(userName) && userData[userName].admin == true)
            {
                if(betEnabled == false)
                {
                    betEnabled = true;
                    client.say(channel, "Team Betting has been enabled!");
                } else {
                    client.say(channel, "Team Betting is already enabled!");
                }
            } else { client.say(channel, `${displayName} - Can't do that hoss! (Developer/Admin Only Command)`); }
            break;
        }
        case 'disablebet': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            if(userData.hasOwnProperty(userName) && userData[userName].admin == true)
            {
                if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
                if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
                if(betEnabled == true)
                {
                    betEnabled = false;
                    betRed = [];
                    betBlue = [];
                    client.say(channel, "Team Betting has been disabled!");
                } else {
                    client.say(channel, "Team Betting is already disabled!");
                }
            } else { client.say(channel, `${displayName} - Can't do that hoss! (Developer/Admin Only Command)`); }   
            break;
        }
        case 'bet': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            if(!args[0]) return client.say(channel, "You must bet on a team (Red or Blue)!");
            if(args[0].toLowerCase() !== "red" && args[0].toLowerCase() !== "blue") return client.say(channel, `${displayName} - You may only bet on Red or Blue`);
            if(betRed.includes(userName) || betBlue.includes(userName)) return client.say(channel, `${displayName} - You have already bet on a team.`);
            if(args[0].toLowerCase() == "red")
            {
                betRed.push(userName);
                client.say(channel, `${displayName} - You have sucessfully placed a bet on the Red team.`);
            }
            else if(args[0].toLowerCase() == "blue")
            {
                betBlue.push(userName);
                client.say(channel, `${displayName} - You have sucessfully placed a bet on the Blue team.`);
            }
            break;
        }
        case 'betwinner': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            if(userData.hasOwnProperty(userName) && userData[userName].admin == true) 
            {

                if(!args[0]) return client.say(channel, `${displayName} - Please specify which team won!`);
				if(args[0].toLowerCase() !== "red" && args[0].toLowerCase() !== "blue") return client.say(channel, `${displayName} - Invalid team.`);
                if(!args[1]) return client.say(channel, "Please specify the winnings!");
                let winningsRegex = args[1];
				if(!winningsRegex.match(/^[0-9]+$/)) return client.say(channel, `${displayName} - Winnings cannot contain letters/symbols/decimals!`);
				let winnings = parseInt(winningsRegex);
                if(args[0].toLowerCase() == "red")
                {
                    for(i = 0; i < betRed.length; i++) {
                        BalanceUtil.add(betRed[i], winnings, client, channel, null, null, displayName);
                    }
                    client.say(channel, `Team Red has won! Reward for Team Red: ${winnings} KFP$! Congratulations!`);
                    betRed = [];
                    betBlue = [];
                } 
                else if(args[0].toLowerCase() == "blue")
                {
                    for(j = 0; j < betBlue.length; j++) {
                        BalanceUtil.add(betBlue[j], winnings, client, channel, null, null, displayName);
                    }
                    client.say(channel, `Team Blue has won! Reward for Team Blue: ${winnings} KFP$! Congratulations!`);
                    betBlue = [];
                    betRed = [];
                }
            } else { client.say(channel, `${displayName} - Can't do that hoss! (Developer/Admin Only Command)`); }
            break;
        }
        case 'lb':
        case 'leaderboard': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            StatsUtil.addCommandsUsed(userName);
            commands.get("leaderboard").run(client, channel);
            break;
        }
        case 'newcommand': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            if(userData.hasOwnProperty(userName) && userData[userName].admin == true && userData[userName].overlord == true)
            {
                if(!args[0]) return client.say(channel, `${displayName} - Please give the command a name.`);
                let commandName = args[0].toLowerCase();  
                if(commandsJSON.hasOwnProperty(commandName)) return client.say(channel, `Command "${prefix}${commandName}" already exists.`);
                let returnValue = args.slice(1).join(' ');
                if(!returnValue) return client.say(channel, `${displayName} - Please give a value to the command.`);
                if(commandName.startsWith(prefix)) {
                    let valxd = commandName.slice(prefix.length);
                    
                    commandsJSON[valxd] = {
                        value: returnValue
                    }
                    fs.writeFile("./system/json/commands.json", JSON.stringify(commandsJSON, null, 4), err =>
                    {
                        if (err) throw err;
                        client.say(channel, `Command "${prefix}${valxd}" has been created successfully.`);
                    });
                } else {
                    commandsJSON[commandName] = {
                        value: returnValue
                    }
                    fs.writeFile("./system/json/commands.json", JSON.stringify(commandsJSON, null, 4), err =>
                    {
                        if (err) throw err;
                        client.say(channel, `Command "${prefix}${commandName}" has been created successfully.`);
                    });
                }
            }
            else {
                return client.say(channel, `${displayName} - Can't do that hoss! (Developer only command.)`);
            }
            break;
        }
        case 'delcommand': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            if(userData.hasOwnProperty(userName) && userData[userName].admin == true && userData[userName].overlord == true)
			{
				if(!args[0]) return client.say(channel, `${displayName} - Please specify a command to delete.`);
                let name = args[0].toLowerCase();
                if(name.startsWith(prefix)) 
                {
                    let namexd = name.slice(1);
                    if(commandsJSON.hasOwnProperty(namexd))
                    {
                        delete commandsJSON[namexd];
                        fs.writeFile("./system/json/commands.json", JSON.stringify(commandsJSON, null, 4), err =>
                        {
                            if (err) throw err;
                            client.say(channel, `Command "${prefix}${namexd}" has been deleted successfully.`);
                            return;
                        });
                    } 
                    else 
                    { 
                        return client.say(channel, `Command ${prefix}${namexd} doesn't exist.`); 
                    }

                } 
                else 
                {
                    if(commandsJSON.hasOwnProperty(name)) 
                    {
                        delete commandsJSON[name];
                        fs.writeFile("./system/json/commands.json", JSON.stringify(commandsJSON, null, 4), err =>
                        {
                            if (err) throw err;
                            client.say(channel, `Command "${prefix}${name}" has been deleted successfully.`);
                            return;
                        });
                    } else 
                    { 
                        return client.say(channel, `Command ${prefix}${namexd} doesn't exist.`);  
                    }
                } 
			}
            else 
            {

				return client.say(channel, `${displayName} - Can't do that hoss! (Developer only command.)`);
			}
			break;
        }
        case 'addhelp': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            if(userData.hasOwnProperty(userName) && userData[userName].admin == true && userData[userName].overlord == true)
            {
                if(!args[0]) return client.say(channel, `${displayName} - Please give the command's name.`);
                let commandName = args[0].toLowerCase();  
                if(helpJSON.hasOwnProperty(commandName)) return client.say(channel, `Command "${prefix}${commandName}" already has help set for it. You can remove it via ${prefix}deletehelp.`);
                let returnValue = args.slice(1).join(' ');
                if(!returnValue) return client.say(channel, `${displayName} - Please give the help for the command.`);
                if(commandName.startsWith(prefix)) {
                    let valxd = commandName.slice(prefix.length);
                    
                    helpJSON[valxd] = {
                        value: returnValue
                    }
                    fs.writeFile("./system/json/help.json", JSON.stringify(helpJSON, null, 4), err =>
                    {
                        if (err) throw err;
                        client.say(channel, `Help for the command "${prefix}${valxd}" has been created successfully.`);
                    });
                } else {
                    helpJSON[commandName] = {
                        value: returnValue
                    }
                    fs.writeFile("./system/json/help.json", JSON.stringify(helpJSON, null, 4), err =>
                    {
                        if (err) throw err;
                        client.say(channel, `Help for the command "${prefix}${commandName}" has been created successfully.`);
                    });
                }
            }
            else {
                return client.say(channel, `${displayName} - Can't do that hoss! (Developer only command.)`);
            }
            break;
        }
        case 'deletehelp': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            if(userData.hasOwnProperty(userName) && userData[userName].admin == true && userData[userName].overlord == true)
			{
				if(!args[0]) return client.say(channel, `${displayName} - Please specify a command to delete.`);
                let name = args[0].toLowerCase();
                if(name.startsWith(prefix)) 
                {
                    let namexd = name.slice(1);
                    if(helpJSON.hasOwnProperty(namexd))
                    {
                        delete helpJSON[namexd];
                        fs.writeFile("./system/json/help.json", JSON.stringify(helpJSON, null, 4), err =>
                        {
                            if (err) throw err;
                            client.say(channel, `Command help for "${prefix}${namexd}" has been deleted successfully.`);
                            return;
                        });
                    } 
                    else 
                    { 
                        return client.say(channel, `Command help for ${prefix}${namexd} doesn't exist.`); 
                    }

                } 
                else 
                {
                    if(helpJSON.hasOwnProperty(name)) 
                    {
                        delete helpJSON[name];
                        fs.writeFile("./system/json/help.json", JSON.stringify(helpJSON, null, 4), err =>
                        {
                            if (err) throw err;
                            client.say(channel, `Command help for "${prefix}${name}" has been deleted successfully.`);
                            return;
                        });
                    } else 
                    { 
                        return client.say(channel, `Command help for ${prefix}${namexd} doesn't exist.`);  
                    }
                } 
			}
            else 
            {
				return client.say(channel, `${displayName} - Can't do that hoss! (Developer only command.)`);
			}
			break;
        }
        case 'makeadmin': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
            if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            if(!args[0]) return client.say(channel, `${displayName} - Please specify who you want to make an Admin!`);
           
            let adminius = args[0].toLowerCase();

                if(userData.hasOwnProperty(userName) && userData[userName].admin == true && userData[userName].overlord == true)
                {
                    if(adminius == userName) return client.say(channel, `You are already Admin!`);

                    userData[adminius] = {
                        admin: true,
                        overlord: false
                    }
                    fs.writeFile("./system/json/admins.json", JSON.stringify(userData, null, 4), err =>
                    {
                        if (err) throw err;
                        client.say(channel, `User "${adminius}" has been promoted to Admin.`);
                    });
                } else { return client.say(channel, `${displayName} - Can't do that hoss! (Developer Only Command)`); }
            break;
        }
        case 'removeadmin': {
            if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
			if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
            if(!args[0]) return client.say(channel, `${displayName} - Please specify whose Admin status you want to remove!`);

            let adminius = args[0].toLowerCase();

                if(userData.hasOwnProperty(userName) && userData[userName].admin == true && userData[userName].overlord == true) 
                {
                    if(adminius == userName) return client.say(channel, `You are already Admin!`);

                    if(userData.hasOwnProperty(adminius)) {
                        delete userData[adminius];
                        fs.writeFile("./system/json/admins.json", JSON.stringify(userData, null, 4), err =>
                        {
                            if (err) throw err;
                            client.say(channel, `User "${adminius}" had their Admin status removed.`);
                        });
                    } else { return client.say(channel, `user ${adminius} doesn't exist in the Admin database.`) }
                } else { return client.say(channel, `${displayName} - Can't do that hoss! (Developer Only Command)`) }
            break;
        }
		case 'addsound': {
			if(args.length === 0) Logger.addToLogs(`User ${displayName} (${userName}) has executed command "${prefix}${command}"`);
			if(args.length > 0) Logger.addToLogs(`User ${displayName} (${userName}) executed "${prefix}${command}" with args: ${args}`);
			if(userData.hasOwnProperty(userName) && userData[userName].admin == true && userData[userName].overlord == true)
			{
				if(!args[0]) return client.say(channel, `${displayName} - Please specify the name of the sound`);
				let name = String(args[0].toLowerCase());
				let name2 = String('!x' + name);
				if(!args[1]) return client.say(channel, `${displayName} - Please specify the cost of the sound`);
				let pricePre = args[1];
				if(!pricePre.match(/^[0-9]+$/)) return client.say(channel, `${displayName} - Price cannot contain letters/symbols/decimals!`);
				let price = parseInt(pricePre);
				soundsJSON[name] = {
					command: name2,
					cost: price
				}
				fs.writeFile("./system/json/sounds.json", JSON.stringify(soundsJSON, null, 4), err =>
				{
					if (err) throw err;
					client.say(channel, `Sound "${name}" has been added.`);
				});
				
			} else { return client.say(channel, `${displayName} - Can't do that hoss! (Developer Only Command)`) }
			break;
		} 
    }

});

setInterval(function () {
    for(let prop1 in vips) {
        delete[prop1];
    }
    for(let prop2 in mods) {
        delete[prop2];
    }
    client.vips("kfpgod")
        .then((data) => {
            for(let prop3 in data) { 
                if(!vips.hasOwnProperty(data[prop3])) {
                    vips[data[prop3]] = {
                        vip: true
                    }
                    fs.writeFileSync('./system/json/vips.json', JSON.stringify(vips, null, 4));
                }

            }
            console.log(chalk.red('Exported vips'));
        }).catch((err) => {
            if(err) console.log(err);
        });
    
    client.mods("kfpgod")
        .then((data) => {
            for(let prop4 in data) { 
                if(!mods.hasOwnProperty(data[prop4])) {
                    mods[data[prop4]] = {
                        moderator: true
                    }
                    fs.writeFileSync('./system/json/moderators.json', JSON.stringify(mods, null, 4));
                }
            }
            console.log(chalk.red('Exported mods'));
        }).catch((err) => {
            if(err) console.log(err);
        });


    Logger.addToLogs("Successfully exported VIPs and Moderators.");

}, Maths.min2ms(2))

setInterval(function () {
    exportLeaders.exportLeaders();
    Logger.addToLogs("Successfully created all Leaderboard and Statistics files.");
}, Maths.min2ms(2))
