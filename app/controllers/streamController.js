var express = require('express')
var router = express.Router()
const User = require('../models/User');
const Room = require('../models/Room');
const Comment = require('../models/Comments');

const responseStatus =  require('../responeStatus')
const util = require('../utils')
var fs = require('fs');

let writeStream = fs.createWriteStream('../serverLog');


router.use('/list_live_stream', async (req, res) => {
  const live = await Room.find({liveStatus: 2})
  
  let list_live = []
  await Promise.all(live.map(async (item) => {
    const user = await User.findById(item.userId)
    let element = { ...item._doc }
    element.username = user.username
    list_live.push(element)
  }));
  return res.json(util.formResponse(responseStatus.SUCCESS, { list_live }))
})

router.post('/insert_message', (req,res) => {
  let username = req.body.username
  let userId = req.body.userId
  let message = req.body.message

  Comment.create({
    username,
    userId,
    content: message
  }).then(result => {
    writeStream.write(`${result._id} message success \n`)
    return res.json({message: 'success'})
  }).catch(err => {
    writeStream.write(`message error ${message} \n`)
    return res.json({message: 'error'})
  })

})

router.get('/read_message', (req, res) => {
  let page = parseInt(req.query.page || 1)

  Comment.paginate({}, {page, limit: 10}, (err, result) => {
    if(err){
      console.log(err);
      
      return res.json({ message: 'error'})
    }
    return res.json({result})
  })
})

module.exports = router