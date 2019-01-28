const { NodeMediaServer } = require('node-media-server');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const socketIO = require('socket.io');
const process = require("dotenv").config({path: 'product.env'});

const shopmodelsPath = `${__dirname}/app/models/`;
fs.readdirSync(shopmodelsPath).forEach(file => {
  if (~file.indexOf('.js')) {
    require(`${shopmodelsPath}/${file}`);
  }
});

// Controller
const userController = require('./app/controllers/usercontroller')
const streamController = require('./app/controllers/streamController')

const server = http.createServer(app);
const io = socketIO(server,{
  upgradeTimeout: 3600000
});

const socketIOController = require('./app/controllers/socketIO')(io);

mongoose.Promise = global.Promise;
global.appRoot = path.resolve(__dirname);

mongoose.connect(
  process.parsed.DB_HOST,
  { useNewUrlParser: true, user: process.parsed.USERDB, pass: process.parsed.PASSWORD },
  err => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to the database: ', "mongodb://127.0.0.1:27017/livestream_upgrade?authSource=admin");
    }
  }
);

app.use(bodyParser.json() )
app.use(bodyParser.urlencoded({extended: true}))

app.use('/authen', userController)
app.use('/stream', streamController)

app.use(express.static(`${__dirname}/public`));

server.listen(process.parsed.PORT,process.parsed.HOST, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening on port ${3333} ${process.parsed.HOST}`);
  }
});
