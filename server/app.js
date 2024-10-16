var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { MongoClient } = require('mongodb');

var clickRouter = require('./routes/click');
var cors = require('cors');

var app = express();


const mongoURI = process.env.MONGO_URI
MongoClient.connect(mongoURI)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db('clicker-app');
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use((req, res, next) => {
  req.db = db;
  next();
});
 
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/click', clickRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

module.exports = app;
