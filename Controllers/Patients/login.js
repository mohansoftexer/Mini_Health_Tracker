var users_Model = require('../../app/Model/users');
var Joi = require('@hapi/joi');
var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken')
module.exports.login = async function login(req, res) {
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
        var token = jsonwebtoken.sign({ emailID: params.emailID }, process.env.SECRET_KEY, { expiresIn: '1h' })
        var Checking_User_EmailID = await users_Model.findOne({
            emailID: params.emailID,
            registerType: params.registerType
        }, { _id: 0, __v: 0 }).exec();
        if (Checking_User_EmailID) {
            var Compare_userPassword = await bcrypt.compare(params.password, Checking_User_EmailID.password)
            if (Compare_userPassword) {
                return res.json({
                    response: 3, message: "Login Successfully",
                    userDetails: Checking_User_EmailID,
                    jwttoken: token
                })
            } else {
                return res.json({ response: 0, message: "Password is wrong, Please check once" })
            }

        } else {
            return res.json({ response: 0, message: "Please signup there is no account" })
        }



    } catch (error) {
        console.log(error);
        return res.json({ response: 0, message: error.message })
    }
}