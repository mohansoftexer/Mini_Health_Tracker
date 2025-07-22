
var Users_Model = require('../../app/Model/users');
var Joi = require('@hapi/joi');
var bcrypt = require('bcrypt')
module.exports.singup = async function singup(req, res) {
    try {
        var params = req.body;
        if (params == undefined) {
            return res.json({ response: 0, message: "Please pass data" })
        }
        var validateData = Joi.object({
            emailID: Joi.string().strict().email().required(),
            password: Joi.string().strict().required(),
            registerType: Joi.string().strict().valid("Admin", "Patient", "Coach").required()
        })
        var result = await validateData.validate(params);
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }

        var Checking_User_EmailID = await Users_Model.findOne({
            emailID: params.emailID,
            registerType: params.registerType
        }).exec();
        if (!Checking_User_EmailID) {
            var hashpassword = bcrypt.hash(params.password, 10, async (err, hash) => {
                if (err) {
                    return res.json({ response: 0, message: "Somethig went to wrong" })
                } else {
                    var userCreate = await Users_Model.insertMany([{
                        userUniqueID: "AID@" + new Date().getTime(),
                        emailID: params.emailID,
                        password: hash,
                        registerType: params.registerType,
                    }])
                    if (userCreate.length > 0) {
                        return res.json({ response: 3, message: "User signup Success" })
                    } else {
                        return res.json({ response: 0, message: "User signup failure" })
                    }
                }
            });


        } else {
            return res.json({ response: 0, message: "This user already exists, Please login" })
        }



    } catch (error) {
        console.log(error);
        return res.json({ response: 0, message: error.message })
    }
}