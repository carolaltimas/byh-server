require('dotenv').config();
const express = require('express');
//config
const {PORT, DATABASE_URL,DOMAINS } = require('./config');
//routers
const {router:mainRouter} = require('./routers/main-router');
const {router: authRouter} = require('./auth/router');
//db
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//auth
const passport = require('passport');
const {localStrategy, jwtStrategy} = require('./auth/strategies');
//pretty json body
const jsonParser = bodyParser.json();
const app = express();
app.use(jsonParser);
app.use(function (req, res, next) {
    let origin = req.headers.origin;
    let allowedOrigins = DOMAINS.split(',');
    if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/auth/', authRouter);
app.use('/api',mainRouter);
//generic error handler
app.use(function(req,res,next){
  let {err} = res;
  console.log(err);
  return res.json({
    code:500,
    err,
    message:'Error '
  });
})

function runServer( databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl,{ useNewUrlParser: true,useUnifiedTopology: true }, err => {
        if (err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }
  
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
            return reject(err);
            }
            resolve();
        });
        });
    });
}
  

runServer(DATABASE_URL).catch(err => console.error(err));
  
module.exports = { app, runServer, closeServer };