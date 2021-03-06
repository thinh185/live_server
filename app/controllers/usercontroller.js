var express = require('express')
var router = express.Router()
const User = require('../models/User');
const Room = require('../models/Room');

const responseStatus =  require('../responeStatus')
const util = require('../utils')
var uniqid = require('uniqid')
const UserSql = require('../modelsSql/User')
// clear data
var fs = require('fs');

let writeStream = fs.createWriteStream('../serverLog');

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

router.post('/add_new_user', async (req, res) => {

  let data = req.body
  writeStream.write(`${data} data receipt success \n`)

  if(!data.username) return res.json(util.formResponse(responseStatus.ERROR, {message: 'error'}))
  const newuser = await UserSql.insertUser(data)
  return res.json(util.formResponse(responseStatus.SUCCESS, { newuser }))
})

router.get('/get_user', async (req,res) => {
  let id = req.query.id

  const user = await UserSql.getUser(id)
  return res.json(util.formResponse(responseStatus.SUCCESS, { user }))

})

router.put('/update_user/:id', async (req,res) => {
  let id = req.params.id
  
  const data = req.body
  const user = await UserSql.updateUser(id, data)
  return res.json(util.formResponse(responseStatus.SUCCESS, { user }))

})


module.exports = router