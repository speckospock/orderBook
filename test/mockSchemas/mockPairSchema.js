const { INTEGER, STRING } = require('sequelize');

module.exports = {
  pairId: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  }
};