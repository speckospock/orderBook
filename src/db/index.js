const Sequelize = require('sequelize');
const elasticsearch = require('elasticsearch');
const { orderSchema, pairSchema } = require('./schemas');
const { POSTGRES: { USER, PASSWORD, HOST }} = require('../../config');
const { generateFakeData } = require('./methods');

const sequelize = new Sequelize('orderBook', USER, PASSWORD, {
  host: HOST,
  dialect: 'postgres',
  sync: { force: true },
  syncOnAssociation: true,
  pool: { maxConnections: 25, maxIdleTime: 150},
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Buy = sequelize.define('buy', orderSchema, {
  indexes: [ // A BTREE index with a ordered field
    {
      method: 'BTREE',
      fields: ['price']
    },
    {
      method: 'BTREE',
      fields: ['createdAt']
    }
  ]
});
const Sell = sequelize.define('sell', orderSchema, {
  indexes: [ // A BTREE index with a ordered field
    {
      method: 'BTREE',
      fields: ['price']
    },
    {
      method: 'BTREE',
      fields: ['createdAt']
    }
  ]
});
const Pair = sequelize.define('pair', pairSchema);

Pair
  .sync()
  .then(result => console.log(result))
  .then(() => Pair.findAll())
  .then(([{ dataValues }]) => console.log(dataValues));

Buy.belongsTo(Pair, { as: 'pair' });
Pair.hasMany(Buy);
Sell.belongsTo(Pair, { as: 'pair' });
Pair.hasMany(Sell);

//TEST CORE QUERY:
const sortBuys = () => {
  console.log('starting sort');
  Buy
    .max('price')
    .then(max => Buy.findAll({ where: { price: max }, order: [[sequelize.col('createdAt'), 'ASC']]}))
    .then(results => console.log('ORDERED: ', results.length, results[0], results[results.length - 1]));
};

// let fakeData = generateFakeData(1000);

Buy
  .sync()
  // .then(() => Buy.bulkCreate(fakeData.bids))
  .then(() => Buy.count())
  .then(results => console.log('BUYS: ', results))
  .then(() => sortBuys());

Sell
  .sync()
  // .then(() => Sell.bulkCreate(fakeData.asks))
  .then(() => Sell.count())
  .then(results => console.log('SELLS: ', results));



module.exports = {
  Buy,
  Sell,
  Pair,
  sequelize,
  // elasticClient,
};

// const { generateFakeData } = require('./methods');

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
