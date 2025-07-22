var Patient_Model = require('../../app/Model/patientData');
var Joi = require('@hapi/joi');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var path = require('path');
var User_Model = require('../../app/Model/users')
module.exports.update_patient_records = async function update_patient_records(req, res) {
  try {
    var params = JSON.parse(req.body.patientData);

    const validateData = Joi.object({
      userUniqueID: Joi.string().strict().required(),
      patientRecordID: Joi.string().strict().required(),
      name: Joi.string().strict().required(),
      age: Joi.number().integer().strict().required(),
      weight: Joi.string().strict().required(),
      fatPercentage: Joi.string().strict().required(),
    });

    const result = await validateData.validate(params);

    if (result.error) {
      res.statusCode = 400;
      return res.json({
        response: 0,
        message: result.error.details[0].message
      });
    }

    var existingPatient = await User_Model.findOne({
      userUniqueID: params.userUniqueID,
      registerType: "Patient"
    }).exec();

    if (!existingPatient) {
      return res.json({
        response: 0,
        message: "User uniqueID data not found"
      });
    }
    var Checking_RecordID = await Patient_Model.findOne({
      userUniqueID: params.userUniqueID,
      patientRecordID: params.patientRecordID
    })
    if (!Checking_RecordID) {
      return res.json({
        response: 0,
        message: "User patient recordID data not found"
      });
    }
    if (!req.files || !Object.keys(req.files).includes('profilepic')) {
      return res.json({
        response: 0,
        message: "Profile pic is required for update"
      });
    }

    let profilepic_url = existingPatient.profilepic_url || '';
    let patientrecordpdf_url = existingPatient.patientrecordpdf_url || '';

    // Remove old profile pic if new one uploaded
    if (req.files['profilepic']) {
      const profilepicFile = req.files['profilepic'][0];
      profilepic_url = '/profilePics/' + profilepicFile.filename;

      // Delete old profile pic if exists
      if (existingPatient.profilepic_url) {
        const oldPath = path.join(__dirname, '../../public', existingPatient.profilepic_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    // Remove old patient PDF if new one uploaded
    if (req.files['patientrecordpdf']) {
      const patientrecordpdfFile = req.files['patientrecordpdf'][0];
      patientrecordpdf_url = '/reports/' + patientrecordpdfFile.filename;

      if (existingPatient.patientrecordpdf_url) {
        const oldPath = path.join(__dirname, '../../public', existingPatient.patientrecordpdf_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    } else {
      // If no new PDF, generate dummy — and remove old one
      if (existingPatient.patientrecordpdf_url) {
        const oldPath = path.join(__dirname, '../../public', existingPatient.patientrecordpdf_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const doc = new PDFDocument();
      const filename = `dummy-${Date.now()}.pdf`;
      const filePath = path.join(__dirname, '../../public/reports/', filename);
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);
      doc.fontSize(20).text('This is a new dummy PDF for updated record.', 100, 100);
      doc.end();

      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      patientrecordpdf_url = '/reports/' + filename;
    }

    // Update
    var Checking_RecordID_Update = await Patient_Model.updateOne({
      userUniqueID: params.userUniqueID,
      patientRecordID: params.patientRecordID
    },
      {
        $set: {
          name: params.name,
          age: params.age,
          fatPercentage: params.fatPercentage,
          weight: params.weight,
          profile_Image: profilepic_url,
          report_PDF: patientrecordpdf_url
        }
      })
    if (Checking_RecordID_Update) {
      return res.json({
        response: 3,
        message: "Patient record updated successfully"
      });
    } else {
      return res.json({
        response: 0,
        message: "Patient record updated failure"
      });
    }




  } catch (error) {
    console.log(error);
    return res.json({
      response: 0,
      message: error.message
    });
  }
};
