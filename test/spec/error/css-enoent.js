var expect = require('chai').expect
  , trucks = require('../../../src');

describe('parse:', function() {

  it('should error on non-existent css file', function(done) {
    trucks(
      {
        files: ['test/fixtures/error/css-enoent/components.html']
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/ENOENT/);
        expect(fn).throws(/non-existent.css/);
        done();
      }
    );
  });

});
