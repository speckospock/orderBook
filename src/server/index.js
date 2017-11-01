process.env.NODE_ENV = 'development';

const AWS = require('aws-sdk');
const { Buy, Sell, Pair, topBuys, topSells } = require('../db');
const { generateFakeData } = require('../db/methods');

//TODO: setup connection to SQS
// Load credentials and set the region from the JSON file
AWS.config.loadFromPath('./config.json');

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var params = {};

sqs.listQueues(params, function(err, data) {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('Success', data.QueueUrls);
  }
});

//TODO: handle incoming orders
//TODO: form outgoing profit messages


//////////////////////
// Start DB actions //
//////////////////////

// Uncomment to generate data upon start (REQUIRES DB WRITE):
// console.time('fakeData');
// let fakeData = generateFakeData(1000, 1.2);
// console.timeEnd('fakeData');

Buy
  .sync()
  // .then(() => Buy.min('price'))
  // .then(res => console.log(res));
  // .then(() => {
  //   console.time('buys');
  //   return Buy.bulkCreate(fakeData.bids);
  // })
  // .then(() => {
  //   // console.timeEnd('buys');
  //   console.time('buysCount');
  //   return Buy.count();
  // })
  // .then(results => {
  //   console.timeEnd('buysCount');
  //   console.log('BUYS: ', results);
  // });
// .then(() => console.log('startSort'))
  // .then(() => {
  //   console.time('topBuys');
  //   topBuys(res => console.log(res[0]));
  //   console.timeEnd('topBuys');
  // });
// .then(() => Buy.max('price'))
// .then(result => console.log('max: ', result));

Sell
  .sync()
  // .then(() => resolveOrder({ id: 2516623, type: 'SELL' }, { vol: 220 }));
// .then(() => console.log('startSort'))
  // .then(() => {
  //   console.time('topSells');
  //   topSells(res => console.log(res[0]));
  //   console.timeEnd('topSells');
  // });
// .then(() => match({ payload: { orderType: 'BID', userId: 2, price: 1.0725, vol: 1}}));
// .then(() => Sell.min('price'))
// .then(result => Sell.findAll({ limit: 10, where: { price: result }, order: [[sequelize.col('createdAt'), 'ASC']]}))
// .then(results => console.log(results));
  // .then(() => {
  //   console.time('sells');
  //   return Sell.bulkCreate(fakeData.asks);
  // })
  // .then(() => {
  //   // console.timeEnd('sells');
  //   console.time('sellCount');
  //   return Sell.count();
  // })
  // .then(results => {
  //   console.timeEnd('sellCount');
  //   console.log('SELLS: ', results);
  // });

console.log('Hello World');