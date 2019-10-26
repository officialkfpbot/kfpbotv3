const db = require('mongoose');

const balanceSchema = db.Schema({
    username: String,
    displayname: String,
    balance: Number
});

module.exports = db.model("Balance", balanceSchema);