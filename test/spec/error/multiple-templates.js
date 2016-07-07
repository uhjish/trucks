var expect = require('chai').expect
  , trucks = require('../../../lib');

describe('trucks:', function() {

  it('should error on multiple templates', function(done) {
    trucks(
      {
        files: [
          'test/fixtures/multiple-templates/components.html'
        ]
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/only a single template element/);
        done();
      }
    );
  });

});