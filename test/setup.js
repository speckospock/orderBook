const Sequelize = require('sequelize');
const { mockOrderSchema, mockPairSchema } = require('./mockSchemas');
const { POSTGRES: { USER, PASSWORD, HOST }} = require('../config');

// setup Postgres
const sequelize = new Sequelize('mockOrderBook', USER, PASSWORD, {
  host: HOST,
  dialect: 'postgres',
  syncOnAssociation: true,
  pool: { maxConnections: 25, maxIdleTime: 150},
  logging: false,
});

// confirm that the connection went through
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// define a bids table, indexed on price and timestamp for fast queries
const Buy = sequelize.define('buy', mockOrderSchema, {
  indexes: [ // A BTREE index with an ordered field
    {
      method: 'BTREE',
      fields: ['price', 'createdAt']
    }
  ]
});

// define an asks table, indexed on price and timestamp for fast queries
const Sell = sequelize.define('sell', mockOrderSchema, {
  indexes: [ // A BTREE index with an ordered field
    {
      method: 'BTREE',
      fields: ['price', 'createdAt']
    }
  ]
});

// define a simple table to store the valid instruments
const Pair = sequelize.define('pair', mockPairSchema);

Buy.sync();
Sell.sync();
Pair.sync();

// set up one-to-many relationships b/w Pair->Buy and Pair->Sell
Buy.belongsTo(Pair, { as: 'pair' });
Pair.hasMany(Buy);
Sell.belongsTo(Pair, { as: 'pair' });
Pair.hasMany(Sell);

module.exports = {
  Buy,
  Sell,
  Pair,
  sequelize
};