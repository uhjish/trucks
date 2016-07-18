var expect = require('chai').expect
  , trucks = require('../../../../../src');

describe('parse:', function() {

  it('should error on duplicate template identifier', function(done) {
    trucks(
      {
        files: ['../../test/fixtures/duplicate-id/components.html'],
        plugins: [trucks.LOAD, require('../../../src')]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/duplicate template identifier/);
        done();
      }
    );
  });

});