var expect = require('chai').expect
  , trucks = require('../../../../../src');

describe('write:', function() {

  it('should error on write with non-existent path', function(done) {
    trucks(
      {
        files: ['../../test/fixtures/simple-inline/components.html'],
        plugins: [
          trucks.SOURCES, 
          trucks.TRANSFORM, 
          trucks.GENERATE,
          require('../../../src')
        ],
        css: 'non-existent/error.css'
      },
      (err) => {
        function fn() {
          throw err;
        }
        expect(fn).throws(/ENOENT/);
        done();
      }
    );
  });

});