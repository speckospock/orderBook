const { Position } = require('..');
const { elasticClient } = require('../../../workers/elasticSetup');

// Open a new user position
module.exports = openPosition = ({userId, price, volume, type}) => {
  type = (type === 'BUY') ? 'long' : 'short';
  // create a position w/ obj passed in
  // save to DB
  elasticClient.index({
    type,
    id: userId,
    index: 'positions',
    body: {
      price,
      volume
    }
  });
  return Position.create({
    userId,
    price,
    volume,
    type,
    orders: [{ price, volume }],
  });
};