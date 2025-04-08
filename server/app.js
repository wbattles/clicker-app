var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { MongoClient } = require('mongodb');

var clickRouter = require('./routes/click');
var cors = require('cors');

var app = express();

let db;
let isDbConnected = false;

const mongoURI = process.env.MONGO_URI;
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  serverSelectionTimeoutMS: 5000
};

MongoClient.connect(mongoURI, mongoOptions)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db('clicker-app');
    isDbConnected = true;
    return db.collection('clicks').updateOne(
      {},
      { $setOnInsert: { clickCount: 0 } },
      { upsert: true }
    );
  })
  .then(() => {
    console.log('Click collection initialized');
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path);
  next();
});

app.use((req, res, next) => {
  req.db = db;
  req.isDbConnected = isDbConnected;
  next();
});
 
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/readiness', (req, res) => {
  if (isDbConnected) {
    res.status(200).send('Ready');
  } else {
    res.status(503).send('Database not connected');
  }
});

app.use('/click', clickRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;