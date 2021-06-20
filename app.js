/* eslint-disable object-shorthand */
const express = require('express');
// eslint-disable-next-line new-cap
const path = require('path');

const cors = require('cors');
// const winston = require('winston');
// const expressWinston = require('express-winston');
require('winston-daily-rotate-file');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const multer = require('multer');
const mongoSanitize = require('express-mongo-sanitize'); // for nosql injection
const xxs = require('xss-clean'); // for injection
const dotenv = require('dotenv'); //for config files

const Config = require('./config');
const pjson = require('./package.json');
const Logger = require('./modules/logger.js');
const appCrons = require('./crons');
const appSeeds = require('./seed');
const Security = require('./security');
const { userAPI } = require('./components/user');
const { categoryAPI } = require('./components/category');
const { placeAPI } = require('./components/place');
const { eventAPI } = require('./components/events');

dotenv.config({
  path: './config.env'
});

const app = express();
const PORT = process.env.PORT || 3000;

// database connection
mongoose.connect(Config.dbURI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, () => {
  // seed the application with pre defined data
  appSeeds();
});

// cors
app.use(cors());
app.use(helmet({
  // over-ridden by masking
  hidePoweredBy: false
}));

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// logs db connection errors
Logger.dbConnection(mongoose);
// log the time taken in each request
app.use(Logger.routeTime());
app.use(morgan('tiny'));

// Data sanitization against NoSQL Query injection
app.use(mongoSanitize()); // prevent from NoSQL injection like (email:{"$gt":""}) in body

// Data sanitization against cross-site scripting (XSS)
app.use(xxs()); // prevent if code contain html code or js code in body and convert it to symbols known

// app.use(morgan('combined', { stream: winston.stream }));
app.use(Security.preventBlocked);

Security.masking(app);

// set port
app.set('port', PORT);

app.use(express.static(`${__dirname }/clients/yalla-places-owner-app`));
app.use(express.static(`${__dirname }/clients/admin-dashboard`));




// passing routes
app.use('/api', userAPI);
app.use('/api', categoryAPI);
app.use('/api', placeAPI);
app.use('/api', eventAPI);


// activate all cron jobs
appCrons();

// redirect client
app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.resolve('./clients/admin-dashboard/index.html'));
});
// redirect client
app.get('*', (req, res) => {
  res.sendFile(path.resolve('./clients/yalla-places-owner-app/index.html'));
});


if (Config.canUseCustomErrorPages) {
  // Handle 500
  app.use(function (error, req, res, next) {
    res.status(500).send({ title: '500: Internal Server Error', error });
    // // set locals, only providing error in development
    // res.locals.message = error.message;
    // res.locals.error = req.app.get('env') === 'development' ? error : {};

    // // add this line to include winston logging
    // // winston.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    // winston.error(winston.combinedFormat(error, req, res));

    // // render the error page
    // res.status(error.status || 500);
    // res.render('error');
  });

  // Handle 404
  app.use(function (req, res) {
    res.status(404).send({ title: '404: File Not Found' });
    Security.log404(req);
  });
}

app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) res.status(500).send(err.message);
  else next(err);
});

const server = require('http').createServer(app);
server.listen(app.get('port'), function () {
  console.log(` ################## ${pjson.name} \n ##################  ${Config.currentEnv}  \n ################## running on port : ${app.get('port')}`);
});