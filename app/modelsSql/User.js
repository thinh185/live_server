const sequelize = require('./index')
const Sequelize = require('sequelize');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  streamKey: {
    type: Sequelize.STRING
  },
  token: {
    type: Sequelize.STRING
  }
});

User.insertUser = (username, password, streamKey, token) => {
  console.log('vo day');
  
  return new Promise((resolve, reject)=> {
    User.create({username, password, streamKey,token}).then(res =>{
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  }) 
  
}

User.getUser = async (id) => {
  console.log("vo day")
  const user = await User.findById(id)
  return user
}

module.exports = User