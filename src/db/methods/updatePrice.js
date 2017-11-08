import { Buy, Sell, cache } from '..';
const AWS = require('aws-sdk');
const { extend } = require('lodash');

export const updatePrice = () => {
  //get current best prices
  let buyPrice;
  let sellPrice;
  Buy.max('price')
    .then(max => buyPrice = max)
    .then(() => Sell.min('price'))
    .then(min => sellPrice = min)
    .then(() => {
      if (cache.bid !== buyPrice || cache.ask !== sellPrice) {
        let message = extend(cache, { bid: buyPrice, ask: sellPrice, time: new Date().toISOString() });
        console.log('message: ', message, 'cache: ', cache);
        //send message to appropriate queue
        //reset cache
      }
    });
};