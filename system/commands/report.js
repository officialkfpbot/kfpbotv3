// Created by: BennyYasuo, 2019.03.17

const db = require('mongoose');
const Report = require("../schema/reportSchema.js");
db.connect("mongodb://localhost/kfpbot");

module.exports.run = async (client, channel, reporter, reportee, reason) => {
    if(reporter == reportee) return client.say(channel, "Why would you report yourself? LUL");
    const report = new Report({
        _id: db.Types.ObjectId(),
        reportedUser: reportee,
        reportedBy: reporter,
        reportReason: reason
    });
    report.save()
    .then(result => console.log(result))
    .catch(err => console.log(err));

    client.say(channel, "User successfully reported.");
}

module.exports.help = {
    name: "report"
}