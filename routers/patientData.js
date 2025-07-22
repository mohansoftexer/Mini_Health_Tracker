var express = require('express');
var router = express.Router();

var verifyToken = require('./VerificationToken');
router.post('/singup', (req, res) => {
  var Customer_Router_Signup = require('../Controllers/Patients/SignUp_Patients');
  Customer_Router_Signup.singup(req, res)
})

router.post('/login', (req, res) => {
  var Login_Router = require('../Controllers/Patients/login');
  Login_Router.login(req, res)
})

var multer = require('multer');
var path = require('path');

// Configure disk storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profilepic') {
      cb(null, 'public/profilePics/');
    } else if (file.fieldname === 'patientrecordpdf') {
      cb(null, 'public/reports/');
    }
  },
  filename: function (req, file, cb) {
    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    var ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

var upload = multer({ storage: storage });
var added_patient_record = require('../Controllers/Patients/Add_Patient_Details')
router.post(
  '/addpatientrecord', verifyToken,
  upload.fields([
    { name: 'profilepic', maxCount: 1 },
    { name: 'patientrecordpdf', maxCount: 1 }
  ]),
  added_patient_record.added_patient_records
);
var update_patient_records = require('../Controllers/Patients/Update_Patient_Details')
router.put(
  '/updatepatientrecord', verifyToken,
  upload.fields([
    { name: 'profilepic', maxCount: 1 },
    { name: 'patientrecordpdf', maxCount: 1 }
  ]),
  update_patient_records.update_patient_records
);

router.post('/fetchrecords', verifyToken, (req, res) => {
  var FetchRecords_Router = require('../Controllers/Patients/Fetch_Patient_Details');
  FetchRecords_Router.FetchRecords_Router(req, res)
})

router.delete('/deleterecords', verifyToken, (req, res) => {
  var DeleteRecords_Router = require('../Controllers/Patients/Delete_Patient_Details');
  DeleteRecords_Router.DeleteRecords_Router(req, res)
})



module.exports = router;