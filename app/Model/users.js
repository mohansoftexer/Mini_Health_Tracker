var mongoose = require('mongoose');
var dbconnect = require('./mongooseConnection')
var schema = mongoose.Schema;
var usersdata = new schema({
    userUniqueID: {
        type: String,
        required: true,
        default: ""
    },
    emailID: {
        type: String,
        required: false,
        default: ""
    },
    password: {
        type: String,
        required: false,
        default: ""
    },
    registerType:{
         type: String,
        required: false,
        default: ""
    },
    timeStamp: {
        type: String,
        required: false,
        default: new Date().toString()
    }
})
dbconnect.connectDatabase()
module.exports = mongoose.model('user', usersdata)
