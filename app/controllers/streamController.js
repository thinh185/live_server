var express = require('express')
var router = express.Router()
const User = require('../models/User');
const Room = require('../models/Room');

const responseStatus =  require('../responeStatus')
const util = require('../utils')


router.use('/list_live_stream', async (req, res) => {
  const live = await Room.find({liveStatus: 1})
  let list_live = []
  await Promise.all(live.map(async (item) => {
    const user = await User.findById(item.userId)
    let element = { ...item._doc }
    element.username = user.username
    list_live.push(element)
  }));
  return res.json(util.formResponse(responseStatus.SUCCESS, { list_live }))
})

module.exports = router