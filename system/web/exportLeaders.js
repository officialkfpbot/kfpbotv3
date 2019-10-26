// Created by: BennyYasuo, 2019.05.15
const db = require('mongoose');
const path = require('path');
const fs = require('fs');
const Balance = require('../schema/balanceSchema.js');
const Cookie = require('../schema/cookieSchema.js');
const Stats = require('../schema/userStatsSchema.js');
const Leaderboard = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../json/leaderboard.json')));
const cookieLeaderboard = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../json/cookieLeaderboard.json')));
const Statistics = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../json/statistics.json')));
db.connect("mongodb://localhost/kfpbot");

function exportLeaders() {
    Balance.find().sort([
        ['balance', 'descending']
    ]).exec((err, res) => {
        if(err) console.log(err);
        if(res.length == 0) {
            return;
        } else if (res.length > 0) {
            console.log(path.resolve(__dirname, '../json/leaderboard.json'));
            for(let key in Leaderboard) {
                delete Leaderboard[key];
            }
            for(i = 0; i < res.length; i++) {
                let lbspot = i+1;
                let name = res[i].username;
                let bal = res[i].balance;
                let displayname = res[i].displayname;

                Leaderboard[name] = {
                    balance: bal,
                    display: displayname,
                    spot: lbspot,
                }

                fs.writeFileSync(path.resolve(__dirname, '../json/leaderboard.json'), JSON.stringify(Leaderboard, null, 4));
                
            }
        } 
    });

    Cookie.find().sort([
        ['cookie', 'descending']
    ]).exec((err, res) => {
        if(err) console.log(err);
        if(res.length == 0) {
            return;
        } else if (res.length > 0) {
            console.log(path.resolve(__dirname, '../json/cookieLeaderboard.json'));
            for(let key in cookieLeaderboard) {
                delete cookieLeaderboard[key];
            }
            for(i = 0; i < res.length; i++) {
                let lbspot = i+1;
                let name = res[i].username;
                let cookies = res[i].cookie;
                let displayname = res[i].displayname;

                cookieLeaderboard[name] = {
                    cookie: cookies,
                    display: displayname,
                    spot: lbspot,
                }

                fs.writeFileSync(path.resolve(__dirname, '../json/cookieLeaderboard.json'), JSON.stringify(cookieLeaderboard, null, 4));
                
            }
        } 
    });

    Stats.find().sort([
        ['username', 'ascending']
    ]).exec((err, res) => {
        if(err) console.log(err);
        if(res.length == 0) {
            return;
        } else if (res.length > 0) {
            console.log(path.resolve(__dirname, '../json/statistics.json'));
            for(let key in Statistics) {
                delete Statistics[key];
            }
            for(i = 0; i < res.length; i++) {
                let name = res[i].username;
                let commandsused = res[i].commandsused;
                let cookieseaten = res[i].cookieseaten;
                let cookiesgifted = res[i].cookiesgifted;
                let moneygambled = res[i].moneygambled;
                let moneygained = res[i].moneygained;
                let timesworked = res[i].timesworked;
                let gainedworking = res[i].gainedworking;

                Statistics[name] = {
                    commandsused: commandsused,
                    cookieseaten: cookieseaten,
                    cookiesgifted: cookiesgifted,
                    moneygambled: moneygambled,
                    moneygained: moneygained,
                    timesworked: timesworked,
                    gainedworking: gainedworking
                }

                fs.writeFileSync(path.resolve(__dirname, '../json/statistics.json'), JSON.stringify(Statistics, null, 4));
                
            }
        } 
    });

}
module.exports = { exportLeaders }