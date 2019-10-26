// Created by: BennyYasuo, 2019.05.19

const db = require('mongoose');
const Cookie = require('../schema/cookieSchema.js');
db.connect("mongodb://localhost/kfpbot");

function add(user, display, amount) {

    Cookie.findOne({
        username: user
    }, (err, cookie) => {
        if(err) console.log(err);
        if(!cookie) {
            const newCookie = new Cookie({
                username: user,
                displayname: display,
                cookie: amount
            })
            newCookie.save().catch(err => console.log(err));
        } else {
            cookie.cookie = cookie.cookie + amount;
            cookie.save().catch(err => console.log(err));
        }
    });

}

module.exports = { add }

