const { INTEGER, DATE } = require('sequelize');

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
    type: INTEGER,
    allowNull: false,
  },
  submitted: {
    type: DATE,
    allowNull: false,
  },
};
