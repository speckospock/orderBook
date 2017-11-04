import { Position } from '..';
import { elasticClient } from '../../../workers/elasticSetup';

// Open a new user position
export const openPosition = ({userId, price, volume, type}) => {
  type = (type === 'BUY') ? 'long' : 'short';
  // create a position w/ obj passed in
  // save to DB
  if (process.env.NODE_ENV === 'development') {
    elasticClient.index({
      type,
      id: userId,
      index: 'positions',
      body: {
        price,
        volume
      }
    });
  }
  return Position.create({
    userId,
    price,
    volume,
    type,
    orders: [{ price, volume }],
  });
};
