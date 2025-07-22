var Patient_Model = require('../../app/Model/patientData');
var users_Model = require('../../app/Model/users')
var Joi = require('@hapi/joi');
var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken')
module.exports.FetchRecords_Router = async function FetchRecords_Router(req, res) {
    try {
        var params = req.body;
        if (params == undefined) {
            return res.json({ response: 0, message: "Please pass data" })
        }
        var validateData = Joi.object({
            userUniqueID: Joi.string().strict().required(),
            pageNo: Joi.number().integer().strict().required(),
            size: Joi.number().integer().strict().required(),
            isSortAge: Joi.boolean().strict().required(),

        })
        var result = await validateData.validate(params);
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }
        var pageNo = Number(params.pageNo) > 0 ? Number(params.pageNo) : 1;
        var size = Number(params.size) > 0 ? Number(params.size) : 10;
        if (params.userUniqueID == "All") {
            var Count_Patient_Records = await Patient_Model.countDocuments({})
            if (params.isSortAge == true) {
                var Patient_Records = await Patient_Model.find({},
                    { _id: 0, __v: 0 }).sort({ age: 1 }).skip((pageNo - 1) * size).limit(size)
            } else {
                var Patient_Records = await Patient_Model.find({},
                    { _id: 0, __v: 0 }).skip((pageNo - 1) * size).limit(size)
            }

            if (Patient_Records.length > 0) {
                var totalpages = Math.ceil(Count_Patient_Records / size);
                return res.json({
                    response: 3, message: "Patient records fetch successfully",
                    totalpages: totalpages, totalrecords: Patient_Records
                })

            } else {
                return res.json({ response: 0, message: "Patient records data not found" })
            }
        } else {
            var checking_user_uniqueID = await users_Model.findOne({ userUniqueID: params.userUniqueID }).exec();
            if (!checking_user_uniqueID) {
                return res.json({ response: 0, message: "User uniqueID data not found" })
            }
            var Count_Patient_Records = await Patient_Model.countDocuments({ userUniqueID: params.userUniqueID })
            if (params.isSortAge == true) {
                var Patient_Records = await Patient_Model.find({ userUniqueID: params.userUniqueID },
                    { _id: 0, __v: 0 }).sort({ age: 1 }).skip((pageNo - 1) * size).limit(size)
            } else {
                var Patient_Records = await Patient_Model.find({ userUniqueID: params.userUniqueID },
                    { _id: 0, __v: 0 }).skip((pageNo - 1) * size).limit(size)
            }

            if (Patient_Records.length > 0) {
                var totalpages = Math.ceil(Count_Patient_Records / size);
                return res.json({
                    response: 3, message: "Patient records fetch successfully",
                    totalpages: totalpages, totalrecords: Patient_Records
                })

            } else {
                return res.json({ response: 0, message: "Patient records data not found" })
            }
        }



    } catch (error) {
        console.log(error);
        return res.json({ response: 0, message: error.message })
    }
}