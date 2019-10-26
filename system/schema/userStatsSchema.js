const db = require('mongoose');

const userStatsSchema = db.Schema({
    username: String,
    displayname: String,
    commandsused: Number,
    cookieseaten: Number,
    cookiesgifted: Number,
    moneygambled: Number,
    moneygained: Number,
    timesworked: Number,
    gainedworking: Number
});

module.exports = db.model("Statistics", userStatsSchema);