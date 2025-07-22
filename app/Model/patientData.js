var mongoose = require('mongoose');
var dbconnect = require('./mongooseConnection')
var schema = mongoose.Schema;
var patientData = new schema({
    patientRecordID: {
        type: String,
        required: true,
        default: ""
    },
    userUniqueID: {
        type: String,
        required: true,
        default: ""
    },
    name: {
        type: String,
        required: false,
        default: ""

    },
    age: {
        type: Number,
        required: false

    },
    weight: {
        type: String,
        required: false,
        default: ""

    },
    fatPercentage: {
        type: String,
        required: false,
        default: ""
    },
    report_PDF: {
        type: String,
        required: false,
        default: ""

    },
    profile_Image: {
        type: String,
        required: false,
        default: ""

    },
    timeStamp: {
        type: String,
        required: false,
        default: new Date().getTime().toString()
    },
    isreportsend:{
        type:Boolean,
        required:false,
        default:false
    },
    iswhatsappMessageDelivered:{
        type:Boolean,
        required:false,
        default:false
    },
})
//dbconnect.connectDatabase()
module.exports = mongoose.model('patientrecord', patientData)