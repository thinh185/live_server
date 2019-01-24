var fs = require('fs');
let writeStream = fs.createWriteStream('../serverLog');
var uniqid = require('uniqid')

const Room = require('../models/Room')
const User = require('../models/User')
const Message = require('../models/Comments')

const Utils = require('../utils');
const LiveStatus = require('../liveStatus');
const roomList = {};

module.exports = io => {

  function createNewRoom(roomName, socket_master) {
    roomList[`${roomName}`] = {
      master: socket_master,
      participant: [],
      countHeart: 0,
      countLike: 0,
      countSad: 0,
      countHappy: 0,
      countWow: 0,
      countUrgy: 0,
      countViewer: 0,
      messages: []
    };

    console.log('new Room ', roomList );
    
  }
  
  function findParticipant(socketId) {
    for (let roomName in roomList) {
      for (let i = 0; i < roomList[roomName].participant.length; i++) {
        if (roomList[roomName].participant[i].socketId == socketId) {
          return roomList[roomName].participant[i];
        }
      }
    }
    return null;
  }
  let writeStream = fs.createWriteStream('./serverLog');
  
  io.on('connection', (socket) => {
  
    socket.on('testconnect', ()=> {
      setInterval(()=>{
        io.emit('testconnect', {message: 'user connected'});
      },300000)
    })
  
    socket.on('disconnect', () => {
      console.log('Disconnect');
      const { roomName, userId, liveStatus } = socket;
      if(!roomName) return
      for (let roomName in roomList) {
        if(roomList[roomName].master === userId){
          const liveStatus = LiveStatus.FINISH;
          const filePath = Utils.getMp4FilePath();

          const messages = roomList[roomName].messages;
          const countViewer = roomList[roomName].countViewer;
          const countHeart = roomList[roomName].countHeart;
          socket.liveStatus = liveStatus;
          
          Room.findOneAndUpdate(
            { roomName, userId },
            { liveStatus, filePath, countViewer, countHeart, messages },
            { new: true });
          delete roomList[roomName];
          break;
        }

        for (let i = 0; i < roomList[roomName].participant.length; i++) {
          if (roomList[roomName].participant[i].socketId == socket.id) {
            socket.broadcast.to(roomName).emit('leave-client');
            roomList[roomName].participant.splice(i, 1);
            break;
          }
        }
      }
    });
  
    socket.on('join-server', async (data) => {
      const { roomName, userId } = data;
      // socket client
      console.log('roomname user id', roomName, userId);
      
      socket.join(roomName);
      socket.roomName = roomName;
      roomList[roomName].countViewer += 1;
      const newuser = await User.findById(userId)
      io.to(roomName).emit('join-client', { roomName, countViewer: roomList[roomName].countViewer, newuser});
      Room.findOneAndUpdate({roomName},{countViewer: roomList[roomName].countViewer})
      roomList[roomName].participant.push({
        socketId: socket.id,
        userId: userId
      });
    });
  
    socket.on('leave-server', data => {
      console.log('leave-server');
      const { roomName, userId } = data;
      socket.leave(roomName);
      socket.roomName = '';
      io.to(roomName).emit('leave-client');
    });
  
    socket.on('register-live-stream', data => {
      console.log('register-live-stream ',data);
      const liveStatus = LiveStatus.REGISTER;
      const { userId, streamKey } = data;
      const roomName = `${streamKey}_${uniqid()}`
      createNewRoom(roomName, socket.id);
      
      roomList[roomName].participant.push({
        socketId: socket.id,
        userId: userId,
        streamKey
      });

      socket.join(roomName);
      socket.roomName = roomName;
      socket.userId = userId;
      socket.liveStatus = liveStatus;

      io.to(roomName).emit('on_live_stream', { roomName, userId, liveStatus });

      return Room.findOne({ roomName, userId },(error, foundRoom) => {
        
        if (foundRoom) {
          return;
        }
        const condition = {};
        condition.roomName = roomName;
        condition.userId = userId;
        condition.liveStatus = liveStatus;
        condition.createdAt = Utils.getCurrentDateTime();
        condition.updateAt = Utils.getCurrentDateTime();
        condition.filePath = ''
        Room.create(condition);
      });
    });
  
    socket.on('begin-live-stream', data => {
      const liveStatus = LiveStatus.ON_LIVE;
      
      const { roomName , userId } = data;
      
      socket.liveStatus = liveStatus;
      Room.findOneAndUpdate({ roomName },
        { liveStatus : 1, updateAt: Utils.getCurrentDateTime() },
        {new: true}, async (err,res) =>{
          const user = await User.findById(res.userId)
          io.local.emit('new-live-stream', {
            newroom: {...res._doc, username: user.username}
          });
      })
    });
  
    socket.on('finish-live-stream', data => {
      const liveStatus = LiveStatus.FINISH;
      const { roomName } = data;
      const filePath = Utils.getMp4FilePath();

      console.log('roomName roomName ',roomName, liveStatus);
      try {
        
        const messages = roomList[roomName].messages;
        const countViewer = roomList[roomName].countViewer;
        const countHeart = roomList[roomName].countHeart;
        socket.liveStatus = liveStatus;
        Room.findOneAndUpdate(
          { roomName },
          { liveStatus, filePath, countViewer, countHeart, messages },
          { new: true }, async (err, res) => {
            io.local.emit('live-stream-finish', {roomName} );
          });  
      } catch (error) {
        
      }
      
    });
  
    socket.on('send-heart', data => {
      const { roomName, type } = data;
      console.log('type', type);
      console.log('type', roomName);
      try {
        switch(type){
          case 'Angry':
            console.log('argy');
            roomList[roomName].countUrgy += 1;
            break;
          case 'Laugh':
            console.log('laugh');
            roomList[roomName].countHappy += 1;
            break;
          case 'Wow':
            console.log('wow');
            roomList[roomName].countWow += 1;
            break;
          case 'Like':
            console.log('like');
            roomList[roomName].countHeart += 1;
            break;
          case 'ThumpUp':
            console.log('thumb');
            roomList[roomName].countLike += 1;
            break;
          default:
            console.log('sad');
            roomList[roomName].countSad += 1;
            break;
            
        }
        const { countUrgy, countHappy, countWow, countLike, countSad, countHeart } = roomList[roomName]
        io.to(roomName).emit('send-heart',
        { roomName,countUrgy, countHappy, countWow, countLike, countSad, countHeart});
        Room.findOneAndUpdate({roomName}, { countUrgy, countHappy, countWow, countLike, countSad, countHeart})
      } catch (error) {
        
      }
    });
  
    socket.on('send-message', data => {
      console.log('send-message ', data.roomName);
      const {
        roomName,
        userId,
        username,
        message,
      } = data;
      roomList[roomName].messages.push({
        userId,
        username,
        message,
        createdAt: Utils.getCurrentDateTime()
      });
      Room.updateOne(
        {roomName: data.roomName},
        {$push: { comments: {message, userId, username} }},
        {new: true, safe: true, upsert: true })
        .then((result)=>{
          console.log('result ', result);
          io.to(roomName).emit('send-message', {
            comment: {message, userId, username},
            roomName
          });
        }).catch(err => {
          console.log('rooor ', err);
          
        })
    });
  });
};
