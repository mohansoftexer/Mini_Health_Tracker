var user_Module = require('../../app/Model/users');
var Patient_Model = require('../../app/Model/patientData')
var Joi = require('@hapi/joi')
module.exports.dashboard_route = async function dashboard_route(req, res) {
    try {
        var params = req.body;
        if (params == undefined) {
            return res.json({ response: 0, message: "Please pass data" })
        }
        var AdminDataValidate = Joi.object({
            userUniqueID: Joi.string().strict().required()
        })
        var result = await AdminDataValidate.validate(params);
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }

        var checking_Admin_userID = await user_Module.findOne({
            userUniqueID: params.userUniqueID,
            registerType: "Admin"
        })
        if (checking_Admin_userID) {
            var countpatients = await user_Module.aggregate([
                { $match: { registerType: "Patient" } },
                { $count: "patientCount" }
            ])
            var sendinvitation = await Patient_Model.aggregate([
                {
                    $facet: {
                        reportsend: [
                            { $match: { isreportsend: false } },
                            { $count: "count" }
                        ],
                        whatsappInvitationsend: [
                            { $match: { iswhatsappMessageDelivered: false } },
                            { $count: "count" }
                        ]
                    }
                }
            ])
            var objectData = {

            }
            if (countpatients.length > 0) {
                objectData["patientcount"] = countpatients[0].patientCount || 0;
            } else {
                objectData["patientcount"] = 0;
            }
            if (sendinvitation.length > 0) {
                objectData["reportsend"] = sendinvitation[0].reportsend[0].count || 0;
                objectData["whatsappInvitationsend"] = sendinvitation[0].whatsappInvitationsend[0].count || 0;
            } else {
                objectData["reportsend"] = 0;
                objectData["whatsappInvitationsend"] = 0;
            }
            return res.json({ response: 3, message: "Dash board data fetch successfully",adminData:objectData })


        } else {
            return res.json({ response: 0, message: "Admin data not found" })
        }


    } catch (error) {
        return res.json({ response: 0, message: error.message })
    }
}