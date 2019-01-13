const { NodeMediaServer } = require('node-media-server');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('config');
const utils = require('./app/utils');
const socketIO = require('socket.io');

const shopmodelsPath = `${__dirname}/app/models/`;
fs.readdirSync(shopmodelsPath).forEach(file => {
  if (~file.indexOf('.js')) {
    require(`${shopmodelsPath}/${file}`);
  }
});

// Controller
const userController = require('./app/controllers/usercontroller')

const server = http.createServer(app);
const io = socketIO(server);

const socketIOController = require('./app/controllers/socketIO')(io);

mongoose.Promise = global.Promise;
global.appRoot = path.resolve(__dirname);

mongoose.connect(
  "mongodb://127.0.0.1:27017/livestream?authSource=admin",
  // { useNewUrlParser: true, user: 'admin', pass: '123456' },
  { useNewUrlParser: true, user: 'mongoadmin', pass: 'mongoadmin' },
  err => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to the database: ', "mongodb://127.0.0.1:27017/livestream?authSource=admin");
    }
  }
);

app.use(bodyParser.json() )
app.use(bodyParser.urlencoded({extended: true}))
app.get('/dcm', (req,res)=>{
  return res.json({dm: "dm"})
})
app.use('/authen', userController)

app.use(express.static(`${__dirname}/public`));

server.listen(3333,"127.0.0.1", err => {
  // server.listen(3333, '103.221.221.111', err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening on port ${3333}`);
  }
});

const nodeMediaServerConfig = {
  // logType: 3,
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    mediaroot: './media',
    allow_origin: '*'
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        ac: 'aac',
        mp4: true,
        mp4Flags: '[movflags=faststart]'
      }
    ]
  }
};

var nms = new NodeMediaServer(nodeMediaServerConfig);
nms.run();

nms.on('getFilePath', (streamPath, oupath, mp4Filename) => {
  console.log('---------------- get file path ---------------');
  console.log(streamPath);
  console.log(oupath);
  console.log(mp4Filename);
  utils.setMp4FilePath(oupath + '/' + mp4Filename);
});
