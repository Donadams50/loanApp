const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const dotenv=require('dotenv');
dotenv.config();

const db = {};
db.mongoose = mongoose;
db.url = process.env.url;


db.profiles = require("../members/members.model.js")(mongoose);
db.auths = require("../members/auth.model.js")(mongoose);
db.branches = require("../helper/branches.model.js")(mongoose);
db.roles = require("../helper/roles.model.js")(mongoose);
db.approvalprocess = require("../approvalprocess/approvalprocess.model.js")(mongoose);
db.customerapplications = require("../loanapplication/customerapplication.model.js")(mongoose);
db.loanofficerapplications = require("../loanapplication/loanofficerapplication.model.js")(mongoose);
db.offices = require("../office/office.model.js")(mongoose);
db.groups = require("../group/group.model.js")(mongoose)
db.loantypes = require("../helper/loantype.model.js")(mongoose)

module.exports = db;

