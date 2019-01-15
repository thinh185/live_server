var express = require('express')
var router = express.Router()
const User = require('../models/User');
const Room = require('../models/Room');

const responseStatus =  require('../responeStatus')
const util = require('../utils')
var uniqid = require('uniqid')
var forEach = require('async-foreach').forEach;

// clear data

router.post('/register', async (req, res)=> {
  try{
    let username = req.body.username
    let password = req.body.password
    console.log('asa ', username, password);
    let user = await User.findOne({username})
    const hashPassword = await util.encryptPw(password)
    console.log('asa ',{
      username,
      password: hashPassword,
      streamKey: uniqid()
    });

    if (!user){
      User.create({
        username,
        password: hashPassword,
        streamKey: uniqid()
      })
      return res.json(util.formResponse(responseStatus.SUCCESS, {
        message: 'register success'
      }))
    }else {
      return res.json(util.formResponse(responseStatus.ERROR, {
        message: "user existed"
      }))
    }
  }catch(error){
    return res.json(util.formResponse(responseStatus.ERROR, {
      message: "system error"
    }))
  }
})

router.post('/login', async (req, res) => {
  try{
    let username = req.body.username
    let password = req.body.password
    let user = await User.findOne({ username })
    console.log('login', username, password, user)
    if(!user) return res.json(util.formResponse(responseStatus.ERROR, {message: 'usename dont existed'}))
    const checkPassword = await util.checkPw(password, user.password)
    if(!checkPassword) return res.json(util.formResponse(responseStatus.ERROR, {message: 'usename or password error'}))
    
    return res.json(util.formResponse(responseStatus.SUCCESS, { user }))
  }catch(error){
    return res.json(util.formResponse(responseStatus.ERROR, { message: 'system fault' }))
  }
})

router.post('/list_liveStream', async (req, res) => {
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

router.get('/list_liveStream', async (req, res) => {
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