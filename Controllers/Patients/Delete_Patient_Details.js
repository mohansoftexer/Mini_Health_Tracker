var Patient_Model = require('../../app/Model/patientData');
var users_Model = require('../../app/Model/users')
var Joi = require('@hapi/joi');
var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');
var fs = require('fs');
module.exports.DeleteRecords_Router = async function DeleteRecords_Router(req, res) {
    try {
        var params = req.body;
        if (params == undefined) {
            return res.json({ response: 0, message: "Please pass data" })
        }
        var validateData = Joi.object({
            userUniqueID: Joi.string().strict().required(),
            patientRecordID: Joi.string().strict().required(),

        })
        var result = await validateData.validate(params);
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }

        if (params.patientRecordID == "All") {
            var checking_user_uniqueID = await users_Model.findOne({ userUniqueID: params.userUniqueID }).exec();
            if (!checking_user_uniqueID) {
                return res.json({ response: 0, message: "User uniqueID data not found" })
            }

            var Patient_Records = await Patient_Model.find({
                userUniqueID: params.userUniqueID
            },
            )
            if (Patient_Records.length > 0) {
                var Delete_Record = await Patient_Model.deleteMany({
                    userUniqueID: params.userUniqueID
                })
                if (Delete_Record.deletedCount > 0) {
                    for (var count = 0; count < Patient_Records.length; count++) {
                        if (Patient_Records[count]) {
                            var profilepicold = Patient_Records[count].profile_Image;
                            var recordfileold = Patient_Records[count].report_PDF
                            fs.unlink('./public' + profilepicold, (err) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log("file unlink success")
                                }
                            })
                            fs.unlink('./public' + recordfileold, (err) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log("file unlink success")
                                }
                            })
                        }
                    }
                    return res.json({ response: 3, message: "Patient record data deleted successfully" })
                } else {
                    return res.json({ response: 0, message: "Patient record data deleted failure" })
                }
            } else {
                return res.json({ response: 0, message: "Patient record data not found" })
            }
        } else {
            var checking_user_uniqueID = await users_Model.findOne({ userUniqueID: params.userUniqueID }).exec();
            if (!checking_user_uniqueID) {
                return res.json({ response: 0, message: "User uniqueID data not found" })
            }

            var Patient_Records = await Patient_Model.findOne({
                userUniqueID: params.userUniqueID,
                patientRecordID: params.patientRecordID
            },
            )
            if (Patient_Records) {
                var Delete_Record = await Patient_Model.deleteOne({
                    userUniqueID: params.userUniqueID,
                    patientRecordID: params.patientRecordID
                })
                if (Delete_Record.deletedCount > 0) {
                    var profilepicold = Patient_Records.profile_Image;
                    var recordfileold = Patient_Records.report_PDF
                    fs.unlink('./public' + profilepicold, (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("file unlink success")
                        }
                    })
                    fs.unlink('./public' + recordfileold, (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("file unlink success")
                        }
                    })
                    return res.json({ response: 3, message: "Patient record data deleted successfully" })
                } else {
                    return res.json({ response: 0, message: "Patient record data deleted failure" })
                }
            } else {
                return res.json({ response: 0, message: "Patient record data not found" })
            }
        }



    } catch (error) {
        console.log(error);
        return res.json({ response: 0, message: error.message })
    }
}