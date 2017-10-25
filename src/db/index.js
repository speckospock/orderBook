const Sequelize = require('sequelize');
const elasticsearch = require('elasticsearch');
const { orderSchema, pairSchema } = require('./schemas');
const { POSTGRES: { USER, PASSWORD, HOST }} = require('../../config');

export const sequelize = new Sequelize('orderBook', USER, PASSWORD, {
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

export const elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

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
const Buy = sequelize.define('buy', orderSchema);
const Pair = sequelize.define('Pair', pairSchema);

Buy.belongsTo(Pair);