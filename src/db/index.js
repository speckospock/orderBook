const Sequelize = require('sequelize');
const elasticsearch = require('elasticsearch');
const { orderSchema, pairSchema, positionSchema } = require('./schemas');
const { POSTGRES: { USER, PASSWORD, HOST }} = require('../../config');
const { generateFakeData } = require('./methods');
const { gte, lte } = Sequelize.Op;

//instrument, time, bid, ask, bid_vol, ask_vol
//bid/ask vol are the total of all new orders w/in that time period plus the total of all resolved orders w/in that time period
//in other words, vol movements

/////////////////////////////
// Sequelize setup/DB init //
/////////////////////////////

// setup Postgres
const sequelize = new Sequelize('orderBook', USER, PASSWORD, {
  host: HOST,
  dialect: 'postgres',
  sync: { force: true },
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

/////////////////////////
// DB model definition //
/////////////////////////

// define a bids table, indexed on price and timestamp for fast queries
const Buy = sequelize.define('buy', orderSchema, {
  indexes: [ // A BTREE index with a ordered field
    {
      method: 'BTREE',
      fields: ['price', 'createdAt']
    }
  ]
});

// define an asks table, indexed on price and timestamp for fast queries
const Sell = sequelize.define('sell', orderSchema, {
  indexes: [ // A BTREE index with a ordered field
    {
      method: 'BTREE',
      fields: ['price', 'createdAt']
    }
  ]
});

// define a simple table to store the valid instruments
const Pair = sequelize.define('pair', pairSchema);

// define a table for open user positions
const Position = sequelize.define('position', positionSchema, {
  indexes: [
    {
      method: 'BTREE',
      fields: ['userId']
    },
  ]
});

Pair.sync();

// set up one-to-many relationships b/w Pair->Buy and Pair->Sell
Buy.belongsTo(Pair, { as: 'pair' });
Pair.hasMany(Buy);
Sell.belongsTo(Pair, { as: 'pair' });
Pair.hasMany(Sell);


////////////////////////////////////////////
// Database query functions (TO BE MOVED) //
////////////////////////////////////////////

// Find the first 10 open orders in the Buy table
const topBuys = callback => {
  console.log('starting sort');
  return Buy
    .max('price')
    .then(max => Buy.findAll({
      limit: 10,
      where: { price: max }, 
      order: [[sequelize.col('price'), 'DESC'], [sequelize.col('createdAt'), 'ASC']]
    }))
    .then(results => callback(results));
};
//console.log('ORDERED: ', results.length, results[0], results[results.length - 1])

// Find the first 10 open orders in the Sell table
const topSells = callback => {
  console.log('starting sort');
  return Sell
    .min('price')
    .then(min => Sell.findAll({
      limit: 10,
      where: { price: min }, 
      order: [[sequelize.col('price'), 'ASC'], [sequelize.col('createdAt'), 'ASC']]
    }))
    .then(results => callback(results));
};

const processOrder = ({type, order}) => {
  let { volume, price } = order;
  if (type === 'BUY') {
    topBuys(top => {
      if (price < top[0].price) {
        Buy.create(order);
      } else {
        let remainingVol = volume;
        let i = 0;
        while (remainingVol > 0 && i < top.length) {
          remainingVol = closeOrder(top[i], remainingVol);
          i++;
        }
        if (remainingVol) {
          //somehow handle this situation where wasn't enough volume to completely resolve order
        }
      }
    });
  }
};

const closeOrder = (order, incomingVol, type) => {
  let { userId, volume, price } = order;
  if (incomingVol < volume) {
    let newVolume = volume - incomingVol;
    resolvePosition({userId, price, volume: incomingVol}, type);
    order.update({ volume: newVolume });
    return 0;
  } else {
    resolvePosition(order, type);
    order.destroy();
    return incomingVol - volume;
  }
};

// Handle an incoming order
const resolveOrder = ({ id, type }, { vol }) => {
  if (type === 'BUY') {
    Buy.findById(id).then(({ dataValues }) => {
      //compare volume
      if (vol > dataValues.vol) {
        // close the order and return remaining volume
      } else if (vol < dataValues.vol) {
        // modify the order
      } else {
        // close the order and return some indication that that's taken place
      }
      console.log(dataValues);
      //resolve the position
    });
  }
  if (type === 'SELL') {
    Sell.findById(id).then(({ dataValues }) => {
      //compare volume
      if (vol > dataValues.vol) {
        // close the order and return remaining volume
      } else if (vol < dataValues.vol) {
        // modify the order
      } else {
        // close the order and return some indication that that's taken place
      }
      console.log(dataValues);
      //check if it closes a position
      //if so, close the position
      //if not, open a position at this price
    });
  }
};

// Handle changes to an open position
const resolvePosition = ({userId, price, volume}, type) => {
  // check id to see if there's a position
  // if so, update/close position as necessary
  // if not, close the position
};

// Close an open position
const closePosition = () => {
  // find position by userId
  // remove the position from the DB
  // Send message to SQS with profit info
};

// Open a new user position
const openPosition = () => {
  // create a position w/ obj passed in
  // insert into DB
};

// Modify an existing position
const updatePosition = () => {
  // find position by userId
  // update values
  // Send message to SQS with profit info
};

// Match an incoming order with an existing order
const match = ({ payload: { userId, orderType, vol, price }}) => {
  if (orderType === 'BID') {
    Sell
      .min('price')
      .then(min => Sell.findAll({
        limit: 10,
        where: { price: min }, 
        order: [[sequelize.col('price'), 'ASC'], [sequelize.col('createdAt'), 'ASC']]
      }))
      .then(res => console.log('MATCHED: ', res[0].dataValues));
  }
  if (orderType === 'ASK') {
    Buy
      .max('price')
      .then(res => console.log(res));
  }
};



//export DB tables
module.exports = {
  Buy,
  Sell,
  Pair,
  sequelize,
  resolveOrder,
  // elasticClient,
};

// const { generateFakeData } = require('./methods');

////////////////////
// Elastic search //
////////////////////

// const elasticClient = new elasticsearch.Client({
//   host: 'localhost:9200',
//   log: 'trace'
// });

// elasticClient.ping({
//   // ping usually has a 3000ms timeout 
//   requestTimeout: 1000
// }, function (error) {
//   if (error) {
//     console.trace('elasticsearch cluster is down!');
//   } else {
//     console.log('All is well');
//   }
// });
