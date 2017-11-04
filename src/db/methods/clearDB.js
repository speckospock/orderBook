import { Buy, Sell, Pair, Position } from '..';

const clearDB = () => {
  Buy
    .sync({ force: true })
    .then(() => Sell.sync({ force: true }))
    .then(() => Pair.sync({ force: true }))
    .then(() => Position.sync({ force: true }));
};

export default clearDB;