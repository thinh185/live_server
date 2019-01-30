const Sequelize = require('sequelize');
const sequelize = new Sequelize('LiveStream', 'root', 'thinh102', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  logging: false
});

module.exports = sequelize