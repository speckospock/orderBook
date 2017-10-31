const { expect, should } = require('chai');
const { topBuys } = require('./mockMethods');
const { Buy, Sell, Pair } = require('./setup');


describe('hooks', function() {
  
  beforeEach(function() {
    //Erase any existing DB and initialize the schema models
    Buy.sync({ force: true });
    Sell.sync({ force: true });
    Pair.sync({ force: true });
  });

  describe('orders', function() {
    describe('topBuys function', function() {
      it('should correctly return the first 10 BUY orders', function(done) {
        let result = [];
        topBuys(top => result = [...top], Buy)
          .then(() => {
            expect(result.length).to.equal(10);
            done();
          })
          .catch(err => done(err));
      });
    });
  });
});
