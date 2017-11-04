// module.exports = {
//   generateFakeData: require('./generateFakeData'),
//   topBuys: require('./topBuys'),
//   topSells: require('./topSells'),
//   openPosition: require('./openPosition'),
//   updatePosition: require('./updatePosition'),
//   resolvePosition: require('./resolvePosition'),
//   closeOrder: require('./closeOrder'),
//   processOrder: require('./processOrder'),
//   clearDB: require('./clearDB'),
// };

import generateFakeData from './generateFakeData';
import topBuys from './topBuys';
import topSells from './topSells';
import openPosition from './openPosition';
import updatePosition from './updatePosition';
import resolvePosition from './resolvePosition';
import closeOrder from './closeOrder';
import processOrder from './processOrder';
import clearDB from './clearDB';

export {
  generateFakeData,
  topBuys,
  topSells,
  openPosition,
  updatePosition,
  resolvePosition,
  closeOrder,
  processOrder,
  clearDB,
};
