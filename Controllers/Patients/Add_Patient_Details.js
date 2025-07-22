var Patient_Model = require('../../app/Model/patientData');
var User_Model = require('../../app/Model/users')
var Joi = require('@hapi/joi');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var path = require('path');
var whatsappQueue = require('../../app/Model/bull')
module.exports.added_patient_records = async function added_patient_records(req, res) {
  try {

    var params = JSON.parse(req.body.patientData);

    // Validate incoming data
    var validateData = Joi.object({
      userUniqueID: Joi.string().strict().required(),
      name: Joi.string().strict().required(),
      age: Joi.number().integer().strict().required(),
      weight: Joi.string().strict().required(),
      fatPercentage: Joi.string().strict().required(),
    });

    var result = await validateData.validate(params);

    if (result.error) {
      res.statusCode = 400;
      return res.json({
        response: 0,
        message: result.error.details[0].message
      });
    }

    // Find existing patient record
    var checking_user_uniqueID = await User_Model.findOne({
      userUniqueID: params.userUniqueID,
      registerType: "Patient"
    }).exec();

    if (!checking_user_uniqueID) {
      return res.json({
        response: 0,
        message: "User uniqueID data not found"
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.json({
        response: 0,
        message: "Please upload files or profile pic"
      });
    }

    let profilepic_url = '';
    let patientrecordpdf_url = '';

    // Check for files
    var objectkeys = Object.keys(req.files);
    var isprofilesend = objectkeys.includes("profilepic");
    var patientrecordpdfsend = objectkeys.includes("patientrecordpdf");

    if (!isprofilesend) {
      return res.json({
        response: 0,
        message: "Please upload profile pic"
      });
    }

    // Save profilepic
    if (isprofilesend) {
      var profilepicFile = req.files['profilepic'][0];
      profilepic_url = '/profilePics/' + profilepicFile.filename;
    }

    // Save patientrecordpdf or generate dummy
    if (patientrecordpdfsend) {
      var patientrecordpdfFile = req.files['patientrecordpdf'][0];
      patientrecordpdf_url = '/reports/' + patientrecordpdfFile.filename;
    } else {
      // generate dummy PDF
      var doc = new PDFDocument();
      var filename = `dummy-${Date.now()}.pdf`;
      var filePath = path.join(__dirname, '../../public/reports/', filename);
      var writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);
      doc.fontSize(20).text('This is a dummy patient record PDF.', 100, 100);
      doc.end();

      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      patientrecordpdf_url = '/reports/' + filename;
    }


    var PatientRecordID = "PID@" + new Date().getTime().toString();
    var added_Patient_record = await Patient_Model.insertMany([{
      userUniqueID: params.userUniqueID,
      patientRecordID: PatientRecordID,
      name: params.name,
      age: params.age,
      weight: params.weight,
      fatPercentage: params.fatPercentage,
      report_PDF: patientrecordpdf_url,
      profile_Image: profilepic_url
    },

    ])
    if (added_Patient_record.length > 0) {
      var patientObject = {
        userUniqueID: params.userUniqueID,
        patientRecordID: PatientRecordID,
        name: params.name,
        age: params.age,
        weight: params.weight,
        fatPercentage: params.fatPercentage,
        report_PDF: patientrecordpdf_url,
        profile_Image: profilepic_url
      }

     
      // var data = await whatsappQueue.add('sendReport', patientObject, {
      //   delay: 5000, // 5 seconds delay
      //   attempts: 3, // retry 3 times if it fails
      //   backoff: 3000, // wait 3 seconds between retries
      // });
      // console.log('First job added:', data.id);



      // var mm = await whatsappQueue.add('sendReport', patient, {
      //   delay: 0,
      //   attempts: 3,
      //   backoff: 3000,
      // });
      // console.log('Second job added:', mm.id);


      return res.json({ response: 3, message: "Patient record added success" })
    } else {
      return res.json({ response: 0, message: "Patient record added failure" })
    }

  } catch (error) {
    console.log(error);
    return res.json({
      response: 0,
      message: error.message
    });
  }
};
