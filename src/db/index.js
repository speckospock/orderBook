const Sequelize = require('sequelize');
const elasticsearch = require('elasticsearch');
const { orderSchema, pairSchema } = require('./schemas');
const { POSTGRES: { USER, PASSWORD, HOST }} = require('../../config');

const sequelize = new Sequelize('orderBook', USER, PASSWORD, {
  host: HOST,
  dialect: 'postgres',
  sync: { force: true },
  syncOnAssociation: true,
  pool: { maxConnections: 5, maxIdleTime: 30},
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Buy = sequelize.define('buy', orderSchema);
const Sell = sequelize.define('sell', orderSchema);
const Pair = sequelize.define('pair', pairSchema);

Pair.sync().then(result => console.log(result));

Buy.belongsTo(Pair, {as: 'pair'});
Pair.hasMany(Buy);
Sell.belongsTo(Pair, {as: 'pair'});
Pair.hasMany(Sell);

Buy.sync().then(result => console.log('Buy Sync', result));
Sell.sync().then(result => console.log('Sell Sync', result));

module.exports = {
  Buy,
  Sell,
  Pair,
  sequelize,
  // elasticClient,
};

const { generateFakeData } = require('./methods');

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
