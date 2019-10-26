const db = require('mongoose');

const reportSchema = db.Schema({
    _id: db.Schema.Types.ObjectId, 
    reportedUser: String,
    reportedBy: String,
    reportReason: String
});

module.exports = db.model("Report", reportSchema);