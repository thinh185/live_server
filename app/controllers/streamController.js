var express = require('express')
var router = express.Router()
const User = require('../models/User');
const Room = require('../models/Room');
const Comment = require('../models/Comments');

const responseStatus =  require('../responeStatus')
const util = require('../utils')


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

router.use('/insert_message', (req,res) => {
  let username = req.body.username
  let userId = req.body.userId
  let message = req.body.message

  console.log(request.body);
  
  Comment.create({
    username,
    userId,
    content: message
  }).then(res => {
    return res.json({message: 'success'})
  }).catch(err => {
    console.log('err ', err);
    return res.json({message: 'error'})
  })

})

module.exports = router