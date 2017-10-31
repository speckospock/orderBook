const { INTEGER, FLOAT } = require('sequelize');

module.exports = {
  orderId: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  volume: {
    type: INTEGER,
    allowNull: false,
  },
  price: {
    type: FLOAT,
    allowNull: false,
  },
};
