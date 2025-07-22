var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieparser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


var app = express();
app.use(cors())

require('dotenv').config();

const compression = require('compression');
app.use(compression());

var indexRouter = require('./routers/index');
var usersRouter = require('./routers/users');
var Patients = require('./routers/patientData');
var Admin = require('./routers/admin')


app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');
app.use(cors({ origin: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/patient', Patients);
app.use('/api/admin', Admin)
// In app.js or bin/www


app.use(function (req, res, next) {

    //console.log(req)
    next(createError(404));
});
app.use(function (err, req, res, next) {
    console.log("error app.js file", err)
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
})
module.exports = app;