const sequelize = require('./index')
const Sequelize = require('sequelize');
const randomstring = require("randomstring");

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.TEXT
  },
  email: {
    type: Sequelize.TEXT
  },
  phone: {
    type: Sequelize.TEXT
  },
  avatar: {
    type: Sequelize.TEXT
  },
  introduce: {
    type: Sequelize.TEXT
  },
  token: {
    type: Sequelize.TEXT
  },
  age: {
    type: Sequelize.INTEGER,
    defaultValue: 16,
  }
});

randomUpdate = () =>  {
  return {
    username: randomstring.generate(8),
    password: randomstring.generate(10),
    streamKey: randomstring.generate(10),
    token: randomstring.generate(30),
  }
}

User.insertUser = (data) => {
  
  return new Promise((resolve, reject)=> {
    User.create(data).then(res =>{
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  }) 
  
}

User.getUser = async (id) => {
  const user = await User.findById(id)
  return user
}

User.updateUser = async (id, data) => {
  const updateUser = await User.update(data, {where: {id}})
  return updateUser
}

User.sync({alter: true})

module.exports = User