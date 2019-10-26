// Created by: BennyYasuo, 2019.05.19

const db = require('mongoose');

const cookieSchema = db.Schema({
    username: String,
    displayname: String,
    cookie: Number
});

module.exports = db.model("Cookie", cookieSchema);