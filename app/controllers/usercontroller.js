var express = require('express')
var router = express.Router()
const User = mongoose.model('User');
const responseStatus =  require('../responeStatus')
const util = require('../utils')
var uniqid = require('uniqid')

router.post('/register', async (req, res)=> {
  try{
    let username = req.param.username
    let password = req.param.password
    let user = await User.findOne({username})
    if (!user){
      User.create({
        username,
        password: util.encryptPw(password),
        streamKey: uniqid()
      })
      return util.formResponse(responseStatus.SUCCESS, {
        message: 'register success'
      })
    }else {
      return util.formResponse(responseStatus.ERROR, {
        message: "user existed"
      })
    }
  }catch(error){
    return util.formResponse(responseStatus.ERROR, {
      message: "system error"
    })
  }
})

router.post('/login', async (req, res) => {
  try{
    let username = req.param.username
    let password = req.param.password
    let user = User.findOne({ username })
    if(!user || util.checkPw(password, user.password)) return util.formResponse(responseStatus.ERROR, {message: 'usename or password error'})
    return util.formResponse(responseStatus.SUCCESS, {user})
  }catch(error){
    return util.formResponse(responseStatus.ERROR, { message: 'system fault' })

  }
})

module.exports = router